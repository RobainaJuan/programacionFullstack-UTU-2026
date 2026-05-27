let formulario = document.getElementById("formulario");

let titulo = document.getElementById("titulo");

let url = document.getElementById("url");

let error = document.getElementById("error");

let galeria = document.getElementById("galeria");

let contadorTotal = document.getElementById("contadorTotal");

let contadorFavoritas = document.getElementById("contadorFavoritas");

let contadorNoFavoritas = document.getElementById("contadorNoFavoritas");

let borrarGaleria = document.getElementById("borrarGaleria");

let mostrarTodas = document.getElementById("mostrarTodas");

let mostrarFavoritas = document.getElementById("mostrarFavoritas");

let mostrarNoFavoritas = document.getElementById("mostrarNoFavoritas");

function actualizarContadores(){

    let tarjetas =
    document.querySelectorAll(".tarjeta");

    let favoritas =
    document.querySelectorAll(".favorita");

    let noFavoritas =
    tarjetas.length - favoritas.length;

    contadorTotal.textContent =
    "Total: " + tarjetas.length;

    contadorFavoritas.textContent =
    "Favoritas: " + favoritas.length;

    contadorNoFavoritas.textContent =
    "No favoritas: " + noFavoritas;

}

formulario.onsubmit = function(e){

    e.preventDefault();

    error.textContent = "";

    if(
        titulo.value == "" ||
        url.value == ""
    ){

        error.textContent =
        "Completa todos los campos";

    }
    else{

        let tarjeta =
        document.createElement("div");

        tarjeta.classList.add("tarjeta");

        let texto =
        document.createElement("h3");

        texto.textContent =
        titulo.value;

        let imagen =
        document.createElement("img");

        imagen.src =
        url.value;

        let botonFavorito =
        document.createElement("button");

        botonFavorito.textContent =
        "Favorito";

        let botonEliminar =
        document.createElement("button");

        botonEliminar.textContent =
        "Eliminar";

        tarjeta.appendChild(texto);

        tarjeta.appendChild(imagen);

        tarjeta.appendChild(botonFavorito);

        tarjeta.appendChild(botonEliminar);

        galeria.appendChild(tarjeta);

        botonFavorito.onclick = function(){

            tarjeta.classList.toggle("favorita");

            actualizarContadores();

        };

        botonEliminar.onclick = function(){

            tarjeta.remove();

            actualizarContadores();

        };

        formulario.reset();

        actualizarContadores();

    }

};

borrarGaleria.onclick = function(){

    galeria.innerHTML = "";

    actualizarContadores();

};

mostrarTodas.onclick = function(){

    let tarjetas =
    document.querySelectorAll(".tarjeta");

    tarjetas.forEach(function(t){

        t.style.display = "block";

    });

};

mostrarFavoritas.onclick = function(){

    let tarjetas =
    document.querySelectorAll(".tarjeta");

    tarjetas.forEach(function(t){

        if(t.classList.contains("favorita")){

            t.style.display = "block";

        }
        else{

            t.style.display = "none";

        }

    });

};

mostrarNoFavoritas.onclick = function(){

    let tarjetas =
    document.querySelectorAll(".tarjeta");

    tarjetas.forEach(function(t){

        if(t.classList.contains("favorita")){

            t.style.display = "none";

        }
        else{

            t.style.display = "block";

        }

    });

};