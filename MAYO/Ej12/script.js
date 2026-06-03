const formulario = document.querySelector("#formulario");
const contenedor = document.querySelector("#contenedor");
const error = document.querySelector("#error");
const contador = document.querySelector("#contador");
const filtro = document.querySelector("#filtro");
const modoBtn = document.querySelector("#modoBtn");

let cantidad = 0;

function actualizarContador() {
    cantidad = document.querySelectorAll(".tarjeta").length;
    contador.textContent = `Elementos agregados: ${cantidad}`;
}

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = document.querySelector("#nombre").value;
    const descripcion = document.querySelector("#descripcion").value;
    const tipo = document.querySelector("#tipo").value;
    const estado = document.querySelector("#estado").value;
    const calificacion = document.querySelector("#calificacion").value;
    const imagen = document.querySelector("#imagen").value;

    if(nombre.trim() === "") {
        error.textContent = "El nombre es obligatorio";
        return;
    }

    if(calificacion < 1 || calificacion > 5) {
        error.textContent = "La calificación debe estar entre 1 y 5";
        return;
    }

    error.textContent = "";

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");

    tarjeta.dataset.tipo = tipo;
    tarjeta.dataset.estado = estado;
    tarjeta.dataset.favorito = "false";

    tarjeta.innerHTML = `
        <img src="${imagen}" alt="${nombre}">
        <h2 class="titulo">${nombre}</h2>
        <p>${descripcion}</p>
        <p><strong>Tipo:</strong> ${tipo}</p>
        <p class="estadoTexto"><strong>Estado:</strong> ${estado}</p>
        <p><strong>Calificación:</strong> ${calificacion}/5</p>

        <button class="favoritoBtn">Favorito</button>
        <button class="estadoBtn">Cambiar estado</button>
        <button class="eliminarBtn">Eliminar</button>
    `;

    contenedor.appendChild(tarjeta);

    actualizarContador();

    formulario.reset();

    const eliminarBtn = tarjeta.querySelector(".eliminarBtn");
    const favoritoBtn = tarjeta.querySelector(".favoritoBtn");
    const estadoBtn = tarjeta.querySelector(".estadoBtn");
    const titulo = tarjeta.querySelector(".titulo");
    const estadoTexto = tarjeta.querySelector(".estadoTexto");

    eliminarBtn.addEventListener("click", function() {
        tarjeta.remove();
        actualizarContador();
    });

    favoritoBtn.addEventListener("click", function() {

        if(tarjeta.dataset.favorito === "false") {
            tarjeta.dataset.favorito = "true";
            tarjeta.classList.add("favorito");
        } else {
            tarjeta.dataset.favorito = "false";
            tarjeta.classList.remove("favorito");
        }

    });

    estadoBtn.addEventListener("click", function() {

        let estadoActual = tarjeta.dataset.estado;

        if(estadoActual === "Pendiente") {
            estadoActual = "En progreso";
        }
        else if(estadoActual === "En progreso") {
            estadoActual = "Terminado";
        }
        else {
            estadoActual = "Pendiente";
        }

        tarjeta.dataset.estado = estadoActual;

        estadoTexto.innerHTML =
            `<strong>Estado:</strong> ${estadoActual}`;

    });

    titulo.addEventListener("click", function() {
        titulo.classList.toggle("titulo-activo");
    });

});

filtro.addEventListener("change", function() {

    const tarjetas = document.querySelectorAll(".tarjeta");

    tarjetas.forEach(function(tarjeta) {

        const tipo = tarjeta.dataset.tipo;
        const estado = tarjeta.dataset.estado;
        const favorito = tarjeta.dataset.favorito;

        if(filtro.value === "Todos") {
            tarjeta.style.display = "block";
        }
        else if(filtro.value === "Favoritos") {
            tarjeta.style.display =
                favorito === "true" ? "block" : "none";
        }
        else if(
            filtro.value === "Pendiente" ||
            filtro.value === "En progreso" ||
            filtro.value === "Terminado"
        ) {
            tarjeta.style.display =
                estado === filtro.value ? "block" : "none";
        }
        else {
            tarjeta.style.display =
                tipo === filtro.value ? "block" : "none";
        }

    });

});

modoBtn.addEventListener("click", function() {
    document.body.classList.toggle("oscuro");
});