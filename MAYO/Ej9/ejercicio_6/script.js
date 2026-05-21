function ejecutar() {
    let numero1 = parseInt(prompt("Ingresa el primer número:"));
    let numero2 = parseInt(prompt("Ingresa el segundo número:"));
    let numero3 = parseInt(prompt("Ingresa el tercer número:"));
    
    let mayor = numero1;
    if (numero2 > mayor) {
        mayor = numero2;
    }
    if (numero3 > mayor) {
        mayor = numero3;
    }
    
    alert("El número mayor es: " + mayor);
}
