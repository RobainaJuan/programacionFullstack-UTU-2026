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
    echo "compra exitosa\n";
} elseif ($stock_disponible <= 0 && $presupuesto_del_cliente >= $precio){
    echo "no hay stock suficiente\n";
} else {
    echo "presupuesto insuficiente\n";
}

// Bloque 4
// 1
echo "\n";

$puntuacion = 60;

if ($puntuacion >= 50){
    echo "Gano\n";
} else {
    echo "Perdio\n";
}

// 2
echo "\n";

$numero = -5;

if ($numero > 0){
    echo "$numero es positivo\n";
} elseif ($numero < 0){
    echo "$numero es negativo\n";
} else {
    echo "El numero es cero\n";
}

// 3
echo "\n";

$numero = 7;

if ($numero % 2 == 0){
    echo "$numero es par\n";
} else {
    echo "$numero es impar\n";
}

// 4
echo "\n";

$nota = 9;

if ($nota < 1 || $nota > 12){
    echo "Error: la nota debe estar entre 1 y 12\n";
} elseif ($nota < 6){
    echo "Insuficiente\n";
} elseif ($nota <= 8){
    echo "Aprobado\n";
} elseif ($nota <= 10){
    echo "Muy bueno\n";
} else {
    echo "Excelente\n";
}

// Bloque 5
// 1
echo "\n";

$usuario = "admin";
$contrasena = "1234";

if ($usuario == "admin" && $contrasena == "1234"){
    echo "Inicio de sesion correcto\n";
} else {
    echo "Usuario o contraseña incorrectos\n";
}

// 2
echo "\n";

$rol = "docente";

if ($rol == "administrador" || $rol == "docente"){
    echo "acceso permitido\n";
} else {
    echo "acceso denegado\n";
}

// 3
echo "\n";

$precio = 250;
$presupuesto = 1000;
$stock = 10;
$cantidad_solicitada = 3;

if ($stock >= $cantidad_solicitada && $presupuesto >= ($precio * $cantidad_solicitada)){
    echo "Compra realizada con exito\n";
} else {
    echo "No se puede realizar la compra\n";
}

// 4
echo "\n";

$edad = 16;
$tiene_entrada = true;
$acompanado_de_adulto = true;

if (($edad >= 18 && $tiene_entrada) || ($edad < 18 && $acompanado_de_adulto)){
    echo "Puede entrar al evento\n";
} else {
    echo "No puede entrar al evento\n";
}

// Bloque 6
// 1
echo "\n";

$edad = 10;
$precio_entrada = 1000;

if ($edad < 12){
    $precio_final = $precio_entrada * 0.5;
} else {
    $precio_final = $precio_entrada;
}

echo "Precio final: $".$precio_final."\n";

// 2
echo "\n";

$precio_unitario = 100;
$cantidad_comprada = 6;
$subtotal = $precio_unitario * $cantidad_comprada;

if ($cantidad_comprada >= 5){
    $descuento = $subtotal * 0.10;
} else {
    $descuento = 0;
}
$total_final = $subtotal - $descuento;

echo "Subtotal: $".$subtotal."\n";
echo "Descuento: $".$descuento."\n";
echo "Total final: $".$total_final."\n";

// 3
echo "\n";

$total_compra = 3000;

if ($total_compra < 1000){
    $descuento = 0;
} elseif ($total_compra < 5000){
    $descuento = $total_compra * 0.10;
} else {
    $descuento = $total_compra * 0.20;
}
$total_final = $total_compra - $descuento;

echo "Total original: $".$total_compra."\n";
echo "Descuento: $".$descuento."\n";
echo "Total final: $".$total_final."\n";

// 4
echo "\n";

$nombre_producto = "Mouse";
$precio = 800;
$stock = 20;
$cantidad_solicitada = 12;

if ($stock >= $cantidad_solicitada){
    $total = $precio * $cantidad_solicitada;
    if ($cantidad_solicitada >= 10){
        $total = $total - ($total * 0.15);
    }
    echo "Compra de ".$cantidad_solicitada." ".$nombre_producto."(s) - Total: $".$total."\n";
} else {
    echo "Error: stock insuficiente\n";
}

