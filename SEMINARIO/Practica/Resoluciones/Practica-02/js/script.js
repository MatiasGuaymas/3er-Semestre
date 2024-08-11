/* Ejercicio 1: Explorando Tipos de Datos
Imprime en consola el tipo de dato de varias variables definidas. */

console.log("Ejercicio 1");

let a1 = 1; //Imprime number
let b = true; //Imprime boolean
let c = "Hola"; //Imprime string
let d = null; //Imprime object
let e; //Imprime undefined
let f = 2n ** 60n; //Imprime bigint
let g = new Date(); //Imprime object
let h = [1, 2, 3, 4]; //Imprime object
let i = 'Hola'; //Imprime string
let j = { x: 2.0, y: -3.6 }; //Imprime object
let k = "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\/" //Imprime string

let vec = [a1, b, c, d, e, f, g, h, i, j, k]
for (let valor of vec) {
    console.log(typeof valor)
}

/* Ejercicio 2: Jugando con Incrementos y Operadores de
Comparación
Analiza y verifica el comportamiento de operadores de incremento y
comparación. */

console.log("EJercicio 2");

let a = 25;
console.log(++a); //Imprime 26
console.log(a++); //Imprime 26 y luego le suma uno
console.log(a == '27'); //Imprime true
console.log(a === '27'); //Imprime false

/*Ejercicio 3: Máximo, Mínimo, Promedio y Suma de un Array
Define funciones para operar sobre un arreglo de números.
function max(values)  * retorna el valor máximo * 
function min(values)  * retorna el valor mínimo *
function avg(values)  * retorna el valor promedio *
function sum(values)  * retorna la sumatoria de los valores*
¿Cómo puede manejar el caso en que el arreglo no tenga ningún elemento?
¿Cómo puede manejar el caso en que el arreglo contenga un elemento que
no sea numérico?
Realice pruebas con diferentes valores: */

console.log("Ejercicio 3");

var prices = [1.2, 2, 22, -33, 12, 0.0, "13", Math.PI];
var names = ["John", "Paul", "George", "Ringo"];

function max(values) {
    if (values.length === 0) return;
    else {
        maximo = -Number.MAX_VALUE;
        for (let valor of values) {
            if (typeof valor === "number") {
                maximo = Math.max(maximo, valor);
            }
        }
        if (maximo === -Number.MAX_VALUE) return 'Arreglo sin numeros';
        else return maximo;
    }
}

function min(values) {
    if (values.length === 0) return;
    else {
        minimo = Number.MAX_VALUE;
        for (let valor of values) {
            if (typeof valor === "number") {
                minimo = Math.min(minimo, valor);
            }
        }
        if (minimo === Number.MAX_VALUE) return 'Arreglo sin numeros';
        else return minimo;
    }
}

function avg(values) {
    if(values.length === 0) return;
    else {
        suma = 0;
        cant = 0;
        for(let valor of values) {
            if(typeof valor === "number") {
                suma+= valor;
                cant++;
            } 
        }
        if ((suma === 0) && (cant === 0)) return 'Arreglo sin numeros';
        else return suma/cant;
    }
}

function sum(values) {
    if (sum.length === 0) return;
    else {
        suma = 0;
        for (let valor of values) {
            if (typeof valor === "number") {
                suma += valor;
            }
        }
        if (suma === 0)  return 'Arreglo sin numeros'; //El tema es que si el usuario ingresa un arreglo de todos 0, en realidad si tiene 0s
        else return suma;
    }
}

console.log(max(prices));
console.log(min(prices));
console.log(avg(prices));
console.log(sum(prices));
console.log(max(names));
console.log(min(names));
console.log(avg(names));
console.log(sum(names));
console.log(max([]));
console.log(min([]));
console.log(avg([]));
console.log(sum([]));

/* Ejercicio 4: Uniendo Cadenas con concat
Dada la siguiente función concat que devuelve la concatenación de dos
strings:
function concat(left, right) {
return left.concat(right);
}
¿Qué imprime la siguiente sentencia?
var names = ["John", "Paul", "George", "Ringo"];
console.log(names.reduce(concat)); */

console.log("Ejercicio 4");

