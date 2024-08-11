//------------ Ejercicio 2: Hola Mundo! utilizando JavaScript y 3: Debug ------------
debugger; //Ejercicio3
console.log("Hola Mundo!"); //Ejercicio2

//------------ Ejercicio4: Trabajando con Strings ------------
let texto = "Suspendisse ipsum ultrices leo. Mauris."; //Inciso 1

function contarCaracteres(cadena) { //Inciso 2
    let long = cadena.length;
    console.log("La cantidad de caracteres de la cadena ingresada es: " + long);
    let pos = cadena.indexOf("ipsum"); //Inciso 3: indexOf() encuentra la posicion de "ipsum" dentro de cadena. Si existe va a devolver pos <> -1.
    if (pos !== -1) {
        console.log("ipsum se encuentra en la posicion: " + pos); //Devolvera 12 ya que impsum comienza en el indice 12 de cadena
    } else {
        console.log("No se encontro la subcadena ipsum");
    }
}

contarCaracteres(texto);
console.log(texto.substring(1, 4).toUpperCase()); //Inciso4. String.prototype.substring(): El substring() método devuelve un subconjunto de un objeto String ; El toUpperCase() metodo retorna el valor del String en mayusculas

//------------ Ejercicio5: Trabajando con Numeros ------------
//Inciso 1
/* Comento estas constantes porque luego cambiare su valor, y como son constantes no deberian por que cambiar su valor luego de su declaracion (en el sentido de volver a declararlas con otro valor)
const a = 1;
const b = 2;
const c = 3;*/
//Inciso 3: Math.random() devuelve un numero aleatorio entre [0, 1). Math.floor() redondea hacia abajo un numero decimal al numero entero mas cercano.
//Multiplico por 5 para obtener un numero entre 0 y 4, y sumo para tener [1, 5]
const a = Math.floor(Math.random() * 8) + 1;
const b = Math.floor(Math.random() * 8) + 1;
const c = Math.floor(Math.random() * 8) + 1;
console.log("A=", a, " B=", b, " C=", c);

function operacionNumerica() {
    //Inciso 2: ** significa potencia. Math.pow() es un metodo para realizar la misma operacion
    console.log("El resultado de la operacion (A+B)^C es: ", ((a + b) ** c));
    //console.log("El resultado de la operacion (A+B)^C es: ", Math.pow(a+b, c));

    //Inciso 4: La función Math.max() retorna el mayor de cero o más números dados como parámetros de entrada, o NaN si cualquier parámetro no es un número y no puede ser convertido en uno.
    console.log("El numero mas grande las variables es: ", Math.max(a, b, c));
}

operacionNumerica();

//------------ Ejercicio 6: Trabajando con Fechas ------------
//Inciso 1
let dia1 = new Date();
let dia2 = new Date(1575978300000);

//Inciso 2
function imprimirFecha(fecha) {
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1;
    let anio = fecha.getFullYear();
    let horas = fecha.getHours();
    let mins = fecha.getMinutes();
    let segs = fecha.getSeconds();

    if (dia < 10) {
        dia = '0' + dia;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }
    if (horas < 10) {
        horas = '0' + horas;
    }
    if (mins < 10) {
        mins = '0' + mins;
    }
    if (segs < 10) {
        segs = '0' + segs;
    }

    let fechaFormateada = dia + "/" + mes + "/" + anio + " " + horas + ":" + mins + ":" + segs;

    return fechaFormateada;
}

//Inciso 3
console.log("Fecha formateada hoy: ", imprimirFecha(dia1));
console.log("Fecha formateada: ", imprimirFecha(dia2));

//Inciso 4
function intercambiarAnios(fecha1, fecha2) {
    let anio1 = fecha1.getFullYear();
    fecha1.setFullYear(fecha2.getFullYear());
    fecha2.setFullYear(anio1);

    console.log("Intercambio de fechas");
    console.log("Fecha formateada hoy: ", imprimirFecha(fecha1));
    console.log("Fecha formateada: ", imprimirFecha(fecha2));
}

intercambiarAnios(dia1, dia2);

//Inciso 5
function restarFechas(fecha1, fecha2) {
    //Saco el valor absoluto con Math.abs() para saber la diferencia entre ambas fechas
    let dif = Math.abs(fecha1.getDate() - fecha2.getDate());
    let nuevaFecha = new Date(dif);
    console.log("Nuevamente las fechas")
    console.log("Fecha formateada hoy: ", imprimirFecha(fecha1));
    console.log("Fecha formateada: ", imprimirFecha(fecha2));

    return nuevaFecha;
}

//Imprime el valor absoluto del resultado de restar dos fechas pasadas por parametros a una funcion
console.log("Nueva fecha: ", imprimirFecha(restarFechas(dia1, dia2)));