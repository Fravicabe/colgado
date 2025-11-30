
let palabras = null; // Array de palabras
let abogadoestado = 0; // Estado del abogado
const error_maximo = 8; // Error máximo
let aciertos = 0; // Contador de letras acertadas
let palabraAleatoria = null; // Se inicializará cuando se carguen las palabras
let letrasUsadas = []; // Array para almacenar las letras ya usadas

function leerJSON() {
    fetch("words.json")
        .then(function(response) {
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(function(respJSON) {
            // El JSON tiene la estructura: { "words": [ { "item": "PALABRA" }, ... ] }
            palabras = respJSON.words; // Accedemos al array "words"
            iniciarJuego()
        })
        .catch(function(error) {
            console.error("Error cargando el archivo JSON:", error);
        });
}

function obtenerRandom() {
    const maxIndex = palabras.length;
    const randomIndex = Math.floor(Math.random() * maxIndex);
    const palabraObj = palabras[randomIndex]; // Obtenemos el objeto { "item": "PALABRA" }
    const palabraAleatoria = palabraObj.item; // Extraemos la palabra del objeto
    return palabraAleatoria;
}

function iniciarJuego() {
    // 1. Obtener la palabra aleatoria ahora que 'palabras' está cargado.
    palabraAleatoria = obtenerRandom(); 
    if (palabraAleatoria) {
        // 2. Aquí iría el código que muestra la palabra en el HTML (letras ocultas)
        console.log("Juego iniciado con la palabra: " + palabraAleatoria);
        renderizarPalabra();
    }
}

function renderizarPalabra() {
    const huecoPalabra = document.getElementById("palabra-oculta"); // huecoPalabra es un div en el html
    let espacio = ""; // espacio es un hueco vacío que irá dentro de huecoPalabra
    
    for (let i = 0; i < palabraAleatoria.length; i++) { // bucle for que recorre la palabra aleatoria que sacamos del JSON
        const letra = palabraAleatoria[i]; // letra es = a todas las letras de la palabra aleatoria
        if (letrasUsadas.includes(letra)) { // si el array letrasUsadas incluye la letra...
            espacio += letra + " "; //  cambiamos el espacio por esa letra
        } else {
            espacio += "_ "; // si no, se queda un guión
        }
    }
    huecoPalabra.innerText = espacio; // insertamos el espacio en el huecoPalabra
}

function validarDatos(e){
    //Suspender el envío de datos al servidor
    //Pero manteniendo la validación en el FORM HTML
    e.preventDefault()
    const inputLetra = document.querySelector('input[type="text"]');
    const letra = inputLetra.value.toUpperCase(); // Convertir a mayúscula para comparar
    // Validar que sea una sola letra
    if(!letra.match(/^[a-zA-ZñÑ]$/)){
        Swal.fire({
            title: "Error de Validación!",
            text: "Debes introducir una sola letra (a-z, A-Z)",
            icon: "error"
        });
        return; // Salir de la función si la validación falla
    }
    // Comprobar si la letra está en la palabra
    comprobarLetra(letra);
    // Limpiar el input
    inputLetra.value = "";
}

function comprobarLetra(letra) {
    // Comprobar si la letra ya fue usada
    if (letrasUsadas.includes(letra)) {
        ocultarMensaje();
        const letraUsada = document.getElementById("letra-usada");
        letraUsada.innerText = `La letra "${letra}" ya fue usada`;
        letraUsada.style.display = "block";
        return;
    }
    // Agregar la letra al array de letras usadas
    letrasUsadas.push(letra);
    // Comprobar si la letra está en la palabra
    if (palabraAleatoria.includes(letra)) {
        // Contar cuántas veces aparece la letra en la palabra
        const intentos = palabraAleatoria.split(letra).length - 1;
        aciertos += intentos;
        // Actualizar la visualización de la palabra
        renderizarPalabra(); 
        // Verificar si ganó
        if (aciertos === palabraAleatoria.length) {
            mostrarVictoria();
        } else {
            ocultarMensaje();
            const aciertos = document.getElementById("aciertos");
            aciertos.innerText = `La letra "${letra}" SÍ está en la palabra`;
            aciertos.style.display = "block";
        }
    } else {
        // Si la letra no está, cambiar la imagen del abogado
        const fallo = cambiarImagen();
        if (!fallo) {
            ocultarMensaje();
            const fallos = document.getElementById("fallos");
            fallos.innerText = `La letra "${letra}" NO está en la palabra`;
            fallos.style.display = "block";

        }
    }
}

function cambiarImagen() {
    const imgAbogado = document.getElementById("Abogado");
    // Cuando fallamos, la imagen se incrementa
    abogadoestado++;
    // Cambiamos la imagen aprovechando el aumento anterior
    imgAbogado.src = "images/Hangman-" + abogadoestado + ".png";
    // Si el estado es mayor o igual al maximo, mostramos el mensaje de game over
    if (abogadoestado >= error_maximo) { // el estado de abogado llega al error máximo
        mostrarGameOver();
        return true; // Perdemos
    } else if (aciertos >= palabraAleatoria.length) {
        mostrarVictoria();
    }
}

function ocultarMensaje() {
    const aciertos = document.getElementById("aciertos");
    const fallos = document.getElementById("fallos");
    const letraUsada = document.getElementById("letra-usada");
    aciertos.style.display = "none";
    fallos.style.display = "none";
    letraUsada.style.display = "none";
    }

function mostrarReset() {
    const resetear = document.getElementById("resetear");
    resetear.style.display = "block"; // mostramos el botón de nueva partida  
}

function ocultarJuego() {
    const letra = document.getElementById("letra");
    letra.style.display = "none";
    const comprobar = document.getElementById("comprobar");
    comprobar.style.display = "none";
}

function mostrarVictoria() {
    const mensajeSalvado = document.getElementById("salvado");
    mensajeSalvado.innerText = "al que has salvado...";
    mensajeSalvado.style.display = "block";

    ocultarMensaje();
    mostrarReset();
    ocultarJuego();
}

function mostrarGameOver() {
    const mensajeColgado = document.getElementById("colgado"); 
    mensajeColgado.innerText = "que tengo aquí colgado"; // mostramos mensaje de colgado al perder
    mensajeColgado.style.display = "block";
    const solucion = document.getElementById("solucion");
    solucion.innerText = "La palabra era: " + palabraAleatoria;
    solucion.style.display = "block";

    ocultarMensaje();
    mostrarReset();
    ocultarJuego();
}

function resetearJuego() {
    abogadoestado = 0; // reseteamos el estado del abogado
    aciertos = 0; // reseteamos los aciertos
    letrasUsadas = []; // limpiamos las letras usadas
    palabraAleatoria = obtenerRandom(); // obtenemos una nueva palabra aleatoria
    console.log("Nueva partida iniciada con la palabra: " + palabraAleatoria);
    renderizarPalabra(); // Mostramos los guiones de la nueva palabra
    
    const imgAbogado = document.getElementById("Abogado");
    imgAbogado.src = "images/Hangman-0.png"; // reseteamos la imagen del abogado
    
    const mensajeColgado = document.getElementById("colgado");
    mensajeColgado.style.display = "none"; // ocultamos el mensaje de colgado

    const mensajeSalvado = document.getElementById("salvado");
    mensajeSalvado.style.display = "none"; // ocultamos el mensaje de salvado

    const resetear = document.getElementById("resetear");
    resetear.style.display = "none"; // ocultamos el botón de nueva partida (Solo aparece cuando pierdes)

    const letras = document.getElementById("letra");
    letras.style.display = "block"; // mostramos el input de la letra que ocultamos antes para que no sigan jugando

    const comprobar = document.getElementById("comprobar");
    comprobar.style.display = "block"; // mostramos el botón de comprobar que ocultamos también antes

    const solucion = document.getElementById("solucion");
    solucion.style.display = "none"; // ocultamos el mensaje de solucion
}

leerJSON();