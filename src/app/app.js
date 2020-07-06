'use strict'

window.external.invoke("inicio");

var htmlHide = {
  app: true
}
ocultarElemento("appContainer");

function mostrarApp(isIt){
  if (htmlHide.app && isIt){
    document.getElementById("appContainer").style.display="flex";
  }else if(!htmlHide.app && !isIt){
    document.getElementById("appContainer").style.display="none";
  }
  htmlHide.app= !htmlHide.app;
}

function showConcep(isIt){
  if (isIt){
    document.getElementById("conceptos").innerHTML=`
    <div class="cabCols" id="concepto_-1">
      <div class="cabrows borde">
        <div class="flexGrow1 width12"><b>Cantidad</b></div>
        <div class="flexGrow1 width12"><b>Precio Unitario</b></div>
        <div class="minWidth2 flexGrow4"><b>Descripción</b></div>
        <div class="flexGrow1 width12"><b>Descuento</b></div>
        <div class="flexGrow1 width12"><b>Importe</b></div>
      </div>
    </div>
    `;
  }else{
    document.getElementById("conceptos").innerHTML="";
  }
}

function addConcep(idx, cantidad, claveUnidad, unidad, claveProdServ, numIde, valorUni, descrip, importe, descuento){
  var data = [unidad, claveUnidad, claveProdServ, numIde];
  var tit = ["Unidad", "Clave Unidad", "Clave Producto/Servicio", "Num. Identificación"];
  for(let i=0; i<4;i++){
    if(data[i] != ""){
      data[i] = `<div class="cabrows flexGrow1">
                  <div class="width12 textAlL flexGrow1"><b>${tit[i]}:</b></div>
                  <div class="width12 textAlL flexGrow2">${data[i]}</div>
                </div>`;
    }
  }
  var concep = `
  <div class="cabCols" id="concepto_${idx}">
      <div class="cabrows borde prim1" id="concepBase_${idx}">
        <div class="flexGrow1 width12">${cantidad}</div>
        <div class="flexGrow1 width12">${valorUni}</div>
        <div class="minWidth2 flexGrow4">${descrip}</div>
        <div class="flexGrow1 width12">${descuento}</div>
        <div class="flexGrow1 width12">${importe}</div>
      </div>
      <div class="cabCols flexGrow1" id="concepDet_${idx}">
        <div class ="cabrows datosAdCol borde" id="datosAd_${idx}">
          ${data[0]}
          ${data[1]}
          ${data[2]}
          ${data[3]}
        </div>
      </div>
  </div>
  `;
  elementoClickeable(idx, "concepto", "concepDet", concep, "concepBase", "prim1", "prim2");
}

function trasRetConcepCabe(idx){
  document.getElementById(`datosAd_${idx}`).insertAdjacentHTML("afterend", `<div class="borde" id="trasRetConcepCont_${idx}">
                                                                              <div id="trasRetConcep_${idx}_-1" class="bordeDownDash cabrows">
                                                                                <div class="width16 textAlL"><b>Tipo</b></div>
                                                                                <div class="width16 flexGrow1 textAlL"><b>Impuesto</b></div>
                                                                                <div class="width20 flexGrow2 textAlL"><b>Base Impuesto</b></div>
                                                                                <div class="width16 flexGrow1 textAlL"><b>Tipo de Factor</b></div>
                                                                                <div class="width16 flexGrow1 textAlL"><b>Tasa o Cuota</b></div>
                                                                                <div class="width16 flexGrow2 textAlL"><b>Importe Impuesto</b></div>
                                                                              </div>
                                                                            </div>`);
}

