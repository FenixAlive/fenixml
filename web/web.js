var modal = document.getElementById("modal");

function modalf(cual) {
  console.log(cual);
  modal.innerHTML = `
            <div class="modal">
              <img
                src="./web/img/${cual}.png"
                class="imglogo"
              />
            </div>
            <button class="btnmodal" onClick="cerrarModal()">Cerrar</button>
				`;
}

function cerrarModal() {
  modal.innerHTML = "";
}

