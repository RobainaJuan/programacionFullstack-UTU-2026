const imgGato = document.getElementById("imgGato");
const btnLaik = document.getElementById("btnLaik");
const btnDislaik = document.getElementById("btnDislaik");

const contadorLaik = document.getElementById("contadorLaik");
const contadorDislaik = document.getElementById("contadorDislaik");

const msj = document.getElementById("msj");

let contadorLaikValue = 0;
let contadorDislaikValue = 0;

async function cargarGato() {
    const respuesta = await fetch(
        "https://api.thecatapi.com/v1/images/search",
        {
            headers: {
                "x-api-key": "TU_API_KEY"
            }
        }
    );

    const datos = await respuesta.json();
    imgGato.src = datos[0].url;
}

async function votar(){
    const respuesta = await fetch(
        "https://api.thecatapi.com/v1/votes",
        {
            method: "POST",
            headers: {
                "x-api-key": "TU_API_KEY"
            },
            body: JSON.stringify({
                image_id: imgGato.src.split("/").pop(),
                value: 1
            })
        }
    );

    const datos = await respuesta.json();
    return datos;
}

cargarGato();

if (btnLaik) {
    btnLaik.addEventListener("click", () => {
            cargarGato();
            contadorLaikValue++;
            contadorLaik.textContent = contadorLaikValue;
            msj.textContent = "Like enviado con éxito!";
            setTimeout(() => {
                msj.textContent = "";
            }, 900);
    });
}

if (btnDislaik) {
    btnDislaik.addEventListener("click", () => {
            cargarGato();
            contadorDislaikValue++;
            contadorDislaik.textContent = contadorDislaikValue;
            msj.textContent = "Dislike enviado con éxito!";
            setTimeout(() => {
                msj.textContent = "";
            }, 900);
    });
}