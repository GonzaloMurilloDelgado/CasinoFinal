// Definimos una clase llamada Tragaperras
// La clase representa la máquina del juego
class Tragaperras {

    constructor(){

        // Saldo inicial del jugador
        this.saldo = 100;

        // Último premio ganado (empieza en 0)
        this.ultimoPremio = 0;

        // Array con los símbolos posibles de la máquina
        this.simbolos = ["🍒","🍋","🔔","⭐","7️⃣"];

        // Guardamos referencias a elementos del HTML para poder modificarlos desde JS

        // Elemento donde se muestra el saldo
        this.balance = document.getElementById("balance");

        // Elemento donde se muestra el último premio
        this.lastWin = document.getElementById("lastWin");

        // Input donde el usuario escribe la apuesta
        this.bet = document.getElementById("bet");

        // Elemento donde aparecen los mensajes al jugador
        this.message = document.getElementById("message");

        // Elementos que representan los 3 símbolos de la tragaperras
        this.s1 = document.getElementById("s1");
        this.s2 = document.getElementById("s2");
        this.s3 = document.getElementById("s3");

        // Llamamos al método que actualiza lo que aparece en pantalla
        this.actualizarPantalla();
    }


// Método que actualiza los datos que aparecen en la pantalla
    actualizarPantalla(){

        // Muestra el saldo actual
        this.balance.textContent = this.saldo;

        // Muestra el último premio obtenido
        this.lastWin.textContent = this.ultimoPremio;

    }


// Método que devuelve un símbolo aleatorio del array
    obtenerSimboloAleatorio(){

        // Genera una posición aleatoria dentro del array de símbolos
        let posicion = Math.floor(Math.random()*this.simbolos.length);

        // Devuelve el símbolo que hay en esa posición
        return this.simbolos[posicion];

    }


// Método que calcula cuánto dinero gana el jugador
    calcularPremio(s1,s2,s3,apuesta){

        // Si los 3 símbolos son iguales
        if(s1===s2 && s2===s3){

            // El premio es la apuesta multiplicada por 10
            return apuesta*10;
        }

        // Si hay dos símbolos iguales
        if(s1===s2 || s1===s3 || s2===s3){

            // El premio es la apuesta multiplicada por 2
            return apuesta*2;
        }

        // Si no hay coincidencias no hay premio
        return 0;

    }


// Método principal que ejecuta una tirada de la tragaperras
    jugar(){

        // Obtiene la apuesta introducida por el usuario y la convierte a número
        let apuesta = parseInt(this.bet.value); //parseInt pasa el texto a int

        // Comprueba si la apuesta es inválida
        if(isNaN(apuesta) || apuesta<1){ //isNAN es por si no es un numero

            // Muestra mensaje de error
            this.message.textContent="Introduce una apuesta válida mayor que 0";

            // Detiene la ejecución del método
            return;
        }

        // Comprueba si el jugador intenta apostar más dinero del que tiene
        if(apuesta>this.saldo){

            // Muestra mensaje de error
            this.message.textContent="No tienes saldo suficiente para esa apuesta";

            return;
        }

        // Resta la apuesta al saldo
        this.saldo -= apuesta;

        // Genera tres símbolos aleatorios
        let simbolo1 = this.obtenerSimboloAleatorio();
        let simbolo2 = this.obtenerSimboloAleatorio();
        let simbolo3 = this.obtenerSimboloAleatorio();

        // Muestra los símbolos en la pantalla
        this.s1.textContent = simbolo1;
        this.s2.textContent = simbolo2;
        this.s3.textContent = simbolo3;

        // Calcula el premio obtenido en la tirada
        let premio = this.calcularPremio(simbolo1,simbolo2,simbolo3,apuesta);

        // Guarda el premio como último premio
        this.ultimoPremio = premio;

        // Suma el premio al saldo del jugador
        this.saldo += premio;

        // Muestra mensaje dependiendo del resultado
        if(premio===apuesta*10){

            this.message.textContent="¡3 iguales! Has ganado x10";
        }
        else if(premio===apuesta*2){

            this.message.textContent="¡2 iguales! Has ganado x2";
        }
        else{

            this.message.textContent="Sin premio";
        }

        // Si el jugador se queda sin saldo se muestra aviso
        if(this.saldo===0){

            this.message.textContent += " | Te has quedado sin saldo, pulsa RESET";
        }

        // Actualiza la información que aparece en pantalla
        this.actualizarPantalla();

    }
}


// Se crea un objeto llamado maquina a partir de la clase Tragaperras
// Esto inicializa el juego
let maquina = new Tragaperras();

function volverACasino() {
    let saldoCasino = Number(localStorage.getItem("saldoCasino")) || 0;

    saldoCasino += saldo;
    localStorage.setItem("saldoCasino", saldoCasino);

    sessionStorage.removeItem("saldoBlackjack");

    window.location.href = "../menu/Menu.html";
}