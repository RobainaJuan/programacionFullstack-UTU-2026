function ejecutar() {
    let opcion = prompt("Menú:\n1 → Saludar\n2 → Mostrar fecha\n3 → Mostrar número random\n\nElige una opción:");
    let resultado;
    
    if (opcion == 1) {
        resultado = "¡Hola!";
    } else if (opcion == 2) {
        resultado = "Fecha actual: " + new Date();
    } else if (opcion == 3) {
        resultado = "Número random: " + Math.floor(Math.random() * 100);
    } else {
        resultado = "Opción no válida";
    }
    
    alert(resultado);
}
