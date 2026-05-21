function ejecutar() {
    let frutas = ["Manzana", "Plátano", "Naranja", "Fresa", "Uva"];
    
    let mensaje = "Frutas:\n";
    for (let i = 0; i < frutas.length; i++) {
        mensaje += (i + 1) + ". " + frutas[i] + "\n";
    }
    
    alert(mensaje);
}
