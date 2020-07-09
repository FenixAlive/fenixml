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
                                                                                            ${trasRetConcepData(
                                                                                              name,
                                                                                              impuesto,
                                                                                              base,
                                                                                              tipoFactor,
                                                                                              tasa,
                                                                                              importe
                                                                                            )}
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
                                                                                ${trasRetImpData(
                                                                                  tipo,
                                                                                  impuesto,
                                                                                  factor,
                                                                                  tasa,
                                                                                  importe
                                                                                )}
                                                                              </div>`
  );
}

//agrega titulo y datos alineados a la derecha los datos
function rellenar(id, titulo, data) {
  reInfoTitData(id, "cabrowsStart flexGrow1", "textAlR", titulo, data);
}

//agrega titulo y datos alineados a la izquierda los datos
function rellenarCabe(id, titulo, data) {
  reInfoTitData(id, "cabrowsStart flexGrow1 borde", "textAlL", titulo, data);
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
    ).innerHTML = `<b class="danger">Respuesta de Validación: ${val}</b>`;
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

//agregaun pago en el complemento de pagos
function pagoCabe(id, fechaP, formaPP, monedaP, montoP, otros) {
  //otros datos: TipoCambioP, NumOperacion, RfcEmisorCtaOrd, NomBancoOrdExt, CtaOrdenante, RfcEmisorCtaBen, CtaBeneficiario, TipoCadPago, CertPago, CadPago, SelloPago
  let val_otros = [
    "Tipo de Cambio",
    "Numero Operación",
    "Rfc Emisor Cta Ord",
    "Nombre Banco Ord",
    "Cuenta Ordenante",
    "Rfc Emisor Cuenta Beneficiario",
    "Cuenta Beneficiario",
    "Tipo Cadena de Pago",
    "Certificado de Pago",
    "Cadena de Pago",
    "Sello de Pago",
  ];
  debug("otros: " + otros.length);
  var infoAdentro = ``;
  for (let i = 0; i < otros.length; i++) {
    if (otros[i] != "") {
      var tit = divE(
        "width12 textAlR flexGrow2",
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

//TODO
//Recibe la información por pago y la procesa
function docPago(idP, idD, data) {
  let val_rel = [
    "Documento",
    "Moneda Documento",
    "Metodo Pago Documento",
    "Serie",
    "Folio",
    "Tipo Cambio documento",
    "Numero de Parcialidad",
    "Saldo Anterior",
    "Importe Pagado",
    "Nuevo Saldo",
  ];
  //si idD es 0 agregas cabecera del documento relacionado
  //hacer divs personalizados para la base de los datos 0 al 2 del relacionado
  //
  var infoAdentro = ``;
  for (let i = 3; i < otros.length; i++) {
    if (otros[i] != "") {
      var tit = divE(
        "width12 textAlR flexGrow2",
        "",
        `<b>${val_otros[i]}: </b>`
      );
      var dat = divE(`width12 textAlL flexGrow1`, "", otros[i]);
      infoAdentro += divE("flexGrow1 cabrows", "", tit + dat);
    }
  }
  var infoAdicional = divE("flexWrap cabrows", `infoAdP_${id}`, infoAdentro);
  debug("docPago:" + data.length);
  var relacionado = divE(
    "cabrows borde prim3 flexGrow1",
    `pagoRel_${idP}_${idD}`,
    "Documento Relacionado: " + data[0]
  );
  document
    .getElementById(`infoAdP_${idP}`)
    .insertAdjacentHTML("afterend", relacionado);
}

//envia información a rust
function debug(data) {
  window.external.invoke(data);
}

//funciones internas para acortar codigo

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
  document.getElementById(`${idDet}_${idx}`).style.display = "none";
  //evento al click
  document.getElementById(`${idBase}_${idx}`).addEventListener("click", () => {
    var disp = document.getElementById(`${idDet}_${idx}`).style.display;
    if (disp == "none") {
      document.getElementById(`${idDet}_${idx}`).style.display = "flex";
      document.getElementById(`${idBase}_${idx}`).classList.add(color2);
      document.getElementById(`${idBase}_${idx}`).classList.remove(color1);
    } else {
      document.getElementById(`${idBase}_${idx}`).classList.remove(color2);
      document.getElementById(`${idBase}_${idx}`).classList.add(color1);
      ocultarElemento(`${idDet}_${idx}`);
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

