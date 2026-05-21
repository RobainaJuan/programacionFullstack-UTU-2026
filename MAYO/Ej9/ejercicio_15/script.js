function ejecutar() {
    let contador = 0;
    let numero = parseInt(prompt("Ingresa un número (0 para terminar):"));
    
    while (numero !== 0) {
        if (numero % 2 == 0) {
            contador++;
        }
        numero = parseInt(prompt("Ingresa un número (0 para terminar):"));
    }
    
    alert("Cantidad de números pares: " + contador);
}
