"use strict";
//inicia envio de datos desde rust
window.external.invoke("inicio");

//oculta datos hasta que este lista la info
ocultarElemento("appContainer");

//muestra la app
function mostrarApp(isIt) {
  var disp = document.getElementById("appContainer").style.display;
  if (disp == "none" && isIt) {
    document.getElementById("appContainer").style.display = "flex";
  } else {
    document.getElementById("appContainer").style.display = "none";
  }
}

//agrega cabecera de conceptos
function showConcep(isIt) {
  if (isIt) {
    document.getElementById("conceptos").innerHTML = `
    <div class="cabCols" id="concepto_-1">
      <div class="cabrows borde">
        ${concepPrinData(
          "<b>Cantidad</b>",
          "<b>Precio Unitario</b>",
          "<b>Descripción</b>",
          "<b>Descuento</b>",
          "<b>Importe</b>"
        )}
      </div>
    </div>
    `;
  } else {
    document.getElementById("conceptos").innerHTML = "";
  }
}

//agrega un concepto
function addConcep(
  idx,
  cantidad,
  claveUnidad,
  unidad,
  claveProdServ,
  numIde,
  valorUni,
  descrip,
  importe,
  descuento
) {
  var data = [unidad, claveUnidad, claveProdServ, numIde];
  var tit = [
    "Unidad",
    "Clave Unidad",
    "Clave Producto/Servicio",
    "Num. Identificación",
  ];
  for (let i = 0; i < 4; i++) {
    if (data[i] != "") {
      data[i] = `<div class="cabrows flexGrow1">
                  <div class="width12 textAlL flexGrow1"><b>${tit[i]}:</b></div>
                  <div class="width12 textAlL flexGrow2">${data[i]}</div>
                </div>`;
    }
  }
  var concep = `
  <div class="cabCols" id="concepto_${idx}">
      <div class="cabrows borde prim1" id="concepBase_${idx}">
        ${concepPrinData(cantidad, valorUni, descrip, descuento, importe)}
      </div>
      <div class="cabCols flexGrow1" id="concepDet_${idx}">
        <div class ="cabrows datosAdCol borde" id="datosAd_${idx}">
          ${data[0]} ${data[1]} ${data[2]} ${data[3]}
        </div>
      </div>
  </div>
  `;
  elementoClickeable(
    idx,
    "concepto",
    "concepDet",
    concep,
    "concepBase",
    "prim1",
    "prim2"
  );
}

//agrega la cabecera de los impuestos de un concepto
function trasRetConcepCabe(idx) {
  document.getElementById(`datosAd_${idx}`).insertAdjacentHTML(
    "afterend",
    `<div class="borde" id="trasRetConcepCont_${idx}">
      <div id="trasRetConcep_${idx}_-1" class="bordeDownDash cabrows">
        ${trasRetConcepData(
          "Tipo",
          "<b>Impuesto</b>",
          "<b>Base Impuesto</b>",
          "<b>Tipo Factor</b>",
          "<b>Tasa o Cuota</b>",
          "<b>Importe Impuesto</b>"
        )}
      </div>
    </div>`
  );
}

//agrega los datos de un impuesto de un concepto
function addTrasRetConcep(
  idx,
  id,
  tipo,
  importe,
  tasa,
  tipoFactor,
  impuesto,
  base
) {
  var name = "";
  if (tipo == "Traslados") {
    name = "Traslado:";
  } else if (tipo == "Retenciones") {
    name = "Retención:";
    importe = "- " + importe;
  }
  if (tipoFactor == "Tasa") {
    tasa = (Number(tasa) * 100).toFixed(4) + "%";
  }
  document.getElementById(`trasRetConcep_${idx}_${id - 1}`).insertAdjacentHTML(
    "afterend",
    `<div id="trasRetConcep_${idx}_${id}" class="retConcepCont cabrows datosAdCol">
      ${trasRetConcepData(name, impuesto, base, tipoFactor, tasa, importe)}
    </div>`
  );
}

