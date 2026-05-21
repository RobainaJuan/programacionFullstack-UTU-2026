function ejecutar() {
    let frutas = ["Manzana", "Plátano", "Naranja", "Fresa", "Sandía"];
    let buscar = prompt("¿Qué fruta buscas? (Manzana, Plátano, Naranja, Fresa, Sandía)");
    
    if (frutas.includes(buscar)) {
        alert("¡Sí existe!");
    } else {
        alert("No existe");
    }
}
