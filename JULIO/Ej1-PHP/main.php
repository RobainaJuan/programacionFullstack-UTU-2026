<?php
// Bloque 1
// 1
$nombre = "Ana";
$edad = 17;
$ciudad = "Libertad";

echo "Hola, mi nombre es $nombre, tengo $edad años y vivo en $ciudad.
";

// 2
$nombreproducto = "Teclado";
$precio = "$1200";
$cantidad_disponible = "5";

echo "
Producto: ".$nombreproducto."
Precio: ".$precio."
Stock: ".$cantidad_disponible." unidades
";

// 3
$nombre_del_jugador = "Mateo";
$nombre_del_personaje = "DragonX";
$nivel = 25;
$servidor = "Latinoamérica";

echo "
=== PERFIL DEL JUGADOR ===
$nombre_del_jugador
Personaje: $nombre_del_personaje
💪: $nivel
🌍: $servidor
========================
";

// 4

$nombre = "Lucía";
$curso = "Tercero";
$materia = "Programación";

echo "
Nombre: $nombre;
Curso: $curso;
Materia: $materia
\n";

// Bloque 2
// 1
$num1 = 23;
$num2 = 32;

echo "Suma: ".($num1 + $num2)."\n";
echo "Resta: ".($num1 - $num2)."\n";
echo "Division: ".($num1 / $num2)."\n";
echo "Multiplicacion: ".($num1 * $num2)."\n";

// 2
$base = 5;
$altura = 10;

echo "\nArea del rectangulo = ".($base * $altura)."\n";

// 3
$Nota1 = 8;
$Nota2 = 7;
$Nota3 = 9;

$Promedio = ($Nota1 + $Nota2 + $Nota3 / 3);

echo "\nPromedio de nota: ".$Promedio."\n";

// 4
$minutos = 90;

$horas = ($minutos / 60);
$restoMinutos = $minutos % 60;

echo "\n".$minutos . " minutos equivalen a " . (int)$horas . " horas y " . $restoMinutos . " minutos.\n";

// Bloque 3
// 1
$num1 = 5;
$num2 = 6;

echo "\n";

if ($num1 == $num2){
    echo "Son iguales\n";
} else {
    echo "No son iguales\n";
}
if ($num1 > $num2){
    echo "$num1 es mayor a $num2\n";
} else {
    echo "$num1 no es mayor a $num2\n";
}
if ($num1 < $num2){
    echo "$num2 es mayor a $num1\n";
} else {
    echo "$num2 no es mayor a $num1\n";
}

// 2
echo "\n";

$edad = 17;

if ($edad >= 18){
    echo "es mayor de edad\n";
} else {
    echo "todavia es menor\n";
}

// 3
echo "\n";

$numero = 10;
$texto = "10";

if ($numero == $texto){
    echo "Compara directamente los valores, o sea que 10 = 10\n";
}
if ($numero === $texto){
    echo "Acá no debería poner nada";
} else {
    echo "Comparación estricta, compara a fondo las variles, y no son iguales porque una es int y otra string\n";
}

// 4
echo "\n";

$stock_disponible = 53;
$cantidad_solicitada = 1;
$precio = 499;
$presupuesto_del_cliente = 500;

if ($stock_disponible > 0 && $presupuesto_del_cliente >= $precio){
    echo "compra exitosa";
} elseif ($stock_disponible < 0 && $presupuesto_del_cliente >= $precio)

?>