// Extra 1 - Switch
// 1
echo "\n";

$tipo_cliente = 2;

switch ($tipo_cliente){
    case 1:
        echo "Cliente comun: sin descuento\n";
        break;
    case 2:
        echo "Cliente frecuente: 10% de descuento\n";
        break;
    case 3:
        echo "Cliente premium: 20% de descuento\n";
        break;
    default:
        echo "Tipo de cliente no valido\n";
}

// 2
echo "\n";

$metodo_pago = "tarjeta";

switch ($metodo_pago){
    case "efectivo":
        $descuento_pago = "10%";
        break;
    case "tarjeta":
        $descuento_pago = "0% (precio normal)";
        break;
    case "transferencia":
        $descuento_pago = "5%";
        break;
    default:
        $descuento_pago = "metodo no valido";
}

echo "Metodo de pago: ".$metodo_pago." - Descuento: ".$descuento_pago."\n";

// 3
echo "\n";

$num1 = 10;
$num2 = 5;
$opcion = 3;

switch ($opcion){
    case 1:
        echo "Resultado: ".($num1 + $num2)."\n";
        break;
    case 2:
        echo "Resultado: ".($num1 - $num2)."\n";
        break;
    case 3:
        echo "Resultado: ".($num1 * $num2)."\n";
        break;
    case 4:
        echo "Resultado: ".($num1 / $num2)."\n";
        break;
    default:
        echo "Opcion incorrecta\n";
}

// Bloque 7
// 1
echo "\n";

for ($i = 1; $i <= 10; $i++){
    echo $i."\n";
}

// 2
echo "\n";

for ($i = 10; $i >= 1; $i--){
    echo $i."\n";
}
echo "¡Comenzamos!\n";

// 3
echo "\n";

for ($i = 1; $i <= 20; $i++){
    if ($i % 2 == 0){
        echo $i."\n";
    }
}

// 4
echo "\n";

$numero = 5;

for ($i = 1; $i <= 10; $i++){
    echo $numero." x ".$i." = ".($numero * $i)."\n";
}

// Bloque 8
// 1
echo "\n";

$suma = 0;
for ($i = 1; $i <= 10; $i++){
    $suma += $i;
}
echo "Suma del 1 al 10: ".$suma."\n";

// 2
echo "\n";

$suma = 0;
for ($i = 1; $i <= 100; $i++){
    $suma += $i;
}
echo "Suma del 1 al 100: ".$suma."\n";

// 3
echo "\n";

$contador = 0;
for ($i = 1; $i <= 50; $i++){
    if ($i % 2 == 0){
        $contador++;
    }
}
echo "Cantidad de numeros pares entre 1 y 50: ".$contador."\n";

// 4
echo "\n";

$suma = 0;
for ($i = 1; $i <= 100; $i++){
    if ($i % 3 == 0){
        $suma += $i;
    }
}
echo "Suma de multiplos de 3 entre 1 y 100: ".$suma."\n";

// Bloque 9
// 1
echo "\n";

$i = 1;
while ($i <= 10){
    echo $i."\n";
    $i++;
}

// 2
echo "\n";

$i = 2;
while ($i <= 20){
    echo $i."\n";
    $i += 2;
}

// 3
echo "\n";

$numero = 1;
while ($numero < 100){
    echo $numero."\n";
    $numero *= 2;
}

// 4
echo "\n";

$ahorro = 0;
$meses = 0;

while ($ahorro < 5000){
    $ahorro += 500;
    $meses++;
    echo "Mes ".$meses.": $".$ahorro."\n";
}
echo "Se necesitan ".$meses." meses para alcanzar o superar los $5000.\n";

// Bloque 10
// 1
echo "\n";

function saludar(){
    echo "Bienvenido al sistema\n";
}

saludar();
saludar();

// 2
echo "\n";

function saludarUsuario($nombre){
    echo "Hola, $nombre\n";
}

saludarUsuario("Ana");
saludarUsuario("Mateo");

