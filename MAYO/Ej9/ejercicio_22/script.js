function ejecutar() {
    let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16];
    let pares = [];
    
    for (let i = 0; i < numeros.length; i++) {
        if (numeros[i] % 2 == 0) {
            pares.push(numeros[i]);
        }
    }
    
    alert("Números pares: " + pares);
}
