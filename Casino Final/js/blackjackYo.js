document.getElementById("chip10").addEventListener("click", function () {
    seleccionarApuesta(10);
});

document.getElementById("chip25").addEventListener("click", function () {
    seleccionarApuesta(25);
});

document.getElementById("chip50").addEventListener("click", function () {
    seleccionarApuesta(50);
});

document.getElementById("chip100").addEventListener("click", function () {
    seleccionarApuesta(100);
});

document.getElementById("btnNuevaPartida").addEventListener("click", nuevaPartida);
document.getElementById("btnPedirCarta").addEventListener("click", pedirCarta);
document.getElementById("btnPlantarse").addEventListener("click", plantarse);
document.getElementById("btnVolverACasino").addEventListener("click", volverACasino);

let saldo = Number(sessionStorage.getItem("saldoBlackjack")) || 0;
let apuestaActual = 0;
let cartasJugador = [];
let cartasCrupier = [];
let partidaActiva = false;

actualizarSaldo();

function actualizarSaldo() {
    document.getElementById("saldo").textContent = saldo.toLocaleString("es-ES") + " €";
    sessionStorage.setItem("saldoBlackjack", saldo);
}

function seleccionarApuesta(cantidad) {
    apuestaActual = cantidad;
    document.getElementById("apuestaActual").textContent = "Apuesta actual: " + apuestaActual + " €";
}

function obtenerCartaAleatoria() {
    return Math.floor(Math.random() * 10) + 1;
}

function calcularPuntos(cartas) {
    let total = 0;
    for (let carta of cartas) {
        total += carta;
    }
    return total;
}

function pintarCartas(cartas, idContenedor, ocultarPrimera = false) {
    const contenedor = document.getElementById(idContenedor);
    contenedor.innerHTML = "";

    for (let i = 0; i < cartas.length; i++) {
        const cartaDiv = document.createElement("div");
        cartaDiv.classList.add("carta");

        if (ocultarPrimera && i === 0) {
            cartaDiv.classList.add("oculta");
        } else {
            cartaDiv.textContent = cartas[i];
        }

        contenedor.appendChild(cartaDiv);
    }
}

function actualizarVista() {
    pintarCartas(cartasJugador, "cartas-jugador");
    pintarCartas(cartasCrupier, "cartas-crupier", partidaActiva);

    document.getElementById("puntos-jugador").textContent =
        "Puntos: " + calcularPuntos(cartasJugador);

    if (partidaActiva) {
        document.getElementById("puntos-crupier").textContent = "Puntos: ?";
    } else {
        document.getElementById("puntos-crupier").textContent =
            "Puntos: " + calcularPuntos(cartasCrupier);
    }
}

function nuevaPartida() {
    if (partidaActiva) {
        document.getElementById("mensaje").textContent = "Ya hay una partida en curso";
        return;
    }

    if (apuestaActual === 0) {
        document.getElementById("mensaje").textContent = "Debes seleccionar una apuesta";
        return;
    }

    if (apuestaActual > saldo) {
        document.getElementById("mensaje").textContent = "No tienes saldo suficiente para esa apuesta";
        return;
    }

    saldo -= apuestaActual;
    actualizarSaldo();

    cartasJugador = [];
    cartasCrupier = [];

    cartasJugador.push(obtenerCartaAleatoria());
    cartasJugador.push(obtenerCartaAleatoria());

    cartasCrupier.push(obtenerCartaAleatoria());
    cartasCrupier.push(obtenerCartaAleatoria());

    partidaActiva = true;

    actualizarVista();
    document.getElementById("mensaje").textContent = "Partida iniciada";
}

function turnoCrupier() {
    let puntosCrupier = calcularPuntos(cartasCrupier);

    while (puntosCrupier < 17) {
        cartasCrupier.push(obtenerCartaAleatoria());
        puntosCrupier = calcularPuntos(cartasCrupier);
    }

    actualizarVista();
    decidirGanador();
}

function decidirGanador() {
    let puntosJugador = calcularPuntos(cartasJugador);
    let puntosCrupier = calcularPuntos(cartasCrupier);

    if (puntosCrupier > 21 || puntosJugador > puntosCrupier) {
        document.getElementById("mensaje").textContent = "Has ganado";
        saldo += apuestaActual * 2;
    } else if (puntosJugador < puntosCrupier) {
        document.getElementById("mensaje").textContent = "Has perdido";
    } else {
        document.getElementById("mensaje").textContent = "Empate";
        saldo += apuestaActual;
    }

    actualizarSaldo();
    apuestaActual = 0;
    document.getElementById("apuestaActual").textContent = "Apuesta actual: 0 €";
    partidaActiva = false;
    actualizarVista();
}

function pedirCarta() {
    if (!partidaActiva) {
        document.getElementById("mensaje").textContent = "No hay partida activa";
        return;
    }

    cartasJugador.push(obtenerCartaAleatoria());
    actualizarVista();

    let total = calcularPuntos(cartasJugador);

    if (total > 21) {
        document.getElementById("mensaje").textContent = "Te has pasado de 21. Has perdido.";
        actualizarSaldo();
        apuestaActual = 0;
        document.getElementById("apuestaActual").textContent = "Apuesta actual: 0 €";
        partidaActiva = false;
        actualizarVista();
    }
}

function plantarse() {
    if (!partidaActiva) {
        document.getElementById("mensaje").textContent = "No hay partida activa";
        return;
    }

    document.getElementById("mensaje").textContent = "Te has plantado. Turno del crupier";
    turnoCrupier();
}

function volverACasino() {
    let saldoCasino = Number(localStorage.getItem("saldoCasino")) || 0;

    saldoCasino += saldo;
    localStorage.setItem("saldoCasino", saldoCasino);

    sessionStorage.removeItem("saldoBlackjack");

    window.location.href = "../menu/Menu.html";
}