function ejecutar() {
    let nombres = [];
    let nombre = prompt("Ingresa un nombre (escribe 'salir' para terminar):");
    
    while (nombre.toLowerCase() !== "salir") {
        if (nombre !== null && nombre !== "") {
            nombres.push(nombre);
        }
        nombre = prompt("Ingresa un nombre (escribe 'salir' para terminar):");
    }
    
    let mensaje = "Nombres guardados:\n";
    for (let i = 0; i < nombres.length; i++) {
        mensaje += (i + 1) + ". " + nombres[i] + "\n";
    }
    
    alert(mensaje);
}
