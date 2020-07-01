    'use strict'

    window.external.invoke("inicio");

    var htmlHide = {
      app: true,
      conceptos: true
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
      if (htmlHide.conceptos && isIt){
        document.getElementById("conceptos").innerHTML=`
        <div class="concepCont" id="concepto-1">
          <div class="concepBase cabrows borde">
            <div class="cantidad">Cantidad</div>
            <div class="precioUni">P. Unitario</div>
            <div class="descrip">Descripción</div>
            <div class="descConcep">Descuento</div>
            <div class="importeConcep">Importe</div>
          </div>
        </div>
        `;
      }else if(!htmlHide.conceptos && !isIt){
        document.getElementById("conceptos").innerHTML="";
      }
      htmlHide.conceptos= !htmlHide.conceptos;
    }
    
    function rellenar(id, titulo, data){
      if(data != ""){
        document.getElementById(id).innerHTML=`<div class="datoCont"><div class="datoTit"><b>${titulo}: </b></div><div class="datoD">${data}</div></div>`;
      }else{
        ocultarElemento(id);
      }
    }
    function rellenarCabe(id, titulo, data){
      if(data != ""){
        document.getElementById(id).innerHTML=`<div class="datoCont borde">
                                                <div class="datoTit">
                                                  <b>${titulo}: </b>
                                                </div>
                                                <div class="datoCab">${data}</div>
                                              </div>`;
      }else{
        ocultarElemento(id);
      }
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
    function rellenar_cortado(id, titulo, data){
      if(data != ""){
        document.getElementById(id).innerHTML=`<div class=""><div class="datoTit"><b>${titulo}: </b></div><div class="cortarStr">${data}</div></div>`;
      }else{
        ocultarElemento(id);
      }
    }

    function esValido(val){
      if(val == "Vigente"){
        document.getElementById("validar").innerHTML=`<b class="success padText">Comprobante Valido y Vigente</b>`;
      }else if(val == "pendienteOk"){
        document.getElementById("validar").innerHTML=`<b class="warning padText">Respuesta Incompleta del Servicio de Validación, Intentelo Mas Tarde</b>`;
      }else if(val == "pendienteNo2xx"){
        document.getElementById("validar").innerHTML=`<b class="warning padText">Sin Respuesta del Servicio de Validación, Intentelo Mas Tarde</b>`;
      }else{
        document.getElementById("validar").innerHTML=`<b class="danger padText">Respuesta de Validación: ${val}</b>`;
      }
    }

    function addConcep(idx, cantidad, claveUnidad, unidad, claveProdServ, numIde, valorUni, descrip, importe, descuento){
      //quitar lo que no se tiene en los adicionales
      var concep = `
      <div class="concepCont" id="concepto${idx}">
          <div class="concepBase cabrows borde">
            <div class="cantidad">${cantidad}</div>
            <div class="precioUni">${valorUni}</div>
            <div class="descrip">${descrip}</div>
            <div class="descConcep">${descuento}</div>
            <div class="importeConcep">${importe}</div>
          </div>
          <div class="concepDet borde">
            <div class ="datosAdCol" id="datosAd${idx}">
              <div class="unidad">Unidad: ${unidad}</div>
              <div class="claveUnidad">Clave de Unidad: ${claveUnidad}</div>
              <div class="claveProdServ">Clave Producto/Servicio: ${claveProdServ}</div>
              <div class="noIdent">Num. Identificación: ${numIde}</div>
            </div>
            <div id="trasConcep${idx}" class="trasConcepCont bordeUpDash">traslados</div>
            <div id="retConcep${idx}" class="retConcepCont bordeUpDash">retenciones</div>
          </div>
      </div>
      `;
      document.getElementById(`concepto${idx-1}`).insertAdjacentHTML("afterend", concep);
    }

    function debug(data){
      window.external.invoke("hola desde debug");
    }
    function ocultarElemento(id){
      document.getElementById(id).style.display="none";
    }