//agrega la cabecera a la tabla de los impuestos generales
function impuestosCabe() {
  document.getElementById(
    "impuestos"
  ).innerHTML = `<div class="bordeUpDash bordeDownDash cabrows" id="impCont_-1">
                                                      ${trasRetImpData(
                                                        "Tipo",
                                                        "<b>Impuesto</b>",
                                                        "<b>Factor</b>",
                                                        "",
                                                        ""
                                                      )}
                                                    </div>`;
}

//agrega los traslados y retenciones dentro del nodo impuestos general
function addTrasRetImp(idx, tipo, impuesto, factor, tasa, importe) {
  if (tipo == "Retencion") {
    importe = "- " + importe;
  }
  if (factor == "Tasa") {
    tasa = (Number(tasa) * 100).toFixed(4) + "%";
  }
  document.getElementById(`impCont_${idx - 1}`).insertAdjacentHTML(
    "afterend",
    `<div class="cabrows" id="impCont_${idx}">
      ${trasRetImpData(tipo, impuesto, factor, tasa, importe)}
    </div>`
  );
}

//agrega titulo y datos alineados a la derecha o a la izquierda con borde
function rellenar(id, titulo, data, borde) {
  if (borde) {
    reInfoTitData(id, "cabrowsStart flexGrow1 borde", "textAlL", titulo, data);
  } else {
    reInfoTitData(id, "cabrowsStart flexGrow1", "textAlR", titulo, data);
  }
}

//agrega titulo y datos en distinstas filas
function rellenar_cortado(id, titulo, data) {
  reInfoTitData(id, "", "textAlL", titulo, data);
}

//agrega el qr
function ponerQr(data) {
  if (data != "") {
    new QRCode("qr", {
      text: data,
      width: 512,
      height: 512,
      colorDark: "#232323",
      colorLigth: "#f9f9f9",
      correctLevel: QRCode.CorrectLevel.H,
    });
  } else {
    ocultarElemento(id);
  }
}

//crea bloque para documentos relacionados
function rellenarRelacionadosCabe(tipo) {
  document.getElementById(
    "relacionadosAll"
  ).innerHTML = `<div id="relacionadosCab" class="borde cabCols">
                    <div class="cabrows bordeDownDash" id="relacionadosTit">
                      <div class="width12 textAlL flexGrow1" ><b>Documentos Relacionados:</b></div>
                      <div class="cabrowsStart flexGrow1" id="tipoRelacion">
                        <div class="width12 textAlL flexGrow1"><b>Tipo de Relación:</b></div>
                        <div class="width12 textAlL flexGrow2"> ${tipo}</div>
                      </div>
                    </div>
                    <div class="cabCols" id="relacionadoCab"></div>
                </div>`;
}

//agrega un documento relacionado
function addRelacionado(id, uuid) {
  if (uuid != "") {
    var info = `<div id="relacion_${id}" class="cabrowsStart">
                  <div class="width12 textAlL flexGrow1"><b>Comprobante Relacionado UUID:</b></div>
                  <div class="width12 textAlL flexGrow2">${uuid}</div>
                </div>`;
    if (id == 0) {
      document.getElementById("relacionadoCab").innerHTML = info;
    } else {
      document
        .getElementById(`relacion_${idx - 1}`)
        .insertAdjacentHTML("afterend", info);
    }
  }
}

//pone si es validoo no el comprobante conforme la respuesta de la pagina del sat
function esValido(val) {
  if (val == "Vigente") {
    document.getElementById(
      "validar"
    ).innerHTML = `<b class="success">Comprobante Valido y Vigente</b>`;
  } else if (val == "pendienteOk") {
    document.getElementById(
      "validar"
    ).innerHTML = `<b class="warning">Respuesta Incompleta del Servicio de Validación, Intentelo Mas Tarde</b>`;
  } else if (val == "pendienteNo2xx") {
    document.getElementById(
      "validar"
    ).innerHTML = `<b class="warning">Sin Respuesta del Servicio de Validación, Intentelo Mas Tarde</b>`;
  } else {
    document.getElementById(
      "validar"
    ).innerHTML = `<b class="danger">Respuesta de Validación Negativa: ${val}</b>`;
  }
}

