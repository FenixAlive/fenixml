//#![windows_subsystem = "windows"]
use web_view::*;
use tinyfiledialogs as tfd;
use std::{env, fs, path::Path};
use xmltree::Element;
use format_money::format_money;

fn main() {
    let args: Vec<String> = env::args().collect();
    let mut open_file: String = String::new();
    if args.len() > 1 {
        open_file = args[1].to_owned();
    }else{
        match tfd::open_file_dialog("Elige XML de CFDI a ver", "", None){
            Some(file) => {open_file = file},
            None => {tfd::message_box_yes_no("No elegiste ningun archivo", "¿Quieres buscar de nuevo?", tfd::MessageBoxIcon::Question, tfd::YesNo::No);}
        };
    }
    let html = format!(include_str!("./app/app.html"),
                css = include_str!("./app/styles.css"),
                qrcode = include_str!("./app/qrcode.min.js"),
                javascript = include_str!("./app/app.js")
            );
    if let Some(cfdi) = leer_cfdi(Path::new(&open_file)) {
        web_view::builder()
        .title("Visor CFDI 3.3 desde XML")
        .content(Content::Html(html))
        .size(800, 500)
        .resizable(true)
        .debug(true)
        .user_data(())
        .invoke_handler(|webview, arg| {
            if arg == "inicio" {
                datos_cfdi_(webview, &cfdi)?;
            }
            Ok(())
        })
        .run()
        .unwrap();
    }
}

//función que implementa el leer un cfdi y validarlo de forma simple
fn leer_cfdi(path: &Path) -> Option<Element>{
    if path.extension() == Some(std::ffi::OsStr::new("xml")){
        let xml = match fs::read_to_string(path) {
            Ok(xm) => xm,
            Err(e) => {
                tfd::message_box_ok("Error", "Error al leer el archivo", tfd::MessageBoxIcon::Error);
                eprintln!("Error en la extension {}", e);
                return None;
            }
        };
        let xml : Vec<&str> = xml.split("\u{feff}").collect(); 
        let xml_final: &str;
        if xml.len() > 1{
            xml_final = xml[1];
        }else{
            xml_final = xml[0];
        }
        match Element::parse(xml_final.as_bytes()) {
            Ok(cfdi) => {
                if cfdi.name != "Comprobante" || get_data(&cfdi, "Version") != "3.3"{
                    tfd::message_box_ok("Error", "Este xml no es un comprobante CFDI v.3.3 valido", tfd::MessageBoxIcon::Error);
                    eprintln!("Comprobante no valido");
                    return None
                }else {
                    return Some(cfdi)
                }
            },
            Err(e) => {
                tfd::message_box_ok("Error", "Comprobante no valido", tfd::MessageBoxIcon::Error);
                eprintln!("Comprobante no valido {}", e);
                return None;
                }
        }
    }else{
        tfd::message_box_ok("Error", "Extensión del archivo no valida", tfd::MessageBoxIcon::Error);
        eprintln!("Extensión del archivo no valida");
    }
    return None;
}