function addTrasRetConcep(idx, id, tipo, importe, tasa, tipoFactor, impuesto, base){
  var name = "";
  if(tipo == "Traslados"){
    name = "Traslado:";
  }else if(tipo == "Retenciones"){
    name = "Retención:";
    importe = "- "+importe;
  }
  if (tipoFactor == "Tasa"){
    tasa = (Number(tasa)*100).toFixed(4)+"%";
  }
  document.getElementById(`trasRetConcep_${idx}_${id-1}`).insertAdjacentHTML("afterend", `<div id="trasRetConcep_${idx}_${id}" class="retConcepCont cabrows datosAdCol">
                                                                              <div class="width16 textAlL"><b>${name}</b></div>
                                                                              <div class="width16 flexGrow1 textAlL">${impuesto}</div>
                                                                              <div class="width20 flexGrow2 textAlL">${base}</div>
                                                                              <div class="width16 flexGrow1 textAlL">${tipoFactor}</div>
                                                                              <div class="width16 flexGrow1 textAlL">${tasa}</div>
                                                                              <div class="width16 flexGrow2 textAlL">${importe}</div>
                                                                            </div>`);
}
//agrega la cabecera a la tabla de los impuestos generales
function impuestosCabe(){
  document.getElementById("impuestos").innerHTML = `<div class="bordeUpDash bordeDownDash cabrows" id="impCont_-1">
                                                      <div class="width20 textAlL"><b>Tipo</b></div>
                                                      <div class="width20 textAlL flexGrow1"><b>Impuesto</b></div>
                                                      <div class="width20 textAlL flexGrow1"><b>Factor</b></div>
                                                      <div class="width20 textAlL flexGrow1"><b>Tasa o Cuota</b></div>
                                                      <div class="width20 textAlR flexGrow2"></div>
                                                    </div>`
}
//agrega los traslados y retenciones dentro del nodo impuestos general
function addTrasRetImp(idx, tipo, impuesto, factor, tasa, importe){
  if(tipo == "Retencion"){
    importe = "- "+importe;
  }
  if (factor == "Tasa"){
    tasa = (Number(tasa)*100).toFixed(4)+"%";
  }
  document.getElementById(`impCont_${idx-1}`).insertAdjacentHTML("afterend", `<div class="cabrows" id="impCont_${idx}">
                                                                                <div class="width20 textAlL">${tipo}</div>
                                                                                <div class="width20 textAlL flexGrow1">${impuesto}</div>
                                                                                <div class="width20 textAlL flexGrow1">${factor}</div>
                                                                                <div class="width20 textAlL flexGrow1">${tasa}</div>
                                                                                <div class="width20 textAlR flexGrow2">${importe}</div>
                                                                              </div>`);
}
function rellenar(id, titulo, data){
  reInfoTitData(id, "cabrowsStart flexGrow1", "textAlR", titulo, data);
}

function rellenarCabe(id, titulo, data){
  reInfoTitData(id, "cabrowsStart flexGrow1 borde", "textAlL", titulo, data);
}

function rellenar_cortado(id, titulo, data){
  reInfoTitData(id, "", "textAlL", titulo, data);
}

function ponerQr(data){
  if (data != ""){
    var qrCode = new QRCode("qr", {
      text: data,
      width: 512,
      height: 512,
      colorDark: "#232323",
      colorLigth: "#f9f9f9",
      correctLevel: QRCode.CorrectLevel.H
    });
  }else{
    ocultarElemento(id);
  }
}

function rellenarRelacionadosCabe(tipo){
  //crear dentro de un div de relacionados un bloque para poner los relacionados de este nodo
  document.getElementById("relacionadosAll").innerHTML = `<div id="relacionadosCab" class="borde cabCols">
                                                            <div class="cabrows bordeDownDash" id="relacionadosTit">
                                                              <div class="width12 textAlL flexGrow1" ><b>Documentos Relacionados:</b></div>
                                                              <div class="cabrowsStart flexGrow1" id="tipoRelacion">
                                                                <div class="width12 textAlL flexGrow1"><b>Tipo de Relación:</b></div>
                                                                <div class="width12 textAlL flexGrow2"> ${tipo}</div>
                                                              </div>
                                                            </div>
                                                            <div class="cabCols" id="relacionadoCab"></div>
                                                          </div>`
}

function addRelacionado(id, uuid){
  if (uuid != "") {
    var info = `<div id="relacion_${id}" class="cabrowsStart">
                  <div class="width12 textAlL flexGrow1"><b>Comprobante Relacionado UUID:</b></div>
                  <div class="width12 textAlL flexGrow2">${uuid}</div>
                </div>`
    if (id == 0){
      document.getElementById("relacionadoCab").innerHTML=info;
    }else{
      document.getElementById(`relacion_${idx-1}`).insertAdjacentHTML("afterend", info);
    }
  }
}