//agrega la cabecera del complemento de pagos
function pagosCont() {
  document.getElementById(
    "pagos"
  ).innerHTML = `<div class="cabCols borde" id="pagosCont">
                                                <div class="" id=""><b>Complemento de Pago</b></div>
                                                <div class="cabrows bordeDownDash bordeUpDash" id="pagoCabe_-1">
                                                  ${pagoPrinData(
                                                    "<b>Fecha de Pago</b>",
                                                    "<b>Forma de Pago</b>",
                                                    "<b>Moneda de Pago</b>",
                                                    "<b>Monto de Pago</b>"
                                                  )}
                                                </div>
                                              </div>`;
}

//agrega un pago en el complemento de pagos
function pagoCabe(id, fechaP, formaPP, monedaP, montoP, otros) {
  //otros datos: TipoCambioP, NumOperacion, RfcEmisorCtaOrd, NomBancoOrdExt, CtaOrdenante, RfcEmisorCtaBen, CtaBeneficiario, TipoCadPago, CertPago, CadPago, SelloPago
  let val_otros = [
    "Tipo de Cambio",
    "Numero Operación",
    "RFC Emisor Cta Ord",
    "Nombre Banco Ord",
    "Cuenta Ordenante",
    "RFC Emisor Cuenta Beneficiario",
    "Cuenta Beneficiario",
    "Tipo Cadena de Pago",
    "Certificado de Pago",
    "Cadena de Pago",
    "Sello de Pago",
  ];
  var infoAdentro = ``;
  for (let i = 0; i < otros.length; i++) {
    if (otros[i] != "") {
      var tit = divE(
        "width12 textAlL flexGrow1",
        "",
        `<b>${val_otros[i]}: </b>`
      );
      var dat = divE(`width12 textAlL flexGrow1`, "", otros[i]);
      infoAdentro += divE("flexGrow1 cabrows", "", tit + dat);
    }
  }
  var infoAdicional = divE("flexWrap cabrows", `infoAdP_${id}`, infoAdentro);
  var infoPago = divE("cabCols", `pagoDet_${id}`, infoAdicional);
  var pago = `<div class="pagoCont" id="pagoCabe_${id}">
                <div class="cabrows borde prim1" id="pagoBase_${id}">
                  ${pagoPrinData(fechaP, formaPP, monedaP, montoP)}
                </div>
                ${infoPago}
              </div>`;
  //evento al click
  elementoClickeable(
    id,
    "pagoCabe",
    "pagoDet",
    pago,
    "pagoBase",
    "prim1",
    "prim2"
  );
}

