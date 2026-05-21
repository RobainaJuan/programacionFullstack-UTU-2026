function ejecutar() {
    let nombres = ["Juan", "María", "Pedro", "Ana", "Carlos"];
    
    let mensaje = "Nombres:\n";
    for (let i = 0; i < nombres.length; i++) {
        mensaje += nombres[i] + "\n";
    }
    
    alert(mensaje);
}
