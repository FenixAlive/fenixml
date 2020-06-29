    'use strict'
    
    //document.getElementById("conceptos").style.visibility="hidden"
    var htmlHide = {
      conceptos: true
    }

    window.external.invoke("inicio");
    
    function rellenar(id, titulo, data){
      if(data != ""){
        document.getElementById(id).innerHTML=`<div class="datoCont"><div class="datoTit"><b>${titulo}: </b></div><div class="datoD">${data}</div></div>`;
      }
    }
    function rellenarFecha(id, titulo, data){
      if(data != ""){
        document.getElementById(id).innerHTML=`<div class="datoCont"><div class="datoTit"><b>${titulo}: </b></div><div class="datoD">${data}</div></div>`;
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
      }
    }
    function rellenar_cortado(id, titulo, data){
      if(data != ""){
        document.getElementById(id).innerHTML=`<div class=""><div class="datoTit"><b>${titulo}: </b></div><div class="cortarStr">${data}</div></div>`;
      }
    }