//función que lea datos del cfdi y vaya mandandolas a funciones js para llenar
fn datos_cfdi_(web: &mut web_view::WebView<'_, ()>, cfdi: & Element) -> Result<(), web_view::Error> {
    let mut uuid: &str = "";
    let mut rfc_emi: &str = "";
    let mut rfc_rec: &str = "";
    let total = get_data(&cfdi, "Total");
    mandar_datos_web_view(web, cfdi, "Serie", "serie", "Serie")?;
    mandar_datos_web_view(web, cfdi, "Folio", "folio", "Folio")?;
    mandar_datos_web_view(web, cfdi, "Fecha", "fecha", "Fecha")?;
    mandar_datos_web_view(web, cfdi, "TipoDeComprobante", "tipoComp", "Tipo Comprobante")?;
    mandar_datos_web_view(web, cfdi, "LugarExpedicion", "lugarExp", "C.P. Expedición")?;
    mandar_datos_web_view(web, cfdi, "Version", "versionCfdi", "Versión CFDI")?;
    mandar_datos_web_view(web, cfdi, "MetodoPago", "metodoPago", "Metodo de Pago")?;
    mandar_datos_web_view(web, cfdi, "FormaPago", "formaPago", "Forma de Pago")?;
    let subtotal = get_data(&cfdi, "SubTotal");
    web.eval(&format!("rellenar('{}', '{}', '{}')", "subtotal", "Subtotal", format_money(subtotal)))?;
    //si hay descuento mostrar linea de neto subtotal
    let descuento = get_data(&cfdi, "Descuento");
    if descuento != ""{
        let sub_num = match subtotal.parse::<f64>() {
            Ok(val) => val,
            Err(_) => 0.0,
        };
        let des_num = match descuento.parse::<f64>() {
            Ok(val) => val,
            Err(_) => 0.0,
        };
        let suma_sub = &format!("{:.2}",(sub_num-des_num));
        web.eval(&format!("rellenar('{}', '{}', '{}')", "descuento", "Descuento", format_money(descuento)))?;
        web.eval(&format!("rellenar('{}', '{}', '{}')", "subNeto", "Subtotal Neto", format_money(suma_sub)))?;
    }
    web.eval(&format!("rellenar('{}', '{}', '{}')", "total", "Total", format_money(total)))?;
    mandar_datos_web_view(web, cfdi, "Moneda", "moneda", "Moneda")?;
    mandar_datos_web_view(web, cfdi, "NoCertificado", "certEmi", "Numero de Certificado Emisór")?;
    //si el tipo de cambio existe y es distinto de 1 hacer calculo  de total en pesos y mandarlo
    let tipo_cambio = get_data(&cfdi, "TipoCambio");
    if tipo_cambio != "1" && tipo_cambio != ""{
        let tipo_cambio_num = match tipo_cambio.parse::<f64>() {
            Ok(val) => val,
            Err(_) => 0.0,
        };
        let total_num = match total.parse::<f64>() {
            Ok(val) => val,
            Err(_) => 0.0,
        };

        let total_pesos = format!("{}",total_num * tipo_cambio_num);
        web.eval(&format!("rellenar('{}', '{}', '{}')", "tipoCambio", "Tipo de Cambio", format_money(tipo_cambio)))?;
        web.eval(&format!("rellenar('{}', '{}', '{}')", "totalPesos", "Total en Pesos", format_money(&total_pesos)))?;
    }
    //iterar cfdi
    for cf in cfdi.children.iter(){
        match cf.name.as_ref() {
            "Emisor" => {
                rfc_emi = get_data(cf, "Rfc");
                mandar_datos_web_view(web, cf, "Rfc", "rfcEmi", "RFC")?;
                mandar_datos_web_view(web, cf, "Nombre", "razonEmi", "Razón Social")?;
                mandar_datos_web_view(web, cf, "RegimenFiscal", "regimenEmi", "Regimen Fiscal")?;
            },
            "Receptor" => {
                rfc_rec = get_data(cf, "Rfc");
                mandar_datos_web_view(web, cf, "Rfc", "rfcRec", "RFC")?;
                mandar_datos_web_view(web, cf, "Nombre", "razonRec", "Razón Social")?;
                mandar_datos_web_view(web, cf, "UsoCFDI", "usoCfdi", "Uso CFDI")?;
            },
            "Conceptos" => {

            }, 
            "Impuestos" => {
                //sum_imp = cfdi_impuestos(&cf);
            },
            "Complemento" => {
                for com in cf.children.iter() {
                    match com.name.as_ref(){
                        "TimbreFiscalDigital" => {
                            mandar_datos_web_view(web, com, "FechaTimbrado", "fechaTimbre", "Fecha de Timbrado")?;
                            mandar_datos_web_view(web, com, "NoCertificadoSAT", "certSat", "Numero de Certificado SAT")?;
                            web.eval(&format!("rellenar_cortado('{}', '{}', '{}')", "selloSat", "Sello Digital del SAT", get_data(&com, "SelloSAT")))?;
                            uuid = get_data(&com, "UUID");
                            web.eval(&format!("rellenarCabe('{}', '{}', '{}')", "uuid", "Folio Fiscal UUID",uuid))?;
                            let mut leyenda = String::from(get_data(&com, "Leyenda"));
                            if leyenda != ""{
                                leyenda = format!("|{}", leyenda);
                            }
                            let cadena = format!("||{}|{}|{}|{}{}|{}|{}||", get_data(&com, "Version"), uuid, get_data(&com, "FechaTimbrado"), get_data(&com, "RfcProvCertif"), leyenda, get_data(&com, "SelloCFD"), get_data(&com, "NoCertificadoSAT") );
                            web.eval(&format!("rellenar_cortado('{}', '{}', '{}')", "cadenaTim", "Cadena Original del Timbre",cadena))?;
                        },
                        "Pagos" => {
                            //total_pagado = total_pagos(&com);
                        },
                        _ => println!("falta en Complemento: {:?}", com.name)
                    }
                }
            },
            _ => println!("falta en cfdi: {:?}", cf.name)
        }
    }
    
    /*
    
    let iva = &format!("{:.2}", (sum_imp.0).0);
    let ieps = &format!("{:.2}", (sum_imp.0).1);
    let ret_isr = &format!("{:.2}", (sum_imp.1).0);
    let ret_iva = &format!("{:.2}", (sum_imp.1).1);
    let ret_ieps = &format!("{:.2}", (sum_imp.1).2);
    if tipo_comprobante != "P" && metodo_pago == "PUE" {
        total_pagado = String::from(&total_pesos);
    }
    */
    let sello = get_data(&cfdi, "Sello");
    web.eval(&format!("rellenar_cortado('{}', '{}', '{}')", "selloEmi", "Sello Digital del CFDI", sello))?;
    //imprimir qr
    web.eval(&format!("ponerQr('https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id={}&re={}&rr={}&tt={}&fe={}')", uuid, rfc_emi, rfc_rec, total, &sello[sello.len()-8..]))?;
    //validar xml
    
    Ok(())
}