function docPago(idP, idD, data) {
  let val_rel = [
    "Documento",
    "Moneda Documento",
    "Metodo Pago Documento",
    //una linea
    "Serie",
    "Folio",
    "Tipo Cambio documento",
    "Num. Parcialidad",
    //otra linea
    "Saldo Anterior",
    "Importe Pagado",
    "Nuevo Saldo",
  ];
  let clasesBase = [
    "flexGrow2 minWidth2",
    "flexGrow1 width20",
    "flexGrow1 width30",
  ];
  //si idD es 0 agregas cabecera del documento relacionado
  if (idD == 0) {
    let dataCabe = "";
    for (let i = 0; i < 3; i++) {
      dataCabe += divE(clasesBase[i], "", `<b>${val_rel[i]}</b>`);
    }
    let cabecera = divE(
      "cabrows bordeUpDash bordeDownDash",
      `docRelPago_${idP}_-1`,
      dataCabe
    );
    var titulo = divE("flexGrow1", "", "<b>Documentos Relacionados</b>");
    var container = divE("cabCols borde", "", titulo + cabecera);
    document
      .getElementById(`infoAdP_${idP}`)
      .insertAdjacentHTML("afterend", container);
  }
  //base
  let baseData = "";
  for (let i = 0; i < 3; i++) {
    baseData += divE(clasesBase[i], "", `<b>${data[i]}</b>`);
  }
  let base = divE(
    "cabrows borde prim3 flexGrow1",
    `baseRP_${idP}_${idD}`,
    baseData
  );
  //demas datos
  var infoAdentro = ``;
  for (let i = 3; i < 7; i++) {
    if (data[i] != "") {
      let tit = divE("width12 textAlL flexGrow1", "", `<b>${val_rel[i]}: </b>`);
      let dat = divE(`width12 textAlL flexGrow1`, "", data[i]);
      infoAdentro += divE("flexGrow1 cabrows", "", tit + dat);
    }
  }
  var infoAdicional1 = divE("cabrows", "", infoAdentro);
  infoAdentro = ``;
  for (let i = 7; i < 10; i++) {
    if (data[i] != "") {
      let tit = divE("width12 textAlL flexGrow1", "", `<b>${val_rel[i]}: </b>`);
      let dat = divE(`width12 textAlL flexGrow1`, "", data[i]);
      infoAdentro += divE("flexGrow1 cabrows", "", tit + dat);
    }
  }
  var infoAdicional2 = divE("cabrows", "", infoAdentro);
  var infoAdCompl = divE(
    "cabCols",
    `infoAdRP_${idP}_${idD}`,
    infoAdicional1 + infoAdicional2
  );
  var htmlAgreg = divE(
    "cabCols",
    `docRelPago_${idP}_${idD}`,
    base + infoAdCompl
  );
  elementoClickeable(
    idD,
    `docRelPago_${idP}`,
    `infoAdRP_${idP}`,
    htmlAgreg,
    `baseRP_${idP}`,
    "prim3",
    "prim4"
  );
}

//agrega impuestos en un comprobante de pago
function addTrasRetPago(idP, idx, tipo, impuesto, factor, tasa, importe) {
  if (idx == 0) {
    let cabecera = `<div class="bordeUpDash bordeDownDash cabrows" id="impPago_${idP}_-1">
                      ${trasRetImpData(
                        "Tipo",
                        "<b>Impuesto</b>",
                        "<b>Factor</b>",
                        "<b>Tasa o Cuota</b>",
                        "<b>Importe</b>"
                      )}
                  </div>`;
    var titulo = divE("flexGrow1", "", "<b>Impuestos</b>");
    var container = divE("cabCols borde", "", titulo + cabecera);
    document
      .getElementById(`infoAdP_${idP}`)
      .insertAdjacentHTML("afterend", container);
    //agregar cabecera
  }
  if (tipo == "Retencion") {
    importe = "- " + importe;
  }
  if (factor == "Tasa") {
    tasa = (Number(tasa) * 100).toFixed(4) + "%";
  }
  document.getElementById(`impPago_${idP}_${idx - 1}`).insertAdjacentHTML(
    "afterend",
    `<div class="cabrows" id="impPago_${idP}_${idx}">
      ${trasRetImpData(tipo, impuesto, factor, tasa, importe)}
    </div>`
  );
}

//informacion de aduana y cuenta predial en el concepto
function infoAduCuentaPred(idx, nombre, titulo, data) {
  document.getElementById(`datosAd_${idx}`).insertAdjacentHTML(
    "afterend",
    `<div class="borde cabrows" id="${nombre}Cont_${idx}">
    </div>`
  );
  rellenar(`${nombre}Cont_${idx}`, titulo, data);
}