// 3
echo "\n";

function sumar($numero1, $numero2){
    return $numero1 + $numero2;
}

$resultado = sumar(4, 6);
echo "Resultado: ".$resultado."\n";

// 4
echo "\n";

function calcularTotal($precio, $cantidad){
    return $precio * $cantidad;
}

echo "Total: $".calcularTotal(150, 3)."\n";
echo "Total: $".calcularTotal(500, 2)."\n";

// Bloque 11
// 1
echo "\n";

function esMayorDeEdad($edad){
    if ($edad >= 18){
        return true;
    } else {
        return false;
    }
}

var_dump(esMayorDeEdad(20));
var_dump(esMayorDeEdad(15));

// 2
echo "\n";

function esPar($numero){
    return $numero % 2 == 0;
}

var_dump(esPar(8));
var_dump(esPar(7));

// 3
echo "\n";

function aplicarDescuento($precio, $porcentaje){
    return $precio - ($precio * $porcentaje / 100);
}

$precioFinal = aplicarDescuento(1000, 10);
echo "Precio final: ".$precioFinal."\n";

// 4
echo "\n";

function calcularPromedioNotas($nota1, $nota2, $nota3){
    return ($nota1 + $nota2 + $nota3) / 3;
}

function indicarEstado($promedio){
    if ($promedio >= 6){
        echo "Aprobado\n";
    } else {
        echo "Desaprobado\n";
    }
}

$promedio = calcularPromedioNotas(8, 6, 7);
echo "Promedio: ".$promedio."\n";
indicarEstado($promedio);

// Bloque 12
// 1
echo "\n";

$nombres = ["Ana", "Luis", "Mateo", "Sofia", "Carla"];

echo $nombres[0]."\n";
echo $nombres[1]."\n";
echo $nombres[2]."\n";
echo $nombres[3]."\n";
echo $nombres[4]."\n";

// 2
echo "\n";

for ($i = 0; $i < count($nombres); $i++){
    echo $nombres[$i]."\n";
}

echo "\n";

foreach ($nombres as $nombre){
    echo $nombre."\n";
}

// 3
echo "\n";

$precios = [100, 250, 80, 500, 1200];

foreach ($precios as $precio){
    echo "$".$precio."\n";
}
echo "Cantidad de precios: ".count($precios)."\n";

// 4
echo "\n";

$numeros = [10, 20, 30, 40, 50];

$sumaManual = 0;
for ($i = 0; $i < count($numeros); $i++){
    $sumaManual += $numeros[$i];
}
echo "Suma manual: ".$sumaManual."\n";
echo "Suma con array_sum: ".array_sum($numeros)."\n";

// Bloque 13
// 1
echo "\n";

$numeros = [3, 8, 12, 15, 20, 7, 4];

foreach ($numeros as $numero){
    if ($numero % 2 == 0){
        echo $numero."\n";
    }
}

// 2
echo "\n";

$notas = [8, 5, 9, 3, 6, 10];
$aprobados = 0;

foreach ($notas as $nota){
    if ($nota >= 6){
        $aprobados++;
    }
}
echo "Cantidad de aprobados: ".$aprobados."\n";

// 3
echo "\n";

$nombres = ["Ana", "Luis", "Mateo", "Sofia"];
$buscado = "Mateo";
$encontrado = false;

foreach ($nombres as $nombre){
    if ($nombre == $buscado){
        $encontrado = true;
    }
}

if ($encontrado){
    echo "El nombre fue encontrado\n";
} else {
    echo "El nombre no existe\n";
}

// 4
echo "\n";

$numeros = [12, 45, 7, 89, 34];
$mayor = $numeros[0];

foreach ($numeros as $numero){
    if ($numero > $mayor){
        $mayor = $numero;
    }
}
echo "El numero mayor es: ".$mayor."\n";

// Bloque 14
// 1
echo "\n";

$numeros = [10, 20, 30, 40, 50];
$suma = array_sum($numeros);
$cantidad = count($numeros);
$promedio = $suma / $cantidad;

