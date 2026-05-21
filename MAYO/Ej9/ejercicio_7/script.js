function ejecutar() {
    let nota = parseInt(prompt("Ingresa una nota del 1 al 10:"));
    let resultado;
    
    if (nota < 5) {
        resultado = "Insuficiente";
    } else if (nota < 8) {
        resultado = "Aceptable";
    } else {
        resultado = "Muy bien";
    }
    
    alert(resultado);
}
