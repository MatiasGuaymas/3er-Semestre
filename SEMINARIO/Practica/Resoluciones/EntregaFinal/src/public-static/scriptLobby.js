let colorSeleccionado;
let jugadorSeleccionado = null;

const botonConfirmar = document.getElementById('botonConfirmar');
const botonCrear = document.getElementById('botonCrear');
const botonPegar = document.getElementById('botonPegar');
const botonUnirse = document.getElementById('botonUnirse');
const elementosJugador = document.querySelectorAll("#jugador .color-item");

botonCrear.addEventListener('click', crearPartida);
botonConfirmar.addEventListener('click', unirseAPartida);
botonPegar.addEventListener('click', () => pegarID());
botonUnirse.addEventListener('click', () => mostrarInput());

for (let i = 0; i < elementosJugador.length; i++)
    elementosJugador[i].addEventListener("click", crearColor());

const mostrarInput = () => {
    document.getElementById("campoInput").style.display = "block";
}

const botonConfirmacion = () => {
    if (jugadorSeleccionado) {
        botonCrear.style.display = 'inline-block';
        botonUnirse.style.display = 'inline-block';
    }
}

const pegarID = () => {
    navigator.clipboard.readText().then(texto => {
        document.getElementById('joinID').value = texto;
    });
}

const aplicarEfectos = (botones, color) => {
    for (const boton of Object.values(botones)) {
        boton.style.borderColor = color;

        boton.addEventListener('mouseover', () => {
            boton.style.backgroundColor = color;
            boton.style.color = 'white';
            boton.style.transition = '0.4s ease';
        });

        boton.addEventListener('mouseout', () => {
            boton.style.backgroundColor = '';
            boton.style.color = '';
        });
    }
}

//Funcion para cambiar el estilo de la pagina al color seleccionado
const cambiarBordes = () => {
    const contenedor = document.getElementById('jugador');
    contenedor.style.border = '3px solid #000';
    colorSeleccionado = jugadorSeleccionado.getAttribute('value');
    contenedor.style.borderColor = colorSeleccionado;
    contenedor.style.boxShadow = "0 30px 30px -15px " + colorSeleccionado;
    aplicarEfectos({ botonCrear, botonUnirse, botonPegar, botonConfirmar }, colorSeleccionado);
}

function crearColor() {
    return (event) => {
        if (jugadorSeleccionado)
            jugadorSeleccionado.classList.remove('active');
        jugadorSeleccionado = event.target;
        jugadorSeleccionado.classList.add("active");
        botonConfirmacion();
        cambiarBordes();
    }
}

//Funcion para enviar el color y el nombre seleccionados al servidor
function crearPartida() {
    let nombre = document.getElementById('nombre').innerHTML.trim();
    const datos = {
        color: colorSeleccionado,
        nombre: nombre
    };
    fetch('/partida', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
        .then(data => {
            window.location.href = data.url;
        });
}

//Funcion para unirse a una partida con el ID ingresado, nombre y color seleccionados
function unirseAPartida() {
    let id = document.getElementById('joinID').value;
    const errorID = document.getElementById('error');
    if (id === '') {
        errorID.innerHTML = 'Ingrese un ID de partida.';
        return;
    }
    let nombre = document.getElementById('nombre').innerHTML.trim();
    const datos = {
        color: colorSeleccionado,
        nombre: nombre,
        id: id
    };
    fetch('/join/' + id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
        .then(response => {
            if (response.redirected)
                window.location.href = response.url;
            else {
                response.text()
                    .then(data => {
                        if (data === 'Tablero desconocido')
                            errorID.innerHTML = 'ID inválido.';
                        else if (data === 'Partida llena')
                            errorID.innerHTML = 'La partida está llena.'
                    })
            }
        });
}