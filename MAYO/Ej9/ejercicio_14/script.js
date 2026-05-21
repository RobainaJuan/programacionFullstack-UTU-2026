function ejecutar() {
    let numeroSecreto = Math.floor(Math.random() * 10) + 1;
    let adivinado = false;
    let intentos = 0;
    
    while (!adivinado) {
        let intento = parseInt(prompt("Adivina un número del 1 al 10:"));
        intentos++;
        
        if (intento === numeroSecreto) {
            alert("¡Correcto! ¡Lo adivinaste en " + intentos + " intento(s)!");
            adivinado = true;
        } else if (intento < numeroSecreto) {
            alert("El número es mayor");
        } else {
            alert("El número es menor");
        }
    }
}