//informacion de parte dentro de concepto
function parteConcep(idx, req, opc, ped) {
  var titReq = ["Clave Producto/Servicio", "Cantidad", "Descripción"];
  var titOp = ["Num. Identificacion", "Unidad", "Valor Unitario", "Importe"];
  var dataRequerida = "";
  var dataOp = "";
  for (let i = 0; i < req.length; i++) {
    if (req[i] != "") {
      let tit = divE("width12 textAlL flexGrow1", "", `<b>${titReq[i]}: </b>`);
      let dat = divE(`width12 textAlL flexGrow1`, "", req[i]);
      dataRequerida += divE("flexGrow1 cabrows borde", "", tit + dat);
    }
  }
  for (let i = 0; i < opc.length; i++) {
    if (opc[i] != "") {
      let tit = divE("width12 textAlL flexGrow1", "", `<b>${titOp[i]}: </b>`);
      let dat = divE(`width12 textAlL flexGrow1`, "", opc[i]);
      dataOp += divE("flexGrow1 cabrows borde", "", tit + dat);
    }
  }
  var opcional = "";
  if (dataOp != "") {
    opcional = divE("cabrows flexWrap", `parteConOp_${idx}`, dataOp);
  }
  var pedimento = "";
  for (let i = 0; i < ped.length; i++) {
    if (ped[i] != "") {
      let tit = divE(
        "width12 textAlL flexGrow1",
        "",
        `<b>Información Aduanera - Numero de Pedimento: </b>`
      );
      let dat = divE(`width12 textAlR flexGrow1`, "", ped[i]);
      pedimento += divE("flexGrow1 cabrows borde", "", tit + dat);
    }
  }
  var colorTit = "prim3";
  document.getElementById(`datosAd_${idx}`).insertAdjacentHTML(
    "afterend",
    `<div class="borde cabCols" id="parteConcepCont_${idx}">
      <div id="parteConCabe_${idx}" class="bordeDownDash ${colorTit}"><b>Parte</b></div>
      <div id="parteCuerpo_${idx}" class="cabCols">
      <div id="parteConReq_${idx}" class="cabrows">${dataRequerida}</div>
      ${opcional}
      ${pedimento}
      </div>
    </div>`
  );
  soloClicker(`parteConCabe_${idx}`, `parteCuerpo_${idx}`, colorTit, "prim4");
}

//funciones internas para acortar codigo
/*
 <div id="idCabe_idx">
  <div id="idBase"></div>
  <div id="idDet"></div>
 </div>
 */
//agrega funcionalidad para mostrar y ocultar info adicional
function elementoClickeable(
  idx,
  idCabe,
  idDet,
  htmlAgreg,
  idBase,
  color1,
  color2
) {
  document
    .getElementById(`${idCabe}_${idx - 1}`)
    .insertAdjacentHTML("afterend", htmlAgreg);
  soloClicker(`${idBase}_${idx}`, `${idDet}_${idx}`, color1, color2);
}

function soloClicker(idBase, idDet, color1, color2) {
  var base = document.getElementById(idBase);
  var borrable = document.getElementById(idDet);
  borrable.style.display = "none";
  //evento al click
  base.addEventListener("click", () => {
    if (borrable.style.display == "none") {
      borrable.style.display = "flex";
      base.classList.add(color2);
      base.classList.remove(color1);
    } else {
      base.classList.remove(color2);
      base.classList.add(color1);
      borrable.style.display = "none";
    }
  });
}

//retorna un div
function divE(clase, id_di, data) {
  return `<div class="${clase}" id="${id_di}">${data}</div>`;
}

//crea datos para un pago
function pagoPrinData(fechaP, formaPP, monedaP, montoP) {
  return `${divE("width30 flexGrow1", "fechaP", fechaP)}
          ${divE("width30 flexGrow1", "formaPagoP", formaPP)}
          ${divE("width20 flexGrow1", "monedaP", monedaP)}
          ${divE("width20 flexGrow1", "montoP", montoP)}
          `;
}

//crea datos para un concepto
function concepPrinData(cantidad, valorUni, descrip, descuento, importe) {
  return `${divE("flexGrow1 width12", "", cantidad)}
          ${divE("flexGrow1 width12", "", valorUni)}
          ${divE("flexGrow4 minWidth2", "", descrip)}
          ${divE("flexGrow1 width12", "", descuento)}
          ${divE("flexGrow1 width12", "", importe)}
          `;
}

