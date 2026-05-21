function ejecutar() {
    let suma = 0;
    let numero = parseInt(prompt("Ingresa un número (0 para terminar):"));
    
    while (numero !== 0) {
        suma += numero;
        numero = parseInt(prompt("Ingresa un número (0 para terminar):"));
    }
    
    alert("La suma total es: " + suma);
}
