function ejecutar() {
    let numero1 = parseFloat(prompt("Ingresa el primer número:"));
    let operacion = prompt("Ingresa la operación (+, -, *, /):");
    let numero2 = parseFloat(prompt("Ingresa el segundo número:"));
    let resultado;
    
    if (operacion == "+") {
        resultado = numero1 + numero2;
    } else if (operacion == "-") {
        resultado = numero1 - numero2;
    } else if (operacion == "*") {
        resultado = numero1 * numero2;
    } else if (operacion == "/") {
        resultado = numero1 / numero2;
    } else {
        resultado = "Operación no válida";
    }
    
    alert("Resultado: " + resultado);
}
