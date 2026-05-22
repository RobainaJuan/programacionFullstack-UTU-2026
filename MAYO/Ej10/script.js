let titulo = document.getElementById("titulo");
let botonTitulo = document.getElementById("botonTitulo");

botonTitulo.onclick = function(){

    titulo.textContent = "Phantom";

};

let parrafo = document.getElementById("parrafo");
let botonParrafo = document.getElementById("botonParrafo");

botonParrafo.onclick = function(){

    parrafo.innerHTML = "<b>La Phantom tiene silenciador y es muy buena a corta distancia.</b>";

};

let imagen = document.getElementById("imagen");
let botonImagen = document.getElementById("botonImagen");

botonImagen.onclick = function(){

    imagen.src = "https://imgs.search.brave.com/XDjOyiCV_HIoe-xyXjb62UyuAJscuA_YTFwE_BF0orw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93aW4u/Z2cvd3AtY29udGVu/dC91cGxvYWRzLzIw/MjEvMTIvUHJpbWUt/Mi4wX1BoYW50b20u/cG5nLndlYnA";

};

let textoUsuario = document.getElementById("textoUsuario");
let mostrarTexto = document.getElementById("mostrarTexto");
let resultadoTexto = document.getElementById("resultadoTexto");

mostrarTexto.onclick = function(){

    resultadoTexto.textContent =
    "Tu arma favorita es: " + textoUsuario.value;

};

let modoOscuro = document.getElementById("modoOscuro");
let modoClaro = document.getElementById("modoClaro");

modoOscuro.onclick = function(){

    document.body.classList.add("oscuro");

};

modoClaro.onclick = function(){

    document.body.classList.remove("oscuro");

};

let lista = document.getElementById("lista");
let agregarElemento = document.getElementById("agregarElemento");

let contador = 1;

agregarElemento.onclick = function(){

    contador++;

    let nuevaArma = document.createElement("li");

    nuevaArma.textContent = "Arma " + contador;

    lista.appendChild(nuevaArma);

};

let formulario = document.getElementById("formulario");

let nombre = document.getElementById("nombre");
let color = document.getElementById("color");
let mensaje = document.getElementById("mensaje");

let datos = document.getElementById("datos");
let error = document.getElementById("error");

let tarjetas = document.getElementById("tarjetas");

formulario.onsubmit = function(e){

    e.preventDefault();

    error.textContent = "";

    if(
        nombre.value == "" ||
        color.value == "" ||
        mensaje.value == ""
    ){

        error.textContent =
        "Completa todos los campos";

    }
    else{

        datos.innerHTML =
        "<p>Jugador: " + nombre.value + "</p>" +
        "<p>Color favorito: " + color.value + "</p>" +
        "<p>Arma favorita: " + mensaje.value + "</p>";

        titulo.style.color = color.value;

        let tarjeta = document.createElement("div");

        tarjeta.classList.add("tarjeta");

        tarjeta.innerHTML =
        "<h3>" + nombre.value + "</h3>" +
        "<p>Color favorito: " + color.value + "</p>" +
        "<p>Arma favorita: " + mensaje.value + "</p>";

        tarjetas.appendChild(tarjeta);

        formulario.reset();

    }

};