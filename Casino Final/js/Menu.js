let saldo = 10000;
let usuarioActivo = null;
let juegoSeleccionado = null;

document.addEventListener("DOMContentLoaded", function () {
    const usuario = sessionStorage.getItem("usuarioActivo");
    if (usuario) {
        usuarioActivo = usuario;
        entrarAlCasino();
    }

    document.addEventListener("keydown", e => {
        if (e.key !== "Enter") return;
        document.getElementById("panel-registro").classList.contains("hidden")
            ? iniciarSesion()
            : registrar();
    });
});

// ── HELPERS localStorage ──────────────────
function getUsuarios() { return JSON.parse(localStorage.getItem("pupuUsuarios") || "{}"); }
function setUsuarios(u) { localStorage.setItem("pupuUsuarios", JSON.stringify(u)); }

// ── SESIÓN ───────────────────────────────
function entrarAlCasino() {
    const usuarios = getUsuarios();
    saldo = Number(usuarios[usuarioActivo]?.saldo) || 10000;

    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("casino-screen").classList.remove("hidden");
    document.getElementById("nombre-usuario").textContent = usuarioActivo;
    actualizarSaldo();
}

function cerrarSesion() {
    guardarSaldo();
    sessionStorage.removeItem("usuarioActivo");
    location.reload();
}

// ── LOGIN ────────────────────────────────
function iniciarSesion() {
    const usuario = document.getElementById("login-usuario").value.trim();
    const pass    = document.getElementById("login-pass").value;
    const usuarios = getUsuarios();

    if (!usuario || !pass)           return setError("login-error", "Rellena todos los campos.");
    if (!usuarios[usuario])          return setError("login-error", "Usuario no encontrado.");
    if (usuarios[usuario].pass !== pass) return setError("login-error", "Contraseña incorrecta.");

    usuarioActivo = usuario;
    sessionStorage.setItem("usuarioActivo", usuario);
    entrarAlCasino();
}

// ── REGISTRO ─────────────────────────────
function registrar() {
    const usuario = document.getElementById("reg-usuario").value.trim();
    const pass    = document.getElementById("reg-pass").value;
    const pass2   = document.getElementById("reg-pass2").value;
    const usuarios = getUsuarios();

    if (!usuario || !pass || !pass2) return setError("reg-error", "Rellena todos los campos.");
    if (usuario.length < 3)          return setError("reg-error", "Usuario demasiado corto (mín. 3).");
    if (pass.length < 4)             return setError("reg-error", "Contraseña demasiado corta (mín. 4).");
    if (pass !== pass2)              return setError("reg-error", "Las contraseñas no coinciden.");
    if (usuarios[usuario])           return setError("reg-error", "Ese usuario ya existe.");

    usuarios[usuario] = { pass, saldo: 10000 };
    setUsuarios(usuarios);

    usuarioActivo = usuario;
    sessionStorage.setItem("usuarioActivo", usuario);
    entrarAlCasino();
}

// ── SALDO ────────────────────────────────
function actualizarSaldo() {
    document.getElementById("saldo").textContent = saldo.toLocaleString("es-ES") + " €";
    guardarSaldo();
}

function guardarSaldo() {
    if (!usuarioActivo) return;
    const usuarios = getUsuarios();
    if (usuarios[usuarioActivo]) usuarios[usuarioActivo].saldo = saldo;
    setUsuarios(usuarios);
    localStorage.setItem("saldoCasino", saldo);
}

// ── JUEGOS ───────────────────────────────
function jugar(nombre) {
    juegoSeleccionado = nombre;
    document.getElementById("modal-nombre").textContent = nombre;
    document.getElementById("modal-saldo").textContent = saldo.toLocaleString("es-ES") + " €";
    document.getElementById("input-apuesta").value = "";
    document.getElementById("error-apuesta").textContent = "";
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("input-apuesta").focus();
}

function cerrarModal() {
    document.getElementById("modal").classList.add("hidden");
}

function confirmar() {
    const cantidad = parseFloat(document.getElementById("input-apuesta").value);
    if (isNaN(cantidad) || cantidad <= 0) return setError("error-apuesta", "Introduce una cantidad válida.");
    if (cantidad > saldo)                 return setError("error-apuesta", "No tienes suficiente saldo.");

    saldo -= cantidad;
    localStorage.setItem("saldoCasino", saldo);
    sessionStorage.setItem("saldoBlackjack", cantidad);
    actualizarSaldo();
    cerrarModal();

    document.getElementById("mensaje").textContent = `✔ Has llevado ${cantidad} € a ${juegoSeleccionado}. ¡Buena suerte!`;

    if (juegoSeleccionado === "Blackjack MegaPupu") window.location.href = "../blackjack/blackjackYo.html";
    if (juegoSeleccionado === "Rolling Pupu's")     window.location.href = "../tragaperras/Rolling Pupu's.html";
}

// ── UI ───────────────────────────────────
function mostrarPanel(id) {
    document.getElementById("panel-login").classList.toggle("hidden", id !== "panel-login");
    document.getElementById("panel-registro").classList.toggle("hidden", id !== "panel-registro");
    document.getElementById("login-error").textContent = "";
    document.getElementById("reg-error").textContent = "";
}

function setError(id, msg) {
    document.getElementById(id).textContent = msg;
}