function concat(left, right) {
    return left.concat(right);
}

var names = ["John", "Paul", "George", "Ringo"];
console.log(names.reduce(concat)); //Imprime JohnPaulGeorgeRingo

/* Ejercicio 5: ¿Son Iguales? Comparando Arrays
Implementa una función para comparar si dos arrays son iguales.
function arrayEquals(a, b) { / implementar / }
¿Utilizó == o === para comparar los elementos?
Nota: dos arreglos son iguales si tienen la misma longitud y elementos
iguales en cada posición.
Por ejemplo: */

function arrayEquals(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

console.log("Ejercicio 5");

var aEj5 = [1, 2, 3, 4];
var bEj5 = [1, 2, 3, 4];
var cEj5 = [1, 2, 3, 4, 5];
var dEj5 = "Hola";
var eEj5 = null;
console.log(arrayEquals(aEj5, aEj5)); // true
console.log(arrayEquals(aEj5, bEj5)); // true
console.log(arrayEquals(bEj5, cEj5)); // false
console.log(arrayEquals(eEj5, cEj5)); // false
console.log(arrayEquals(cEj5, dEj5)); // false
console.log(arrayEquals(eEj5, eEj5)); // false

/* Ejercicio 6: ¿Es Entero? Validación de Números
Crea una función para determinar si un valor es un número entero.
function isInteger(x) {  implementar  } */

console.log("Ejercicio 6");

function isInteger(x) {
    return typeof x === "number" && Math.floor(x) === x;
}

console.log(isInteger(2)); // retorna true
console.log(isInteger(2.0)); // retorna true
console.log(isInteger(2.1)) // retorna false
console.log(isInteger(-10)); // retorna true
console.log(isInteger([1])); // retorna false
console.log(isInteger("2")); // retorna false
console.log(isInteger(true)); // retorna false
console.log(isInteger(null)); // retorna false
var num;
console.log(isInteger(num)); // retorna false

/* Ejercicio 7: ¿Es Numérico? Validando Strings
Desarrolla una función que verifica si un string es numérico. 
function isNumeric(str) {  implementar  } */

console.log("Ejercicio 7");

function isNumeric(str) {
    return typeof (str) !== "number" && !isNaN(str);
}

console.log(isNumeric("2")) // retorna true
console.log(isNumeric("2a")) // retorna false
console.log(isNumeric(2)) // retorna false

/* Ejercicio 9: Alfabéticamente Ordenando Palabras
Ordena un arreglo de palabras alfabéticamente y en orden inverso. */

console.log("Ejercicio 9");

var words = ['perro', 'gato', 'casa', 'árbol', 'nube', 'día', 'noche', 'zanahoria', 'babuino'];

//Utilizo .slice() para hacer una copia del vector y no modificarlo cuando haga los metodos .sort()
var atoz = words.slice().sort((a, b) => a.localeCompare(b, "es", { ignorePunctuation: true })); //Ordenarlo alfabeticamente
var ztoa = words.slice().sort((b, a) => a.localeCompare(b, "es", { ignorePunctuation: true })); //Ordenarlo al reves

console.log(atoz);
console.log(ztoa);


/* Ejercicio 10: Ordenando por Longitud de Palabra
Dado el arreglo de palabras del ejercicio 9, ordena palabras basándote en su
longitud. */

console.log("Ejercicio 10");

let ordMenosLong = words.slice().sort((a, b) => a.length - b.length);
let ordMasLong = words.slice().sort((a, b) => b.length - a.length);

console.log(ordMenosLong);
console.log(ordMasLong);

/* Ejercicio 11: Explorando Funciones y su typeof
Comprueba el typeof de diferentes declaraciones de funciones: */

console.log("Ejercicio 11");

function identity(x) { return x; } //Funcion declarativa
var id = function (x) { return x; } //Funcion expresiva
var iden = x => x; //Funcion flecha
var identidad = identity; //Funcion clonada

//Compruebe el resultado de las siguientes sentencias:

console.log(identity('Hola'));
console.log(id('Hello'));
console.log(iden('Buen día'));
console.log(identidad('Buen día'));

//Todos los demas ejercicios