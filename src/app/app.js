    'use strict'
    
    var debugvar = document.getElementById("debug");
    var debugvar2 = document.getElementById("debug2");

    window.external.invoke("inicio");
    
    function rellenar(id, html){
      if(html != ""){
        document.getElementById(id).innerHTML=html;
      }
    }

    function ponerQr(data){
      if (data != ""){
        new QRCode(document.getElementById("qr"), data);
      }
    }