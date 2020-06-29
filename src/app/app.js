    'use strict'
    
    var debugvar = document.getElementById("debug");
    var debugvar2 = document.getElementById("debug2");

    window.external.invoke("inicio");
    
    function rellenar(id, titulo, data){
      if(data != ""){
        document.getElementById(id).innerHTML=`<div class="datoCont"><div class="datoTit"><b>${titulo}: </b></div><div class="datoD">${data}</div></div>`;
      }
    }

    function ponerQr(data){
      if (data != ""){
        new QRCode(document.getElementById("qr"), data);
      }
    }
    function rellenar_cortado(id, titulo, data){
      if(data != ""){
        document.getElementById(id).innerHTML=`<div class=""><div class="datoTit"><b>${titulo}: </b></div><div class="cortarStr">${data}</div></div>`;
      }
    }