echo "Suma total: ".$suma."\n";
echo "Cantidad de elementos: ".$cantidad."\n";
echo "Promedio: ".$promedio."\n";

// 2
echo "\n";

$notas = [8, 4, 9, 5, 6];

foreach ($notas as $nota){
    if ($nota >= 6){
        echo "Nota: ".$nota." - Aprobado\n";
    } else {
        echo "Nota: ".$nota." - Desaprobado\n";
    }
}

// 3
echo "\n";

$notas = [8, 4, 9, 5, 6, 10, 3];
$aprobados = 0;
$desaprobados = 0;

foreach ($notas as $nota){
    echo $nota."\n";
    if ($nota >= 6){
        $aprobados++;
    } else {
        $desaprobados++;
    }
}
$promedio = array_sum($notas) / count($notas);

echo "Promedio: ".$promedio."\n";
echo "Aprobados: ".$aprobados."\n";
echo "Desaprobados: ".$desaprobados."\n";

// 4
echo "\n";

$numeros = [12, 7, 34, 8, 21, 9, 40];
$mayor = $numeros[0];
$menor = $numeros[0];
$pares = 0;
$impares = 0;

foreach ($numeros as $numero){
    echo $numero."\n";
    if ($numero > $mayor){
        $mayor = $numero;
    }
    if ($numero < $menor){
        $menor = $numero;
    }
    if ($numero % 2 == 0){
        $pares++;
    } else {
        $impares++;
    }
}

echo "Suma: ".array_sum($numeros)."\n";
echo "Promedio: ".(array_sum($numeros) / count($numeros))."\n";
echo "Mayor: ".$mayor."\n";
echo "Menor: ".$menor."\n";
echo "Pares: ".$pares."\n";
echo "Impares: ".$impares."\n";

// Bloque 15
// 1
echo "\n";

$persona = [
    "nombre" => "Ana",
    "edad" => 25,
    "ciudad" => "Montevideo"
];

echo "Me llamo ".$persona["nombre"].", tengo ".$persona["edad"]." años y vivo en ".$persona["ciudad"].".\n";

// 2
echo "\n";

$producto = [
    "nombre" => "Teclado",
    "precio" => 1200,
    "stock" => 5
];

echo "Producto: ".$producto["nombre"]."\n";
echo "Precio: $".$producto["precio"]."\n";
echo "Stock: ".$producto["stock"]."\n";

// 3
echo "\n";

echo "Producto: ".$producto["nombre"]." - Precio: $".$producto["precio"]." - Stock: ".$producto["stock"]."\n";

$producto["precio"] += 200;
$producto["stock"] -= 1;
$producto["categoria"] = "Perifericos";

echo "\nProducto actualizado:\n";
echo "Producto: ".$producto["nombre"]." - Precio: $".$producto["precio"]." - Stock: ".$producto["stock"]." - Categoria: ".$producto["categoria"]."\n";

// 4
echo "\n";

$producto = [
    "nombre" => "Mouse",
    "precio" => 800,
    "stock" => 10
];
$cantidad_solicitada = 4;

if ($producto["stock"] >= $cantidad_solicitada){
    $total = $producto["precio"] * $cantidad_solicitada;
    $producto["stock"] -= $cantidad_solicitada;
    echo "Venta realizada: ".$cantidad_solicitada." ".$producto["nombre"]."(s) - Total: $".$total."\n";
    echo "Stock restante: ".$producto["stock"]."\n";
} else {
    echo "Error: stock insuficiente\n";
}

// Bloque 16
// 1
echo "\n";

$productos = [
    ["nombre" => "Teclado", "precio" => 1200],
    ["nombre" => "Mouse", "precio" => 800],
    ["nombre" => "Monitor", "precio" => 15000]
];

foreach ($productos as $producto){
    echo $producto["nombre"]." - $".$producto["precio"]."\n";
}

// 2
echo "\n";

