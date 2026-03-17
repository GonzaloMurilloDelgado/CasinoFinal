let saldo = 10000;

document.addEventListener("DOMContentLoaded", function () {
    saldo = Number(localStorage.getItem("saldoCasino")) || 10000;
    actualizarSaldoMenu();
});

function actualizarSaldoMenu() {
    const saldoElemento = document.getElementById("saldo");
    if (saldoElemento) {
        saldoElemento.textContent = saldo.toLocaleString("es-ES") + " €";
    }
}

function jugar(nombre) {
    const anterior = document.getElementById("modal");
    if (anterior) anterior.remove();

    const overlay = document.createElement("div");
    overlay.id = "modal";
    overlay.className = "modal-overlay";

    overlay.innerHTML = `
        <div class="modal-box">
            <h3 class="modal-titulo">${nombre}</h3>
            <p class="modal-saldo">Saldo: <span>${saldo.toLocaleString("es-ES")} €</span></p>
            <input id="input-apuesta" type="number" placeholder="Cantidad a llevar" class="modal-input">
            <p id="error-apuesta" class="modal-error"></p>
            <div class="modal-btns">
                <button onclick="confirmar('${nombre}')" class="btn-apostar">ENTRAR</button>
                <button onclick="document.getElementById('modal').remove()" class="btn-cancelar">CANCELAR</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById("input-apuesta").focus();
}

function confirmar(nombre) {
    const cantidad = parseFloat(document.getElementById("input-apuesta").value);
    const error = document.getElementById("error-apuesta");

    if (isNaN(cantidad) || cantidad <= 0) {
        error.textContent = "Introduce una cantidad válida.";
        return;
    }

    if (cantidad > saldo) {
        error.textContent = "No tienes suficiente saldo.";
        return;
    }

    saldo -= cantidad;

    localStorage.setItem("saldoCasino", saldo);
    sessionStorage.setItem("saldoBlackjack", cantidad);

    actualizarSaldoMenu();

    document.getElementById("mensaje").textContent =
        "✔ Has llevado " + cantidad + " € a " + nombre + ". ¡Buena suerte!";

    document.getElementById("modal").remove();

    if (nombre === "Blackjack MegaPupu") {
        window.location.href = "../blackjack/blackjackYo.html";
    }

    if (nombre === "Rolling Pupus") {
        window.location.href = "../tragaperras/Tragaperras.html"
    }

    if (nombre === "Ruleta MegaPupu") {
        window.location.href = "../ruleta/Ruleta.html"
    }
}