//crea datos para un impuesto dentro de un conceto
function trasRetConcepData(name, impuesto, base, tipoFactor, tasa, importe) {
  return `${divE("width16 textAlL", "", `<b>${name}: </b>`)}
          ${divE("width16 flexGrow1 textAlL", "", impuesto)}
          ${divE("width20 flexGrow2 textAlL", "", base)}
          ${divE("width16 flexGrow1 textAlL", "", tipoFactor)}
          ${divE("width16 flexGrow1 textAlL", "", tasa)}
          ${divE("width16 flexGrow2 textAlL", "", importe)}`;
}

// crea datos para los impuestos globales
function trasRetImpData(tipo, impuesto, factor, tasa, importe) {
  return `${divE("width20 textAlL", "", `<b>${tipo}: </b>`)}
          ${divE("width20 textAlL flexGrow1", "", impuesto)}
          ${divE("width20 textAlL flexGrow1", "", factor)}
          ${divE("width20 textAlL flexGrow1", "", tasa)}
          ${divE("width20 textAlR flexGrow4", "", importe)}
          `;
}

//apoya la función rellenar y rellenarCabe
function reInfoTitData(id, clase, lado, titulo, data) {
  if (data != "") {
    var tit = divE("width12 textAlL flexGrow1", "", `<b>${titulo}: </b>`);
    var dat = divE(`width12 ${lado} flexGrow2`, "", data);
    document.getElementById(id).innerHTML = divE(clase, "", `${tit}${dat}`);
  } else {
    ocultarElemento(id);
  }
}

//oculta un elemento del html mediante css
function ocultarElemento(id) {
  document.getElementById(id).style.display = "none";
}

//envia información a rust
function debug(data) {
  window.external.invoke(data);
}

//Hace la cabecera y contenedor del nodo
function cabezaNodo(
  nom_p,
  id_padre,
  el_name,
  titulo,
  capa,
  id_nodo,
  id_acomodo
) {
  var color1, color2;
  if (capa % 2 == 0) {
    color1 = "prim1";
    color2 = "prim2";
  } else {
    color1 = "prim3";
    color2 = "prim4";
  }
  var titDiv = divE(
    `titulo bordeDownDash ${color1}`,
    `${el_name}_${id_nodo}_titulo`,
    `<b>${titulo}</b>`
  );
  var cuerpo = divE("cuerpo cabCols", `${el_name}_${id_nodo}_cuerpo`, "");
  var contenedor = divE(
    `cabCols borde`,
    `${nom_p}_${id_padre}_${id_acomodo}`,
    titDiv + cuerpo
  );
  if (capa == 0) {
    var contenedor = divE(
      `cabCols borde`,
      `${el_name}_${id_nodo}`,
      titDiv + cuerpo
    );
    document
      .getElementById(`${nom_p}`)
      .insertAdjacentHTML("afterend", contenedor);
  } else if (id_acomodo == 0) {
    document.getElementById(
      `${nom_p}_${id_padre}_cuerpo`
    ).innerHTML = contenedor;
  } else {
    document
      .getElementById(`${nom_p}_${id_padre}_${id_acomodo - 1}`)
      .insertAdjacentHTML("afterend", contenedor);
  }
  soloClicker(
    `${el_name}_${id_nodo}_titulo`,
    `${el_name}_${id_nodo}_cuerpo`,
    color1,
    color2
  );
}

//pone atributos despues de nom_h_idx-1
function atributosNodo(el_name, capa, id_nodo, titAtt, att) {
  var atributos = "";
  for (let i = 0; i < att.length; i++) {
    let nameAt = divE("width12 textAlL flexGrow1", "", `<b>${titAtt[i]}: </b>`);
    let dataAt = divE(`width12 textAlL flexGrow1`, "", att[i]);
    atributos += divE(`borde cabrows flexGrow1`, "", nameAt + dataAt);
  }
  var atributosCont = divE(
    `flexWrap cabrows`,
    `${el_name}_${id_nodo}_0`,
    atributos
  );
  document.getElementById(
    `${el_name}_${id_nodo}_cuerpo`
  ).innerHTML = atributosCont;
}

