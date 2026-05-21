function ejecutar() {
    let notas = [8, 9, 7, 8.5, 9.5, 8, 7.5];
    
    let suma = 0;
    for (let i = 0; i < notas.length; i++) {
        suma += notas[i];
    }
    
    let promedio = suma / notas.length;
    
    alert("Promedio: " + promedio.toFixed(2));
}
