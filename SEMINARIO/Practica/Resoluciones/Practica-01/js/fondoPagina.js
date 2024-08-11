//Ejercicio adicional 1: Cambia el Color de Fondo
function generarColorHexadecimal() {
    return "#" + Math.floor(Math.random() * 10000).toString(16); //Genera un codigo de color Random, y con toString(16) lo represento en hexadecimal.
}

function cambiarFondo() {
    let color = generarColorHexadecimal();
    document.body.style.backgroundColor = color; //Con document.body accedo al elemento body del HTML, con style.backgroundColor, acceso a la propiedad de estilo del fondo y lo cambio por la variable color.
}

window.onload = cambiarFondo(); //Cada vez que se recarga el navegador, llama a la funcion cambiarFondo, que justamente cambia el fondo de color, manipulando el DOM.