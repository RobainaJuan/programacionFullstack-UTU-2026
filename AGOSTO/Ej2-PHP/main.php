<?php

$numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function busqueda($suma_buscada, $numeros) {
    foreach ($numeros as $i => $numero) {
        for ($j = $i + 1; $j < count($numeros); $j++) {

            if ($numero + $numeros[$j] == $suma_buscada) {
                echo "Se encontró la suma en las posiciones ". ($i + 1) . " y " . ($j + 1);
                return;
            }
        }
    }
    echo "No se encontró";
}

busqueda(3, $numeros);