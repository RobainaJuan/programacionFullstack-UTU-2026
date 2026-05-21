function ejecutar() {
    let numeros = [45, 23, 89, 12, 56, 34, 90, 8];
    
    let mayor = numeros[0];
    let menor = numeros[0];
    
    for (let i = 0; i < numeros.length; i++) {
        if (numeros[i] > mayor) {
            mayor = numeros[i];
        }
        if (numeros[i] < menor) {
            menor = numeros[i];
        }
    }
    
    alert("Número mayor: " + mayor + "\nNúmero menor: " + menor);
}
