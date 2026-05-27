let formulario = document.getElementById("formulario");

let tarea = document.getElementById("tarea");

let lista = document.getElementById("lista");

let error = document.getElementById("error");

let contadorTotal = document.getElementById("contadorTotal");

let contadorCompletadas = document.getElementById("contadorCompletadas");

let contadorPendientes = document.getElementById("contadorPendientes");

let borrarTodo = document.getElementById("borrarTodo");

let todas = document.getElementById("todas");

let completadas = document.getElementById("completadas");

let pendientes = document.getElementById("pendientes");

function actualizarContador(){

    let tareas = document.querySelectorAll("li");

    let completadasCantidad =
    document.querySelectorAll(".completada").length;

    let pendientesCantidad =
    tareas.length - completadasCantidad;

    contadorTotal.textContent =
    "Total: " + tareas.length;

    contadorCompletadas.textContent =
    "Completadas: " + completadasCantidad;

    contadorPendientes.textContent =
    "Pendientes: " + pendientesCantidad;

}

formulario.onsubmit = function(e){

    e.preventDefault();

    error.textContent = "";

    if(tarea.value == ""){

        error.textContent =
        "Escribe una tarea";

    }
    else{

        let nuevoLi =
        document.createElement("li");

        let texto =
        document.createElement("span");

        texto.textContent =
        tarea.value;

        let botonCompletar =
        document.createElement("button");

        botonCompletar.textContent =
        "Completar";

        let botonEliminar =
        document.createElement("button");

        botonEliminar.textContent =
        "Eliminar";

        nuevoLi.appendChild(texto);

        nuevoLi.appendChild(botonCompletar);

        nuevoLi.appendChild(botonEliminar);

        lista.appendChild(nuevoLi);

        botonCompletar.onclick = function(){

            texto.classList.toggle("completada");

            actualizarContador();

        };

        botonEliminar.onclick = function(){

            nuevoLi.remove();

            actualizarContador();

        };

        formulario.reset();

        actualizarContador();

    }

};

borrarTodo.onclick = function(){

    lista.innerHTML = "";

    actualizarContador();

};

todas.onclick = function(){

    let tareas =
    document.querySelectorAll("li");

    tareas.forEach(function(t){

        t.style.display = "list-item";

    });

};

completadas.onclick = function(){

    let tareas =
    document.querySelectorAll("li");

    tareas.forEach(function(t){

        let texto =
        t.querySelector("span");

        if(texto.classList.contains("completada")){

            t.style.display = "list-item";

        }
        else{

            t.style.display = "none";

        }

    });

};

pendientes.onclick = function(){

    let tareas =
    document.querySelectorAll("li");

    tareas.forEach(function(t){

        let texto =
        t.querySelector("span");

        if(texto.classList.contains("completada")){

            t.style.display = "none";

        }
        else{

            t.style.display = "list-item";

        }

    });

};