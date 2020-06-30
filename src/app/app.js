    'use strict'
    document.getElementById("appContainer").style.visibility="hidden"
    document.getElementById("conceptos").style.visibility="hidden"
    var htmlHide = {
      app: true,
      conceptos: true
    }

    window.external.invoke("inicio");

    function mostrarApp(isIt){
      if (htmlHide.app && isIt){
        document.getElementById("appContainer").style.visibility="visible";
        htmlHide.app
      }else if(!htmlHide.app && !isIt){
        document.getElementById("appContainer").style.visibility="hidden";
      }
      htmlHide.app= !htmlHide.app;
    }
    
    function rellenar(id, titulo, data){
      if(data != ""){
        document.getElementById(id).innerHTML=`<div class="datoCont"><div class="datoTit"><b>${titulo}: </b></div><div class="datoD">${data}</div></div>`;
      }
    }
    function rellenarCabe(id, titulo, data){
      if(data != ""){
        document.getElementById(id).innerHTML=`<div class="datoCont borde"><div class="datoTit"><b>${titulo}: </b></div><div class="datoCab">${data}</div></div>`;
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
