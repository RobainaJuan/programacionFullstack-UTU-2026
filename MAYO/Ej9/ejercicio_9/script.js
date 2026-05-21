function ejecutar() {
    let resultado = "";
    for (let i = 1; i <= 20; i++) {
        if (i % 2 == 0) {
            resultado += i + "\n";
        }
    }
    alert(resultado);
}