fn mandar_datos_web_view(web: &mut web_view::WebView<'_, ()>, cfdi: & Element, at_xml: &str, id_html: &str, tit_htlm: &str) ->  Result<(), web_view::Error>{
    let dato =  get_data(&cfdi, at_xml);
    if dato != "" {
        web.eval(&format!("rellenar('{}', '{}', '{}')", id_html, tit_htlm, dato))?;
    }
    Ok(())
}

//función que me ayuda a leer los elementos del cfdi mas rapido
fn get_data<'a>(cfdi: &'a Element, key: &str) -> &'a str {
    match cfdi.attributes.get(key) {
        Some(d) => {
            //println!("{}: {}", key, d);
            return d;
            },
        None => {
            println!("{} no existe", key);
            return "";
        }
    };
}

fn cfdi_impuestos(cf: &Element) -> ((f64, f64), (f64, f64, f64)) {
    // impuestos = (traslado(iva, ieps), retencion(isr, iva, ieps))
    let mut impuestos = ((0.0, 0.0), (0.0, 0.0, 0.0));
    for im in cf.children.iter() {
        match im.name.as_ref() {
            "Traslados" =>{
                let imp_temp = sumas_impuestos(&im);
                impuestos.0 = (imp_temp.1, imp_temp.2);
            },
            "Retenciones" => {
                impuestos.1 = sumas_impuestos(&im);
            },
            _ => println!("falta en impuestos: {:?}", im.name)
        }
    }
    impuestos
}

fn sumas_impuestos(impuesto: &Element) -> (f64, f64, f64){
    let mut sum_imp = (0.0, 0.0, 0.0);
    for imp in impuesto.children.iter() {
                    match get_data(&imp, "Impuesto").as_ref() {
                        "001" => { //ISR
                            sum_imp.0 += evaluar_importe(&imp, "Importe");
                        },
                        "002" => { //IVA
                            sum_imp.1 += evaluar_importe(&imp, "Importe");
                        },
                        "003" => { //IETU
                            sum_imp.2 += evaluar_importe(&imp, "Importe");
                        },
                        _ => println!("falta de atributos en {}: {:?}",impuesto.name, imp.name)
                    }
    }
    sum_imp
}

fn evaluar_importe(imp: &Element, att: &str) -> f64{
    if let Some(val) = imp.attributes.get(att) {
                            match val.parse::<f64>() {
                                Ok(val) => return val,
                                Err(_) => {}
                            };
                        };
    0.0
}

fn total_pagos(pagos: &Element) -> String{
    let mut monto_total = 0.0;
    for pago in pagos.children.iter() {
        monto_total += evaluar_importe(&pago, "Monto");
    }
    format!("{:.2}", monto_total)
}