$productos = [
    ["nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["nombre" => "Mouse", "precio" => 800, "stock" => 0],
    ["nombre" => "Monitor", "precio" => 15000, "stock" => 3]
];

foreach ($productos as $producto){
    if ($producto["stock"] > 0){
        echo $producto["nombre"]." - $".$producto["precio"]." - Stock: ".$producto["stock"]."\n";
    }
}

// 3
echo "\n";

$productos = [
    ["nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["nombre" => "Mouse", "precio" => 800, "stock" => 10],
    ["nombre" => "Monitor", "precio" => 15000, "stock" => 3],
    ["nombre" => "Auriculares", "precio" => 900, "stock" => 7]
];

foreach ($productos as $producto){
    if ($producto["precio"] > 1000){
        echo $producto["nombre"]." - $".$producto["precio"]."\n";
    }
}

// 4
echo "\n";

$valorTotal = 0;
foreach ($productos as $producto){
    $valorInventario = $producto["precio"] * $producto["stock"];
    echo $producto["nombre"]." - Valor del inventario: $".$valorInventario."\n";
    $valorTotal += $valorInventario;
}
echo "Valor total del inventario: $".$valorTotal."\n";

// Bloque 17
// 1
echo "\n";

$productos = [
    ["nombre" => "Teclado", "precio" => 1200],
    ["nombre" => "Mouse", "precio" => 800],
    ["nombre" => "Monitor", "precio" => 15000]
];
$buscado = "Mouse";

foreach ($productos as $producto){
    if ($producto["nombre"] == $buscado){
        echo "Producto encontrado: ".$producto["nombre"]." - $".$producto["precio"]."\n";
    }
}

// 2
echo "\n";

$productos = [
    ["id" => 1, "nombre" => "Teclado", "precio" => 1200, "stock" => 5],
    ["id" => 2, "nombre" => "Mouse", "precio" => 800, "stock" => 10],
    ["id" => 3, "nombre" => "Monitor", "precio" => 15000, "stock" => 3]
];
$idBuscado = 2;

foreach ($productos as $producto){
    if ($producto["id"] == $idBuscado){
        echo "ID: ".$producto["id"]." - Nombre: ".$producto["nombre"]." - Precio: $".$producto["precio"]." - Stock: ".$producto["stock"]."\n";
    }
}

// 3
echo "\n";

$productosSinId = [
    ["nombre" => "Teclado", "precio" => 1200],
    ["nombre" => "Mouse", "precio" => 800],
    ["nombre" => "Monitor", "precio" => 15000]
];

$masCaro = $productosSinId[0];
foreach ($productosSinId as $producto){
    if ($producto["precio"] > $masCaro["precio"]){
        $masCaro = $producto;
    }
}
echo "Producto mas caro: ".$masCaro["nombre"]." - $".$masCaro["precio"]."\n";

// 4
echo "\n";

$idBuscado = 5;
$encontrado = false;

foreach ($productos as $producto){
    if ($producto["id"] == $idBuscado){
        echo "ID: ".$producto["id"]." - Nombre: ".$producto["nombre"]." - Precio: $".$producto["precio"]." - Stock: ".$producto["stock"]."\n";
        $encontrado = true;
    }
}

if (!$encontrado){
    echo "Producto no encontrado\n";
}

// Bloque 18
// 1
echo "\n";

function sumarNumeros($numeros){
    return array_sum($numeros);
}

echo "Suma: ".sumarNumeros([10, 20, 30])."\n";

// 2
echo "\n";

function contarAprobados($notas){
    $contador = 0;
    foreach ($notas as $nota){
        if ($nota >= 6){
            $contador++;
        }
    }
    return $contador;
}

echo "Aprobados: ".contarAprobados([8, 5, 9, 4, 6])."\n";

// 3
echo "\n";

function buscarProductoPorId($productos, $id){
    foreach ($productos as $producto){
        if ($producto["id"] == $id){
            return $producto;
        }
    }
    return null;
}

$productosBusqueda = [
    ["id" => 1, "nombre" => "Teclado", "precio" => 1200],
    ["id" => 2, "nombre" => "Mouse", "precio" => 800]
];

$resultado = buscarProductoPorId($productosBusqueda, 2);
if ($resultado !== null){
    echo "Producto encontrado: ".$resultado["nombre"]."\n";
} else {
    echo "Producto no encontrado\n";
}

// 4
echo "\n";

function obtenerProductosConStock($productos){
    $conStock = [];
    foreach ($productos as $producto){
        if ($producto["stock"] > 0){
            $conStock[] = $producto;
        }
    }
    return $conStock;
}

$productosStock = [
    ["nombre" => "Teclado", "stock" => 5],
    ["nombre" => "Mouse", "stock" => 0],
    ["nombre" => "Monitor", "stock" => 2]
];

$disponibles = obtenerProductosConStock($productosStock);
foreach ($disponibles as $producto){
    echo $producto["nombre"]." - Stock: ".$producto["stock"]."\n";
}

// Bloque 19
// 1
echo "\n";

function mostrarNotas($notas){
    foreach ($notas as $nota){
        echo $nota."\n";
    }
}
function calcularPromedioArray($notas){
    return array_sum($notas) / count($notas);
}
function notaMasAlta($notas){
    $mayor = $notas[0];
    foreach ($notas as $nota){
        if ($nota > $mayor){
            $mayor = $nota;
        }
    }
    return $mayor;
}
function notaMasBaja($notas){
    $menor = $notas[0];
    foreach ($notas as $nota){
        if ($nota < $menor){
            $menor = $nota;
        }
    }
    return $menor;
}
function contarAprobadosNotas($notas){
    $contador = 0;
    foreach ($notas as $nota){
        if ($nota >= 6){
            $contador++;
        }
    }
    return $contador;
}
function contarDesaprobadosNotas($notas){
    $contador = 0;
    foreach ($notas as $nota){
        if ($nota < 6){
            $contador++;
        }
    }
    return $contador;
}

$notas = [8, 4, 9, 5, 6, 10, 3];

mostrarNotas($notas);
echo "Promedio: ".calcularPromedioArray($notas)."\n";
echo "Nota mas alta: ".notaMasAlta($notas)."\n";
echo "Nota mas baja: ".notaMasBaja($notas)."\n";
echo "Aprobados: ".contarAprobadosNotas($notas)."\n";
echo "Desaprobados: ".contarDesaprobadosNotas($notas)."\n";

// 2
echo "\n";

$productosInventario = [
    ["id" => 1, "nombre" => "Teclado", "precio" => 1200, "stock" => 5, "categoria" => "Perifericos"],
    ["id" => 2, "nombre" => "Mouse", "precio" => 800, "stock" => 0, "categoria" => "Perifericos"],
    ["id" => 3, "nombre" => "Monitor", "precio" => 15000, "stock" => 3, "categoria" => "Pantallas"]
];

function mostrarProductosInventario($productos){
    foreach ($productos as $producto){
        echo $producto["nombre"]." - $".$producto["precio"]." - Stock: ".$producto["stock"]." - Categoria: ".$producto["categoria"]."\n";
    }
}
function productosConStockInventario($productos){
    foreach ($productos as $producto){
        if ($producto["stock"] > 0){
            echo $producto["nombre"]." - Stock: ".$producto["stock"]."\n";
        }
    }
}
function buscarPorIdInventario($productos, $id){
    foreach ($productos as $producto){
        if ($producto["id"] == $id){
            return $producto;
        }
    }
    return null;
}
function valorTotalInventario($productos){
    $total = 0;
    foreach ($productos as $producto){
        $total += $producto["precio"] * $producto["stock"];
    }
    return $total;
}
function productoMasCaroInventario($productos){
    $masCaro = $productos[0];
    foreach ($productos as $producto){
        if ($producto["precio"] > $masCaro["precio"]){
            $masCaro = $producto;
        }
    }
    return $masCaro;
}

echo "--- Todos los productos ---\n";
mostrarProductosInventario($productosInventario);

echo "\n--- Con stock ---\n";
productosConStockInventario($productosInventario);

echo "\n--- Busqueda por ID 2 ---\n";
$productoBuscado = buscarPorIdInventario($productosInventario, 2);
echo $productoBuscado["nombre"]."\n";

echo "\nValor total del inventario: $".valorTotalInventario($productosInventario)."\n";

$masCaroInventario = productoMasCaroInventario($productosInventario);
echo "Producto mas caro: ".$masCaroInventario["nombre"]." - $".$masCaroInventario["precio"]."\n";

// 3
echo "\n";

$usuarios = [
    ["id" => 1, "nombre" => "Ana", "usuario" => "ana123", "contrasena" => "1234", "rol" => "administrador", "activo" => true],
    ["id" => 2, "nombre" => "Luis", "usuario" => "luis99", "contrasena" => "abcd", "rol" => "docente", "activo" => false]
];

function buscarUsuario($usuarios, $usuario){
    foreach ($usuarios as $u){
        if ($u["usuario"] == $usuario){
            return $u;
        }
    }
    return null;
}

$usuarioIngresado = "ana123";
$contrasenaIngresada = "1234";

$usuarioEncontrado = buscarUsuario($usuarios, $usuarioIngresado);

if ($usuarioEncontrado === null){
    echo "Usuario no encontrado\n";
} elseif ($usuarioEncontrado["contrasena"] != $contrasenaIngresada){
    echo "Contraseña incorrecta\n";
} elseif (!$usuarioEncontrado["activo"]){
    echo "El usuario no esta activo\n";
} else {
    echo "Acceso concedido. Rol: ".$usuarioEncontrado["rol"]."\n";
}

// 4
echo "\n";

$carrito = [
    ["nombre" => "Teclado", "precio" => 1200, "cantidad" => 2],
    ["nombre" => "Mouse", "precio" => 800, "cantidad" => 1],
    ["nombre" => "Monitor", "precio" => 15000, "cantidad" => 1]
];

function calcularSubtotal($producto){
    return $producto["precio"] * $producto["cantidad"];
}
function calcularTotalCompra($carrito){
    $total = 0;
    foreach ($carrito as $producto){
        $total += calcularSubtotal($producto);
    }
    return $total;
}
function aplicarDescuentoCarrito($total){
    if ($total > 10000){
        return $total * 0.90;
    }
    return $total;
}

foreach ($carrito as $producto){
    echo $producto["nombre"]." x".$producto["cantidad"]." - Subtotal: $".calcularSubtotal($producto)."\n";
}

$totalCarrito = calcularTotalCompra($carrito);
$totalFinalCarrito = aplicarDescuentoCarrito($totalCarrito);

echo "\nTotal de la compra: $".$totalCarrito."\n";
echo "Total final (con descuento si corresponde): $".$totalFinalCarrito."\n";

// Bloque 20
// 1
echo "\n";

$persona = [
    "nombre" => "Ana",
    "edad" => 25,
    "ciudad" => "Montevideo"
];

echo json_encode($persona)."\n";

// 2
echo "\n";

$productosJson = [
    ["nombre" => "Teclado", "precio" => 1200],
    ["nombre" => "Mouse", "precio" => 800],
    ["nombre" => "Monitor", "precio" => 15000]
];

echo json_encode($productosJson)."\n";

// 3
echo "\n";

$productoUnico = ["nombre" => "Teclado", "precio" => 1200];

$respuesta = [
    "exito" => true,
    "mensaje" => "Producto encontrado",
    "producto" => $productoUnico
];

echo json_encode($respuesta)."\n";

// 4
echo "\n";

$productosBusquedaJson = [
    ["id" => 1, "nombre" => "Teclado", "precio" => 1200]
];
$idBuscadoJson = 5;
$productoEncontradoJson = null;

foreach ($productosBusquedaJson as $producto){
    if ($producto["id"] == $idBuscadoJson){
        $productoEncontradoJson = $producto;
    }
}

if ($productoEncontradoJson !== null){
    $respuestaJson = [
        "exito" => true,
        "producto" => $productoEncontradoJson
    ];
} else {
    $respuestaJson = [
        "exito" => false,
        "mensaje" => "Producto no encontrado"
    ];
}

echo json_encode($respuestaJson)."\n";

?>