function esValido(val){
  if(val == "Vigente"){
    document.getElementById("validar").innerHTML=`<b class="success">Comprobante Valido y Vigente</b>`;
  }else if(val == "pendienteOk"){
    document.getElementById("validar").innerHTML=`<b class="warning">Respuesta Incompleta del Servicio de Validación, Intentelo Mas Tarde</b>`;
  }else if(val == "pendienteNo2xx"){
    document.getElementById("validar").innerHTML=`<b class="warning">Sin Respuesta del Servicio de Validación, Intentelo Mas Tarde</b>`;
  }else{
    document.getElementById("validar").innerHTML=`<b class="danger">Respuesta de Validación: ${val}</b>`;
  }
}

function pagosCont(){
  document.getElementById("pagos").innerHTML=`<div class="cabCols borde" id="pagosCont">
                                                <div class="" id=""><b>Complemento de Pago</b></div>
                                                <div class="cabrows bordeDownDash bordeUpDash" id="pagoCabe_-1">
                                                  ${pagoPrinData("<b>Fecha de Pago</b>", "<b>Forma de Pago</b>", "<b>Moneda de Pago</b>", "<b>Monto de Pago</b>")}
                                                </div>
                                              </div>`
}
//TODO: incompleto
function pagoCabe(id, fechaP, formaPP, monedaP, montoP, otros){
  var pago = `<div class="pagoCont" id="pagoCabe_${id}">
                <div class="cabrows borde prim1" id="pagoBase_${id}">
                  ${pagoPrinData(fechaP, formaPP, monedaP, montoP)}
                </div>
                <div class="" id="pagoDet_${id}">
                  <div class="flexWrap cabrows">inof adi</div>
                </div>
              </div>`;
  //evento al click
  elementoClickeable(id, "pagoCabe", "pagoDet", pago, "pagoBase", "prim1", "prim2");
}

function debug(data){
  window.external.invoke(data);
}


//funciones internas para acortar codigo
//idx, idCabe, idDet, elementoAgregar, idBase, color1, color 2
function elementoClickeable(idx, idCabe, idDet, htmlAgreg, idBase, color1, color2){
  document.getElementById(`${idCabe}_${idx-1}`).insertAdjacentHTML("afterend", htmlAgreg);
    document.getElementById(`${idDet}_${idx}`).style.display="none";
    //evento al click
    document.getElementById(`${idBase}_${idx}`).addEventListener("click", ()=>{
      var disp = document.getElementById(`${idDet}_${idx}`).style.display;
      if(disp == "none"){
        document.getElementById(`${idDet}_${idx}`).style.display="flex";
        document.getElementById(`${idBase}_${idx}`).classList.add(color2);
        document.getElementById(`${idBase}_${idx}`).classList.remove(color1);
      }else{
        document.getElementById(`${idBase}_${idx}`).classList.remove(color2);
        document.getElementById(`${idBase}_${idx}`).classList.add(color1);
        ocultarElemento(`${idDet}_${idx}`);
      }
    })
}

function divE(clase, id_di, data){
  return  `<div class="${clase}" id="${id_di}">${data}</div>`;
}

function pagoPrinData(fechaP, formaPP, monedaP, montoP){
  return `${divE("width30 flexGrow1", "fechaP", fechaP)}
          ${divE("width30 flexGrow1", "formaPagoP", formaPP)}
          ${divE("width20 flexGrow1", "monedaP", monedaP)}
          ${divE("width20 flexGrow1", "montoP", montoP)}
          `
}

function reInfoTitData(id, clase, lado, titulo, data){
  var tit = divE("width12 textAlL flexGrow1", "", `<b>${titulo}: </b>`);
  var dat = divE(`width12 ${lado} flexGrow2`, "", data);
  if(data != ""){
    document.getElementById(id).innerHTML=divE(clase, "", `${tit}${dat}`);
  }else{
    ocultarElemento(id);
  }
}

function ocultarElemento(id){
  document.getElementById(id).style.display="none";
}