//Globales
let voices = [];
let idJugador;
let numeroFinal;
let parametro = '/partida/';
let pos = window.location.pathname.indexOf(parametro);
let id = window.location.pathname.substring(pos + parametro.length);
const boton1 = document.getElementById('botonTirarJugador1');
const boton2 = document.getElementById('botonTirarJugador2');
const botonPreguntaAudio = document.getElementById('escucharRespuesta');

let estadoPartida = {
    tableroId: null,
    jugador1Id: null,
    jugador2Id: null,
    color1Id: null,
    color2Id: null,
    turno: null,
    lleno: false,
    posicion1: 0,
    posicion2: 0,
    nombrePregunta: null,
    valorRespuesta: null,
    ganador: null,
    indicesPreguntas: []
};

boton1.setAttribute('disabled', '');
boton2.setAttribute('disabled', '');
document.getElementById('copiarId').addEventListener('click', () => copiarId());
botonPreguntaAudio.addEventListener('click', () => decir(document.getElementById('nombrePregunta').innerHTML));

//Cargar voces para el audio
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
}
window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
};

const numeroAleatorio = () => { // animacion del dado
    return Math.floor(Math.random() * 6) + 1;
}

//Funcion para copiar el ID de la partida
const copiarId = () => { 
    navigator.clipboard.writeText(id);
}

//Funcion para mostrar la imagen del dado
const mostrarImagen = () => {
    const imagen = document.getElementById('dado' + estadoPartida.turno);
    setTimeout(function () {
        imagen.style.transition = 'opacity 1s ease-in';
        imagen.style.opacity = 1;
    }, 100);
}

//Funcion para habilitar o deshabilitar los botones de tirar dado
const cambiarBotones = () => {
    const botonTirar = document.getElementById('botonTirarJugador' + idJugador);
    botonTirar.hasAttribute('disabled') ? botonTirar.removeAttribute('disabled') : botonTirar.setAttribute('disabled', '');
}

//Animacion de tirar el dado
function mostrarNumerosRapidos() {
    if (estadoPartida.turno == idJugador) {
        fetch('/numeroFinal')
            .then(response => response.json())
            .then(data => {
                numeroFinal = data.numero;
            });
        let botonActual = estadoPartida.turno === 1 ? document.getElementById('botonTirarJugador1') : document.getElementById('botonTirarJugador2');
        botonActual.setAttribute('disabled', '');
        const numerosContainer = document.getElementById('container-numeros-jugador' + estadoPartida.turno);
        let contador = 0;
        let id;
        function mostrarSiguienteNumero() {
            if (contador < 15 || !numeroFinal) {
                numerosContainer.innerHTML = numeroAleatorio();
                contador++;
                id = setTimeout(mostrarSiguienteNumero, 100);
            } else {
                clearTimeout(id);
                if (document.getElementById('dado' + estadoPartida.turno) !== null)
                    document.getElementById('dado' + estadoPartida.turno).remove();
                let imagen = document.createElement('img');
                estadoPartida.turno == 1 ? imagen.id = 'dado1' : imagen.id = 'dado2';
                imagen.style.opacity = 0;
                imagen.src = '/s/media/cara' + numeroFinal + '.png';
                const player = estadoPartida.turno === 1 ? document.getElementById('jugador1') : document.getElementById('jugador2');
                player.append(imagen);
                mostrarImagen();
                numerosContainer.innerHTML = '';
                let texto = document.createElement('p');
                texto.style.margin = '0';
                texto.innerHTML = "El número que te tocó es: " + numeroFinal;
                numerosContainer.append(texto);
                estadoPartida.turno == 1 ? marcarDestino(1) : marcarDestino(2);
            }
        }
        mostrarSiguienteNumero();
    }
}

//Funcion para eliminar la pregunta anterior
const eliminarAnterior = () => {
    const nombrePregunta = document.getElementById('nombrePregunta');
    if (nombrePregunta)
        nombrePregunta.remove();
    const opciones = document.querySelectorAll('.opcionPregunta');
    if (opciones) {
        opciones.forEach(element => {
            element.remove()
        });
    }
    const valorRespuesta = document.getElementById('valorRespuesta');
    if (valorRespuesta)
        valorRespuesta.remove();
}

//Funcion para marcar el destino en caso de acertar
const marcarDestino = turno => {
    let destino1 = estadoPartida.posicion1 + numeroFinal;
    let destino2 = estadoPartida.posicion2 + numeroFinal;
    let destino = turno == 1 ? destino1 : destino2;
    if (destino == estadoPartida.posicion1 || destino == estadoPartida.posicion2) {
        mostrarNumerosRapidos();
        return;
    }
    let colorJugador = turno == 1 ? estadoPartida.color1Id : estadoPartida.color2Id;
    let casillero = destino >= 21 ? document.getElementById('salida') : document.getElementById(destino);
    casillero.style.border = '3px dotted';
    casillero.style.borderColor = colorJugador;
    hacerPregunta();
}

//Funcion para que el navegador hable
function decir(texto) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.pitch = 1;
    utterance.rate = 1;
    if (voices.length === 0) {
        loadVoices();
    }
    if (voices.length > 0) {
        const spanishVoices = voices.filter(voice => voice.lang.startsWith('es'));
        if (spanishVoices.length > 0) {
            utterance.voice = spanishVoices[0];
        }
    }
    speechSynthesis.speak(utterance);
}

//Funcion para mostrar la pregunta
function hacerPregunta() {
    const containerPreguntas = document.getElementById('container-preguntas');
    const name = document.getElementById('nombrePregunta') ?? document.createElement('p');
    const valorRespuesta = document.getElementById('valorRespuesta');
    if (valorRespuesta)
        valorRespuesta.remove();
    const botonEnviar = document.getElementById('enviarPregunta');
    if (botonEnviar.hasAttribute('disabled')) {
        botonEnviar.removeAttribute('disabled');
        botonPreguntaAudio.removeAttribute('disabled');
    }
    document.getElementById('enviarPregunta').style.display = 'inline-block';
    document.getElementById('escucharRespuesta').style.display = 'inline-block';
    containerPreguntas.append(botonPreguntaAudio);
    //Obtener pregunta del servidor
    fetch('/preguntaFinal?id=' + estadoPartida.tableroId)
        .then(response => response.json())
        .then(data => {
            let nombreJugador = estadoPartida.turno == 1 ? estadoPartida.jugador1Id : estadoPartida.jugador2Id;
            name.innerHTML = 'Pregunta para ' + nombreJugador + ': ' + data.pregunta;
            name.id = 'nombrePregunta';
            containerPreguntas.append(name);
            let vectorOpciones = ['correcta', 'incorrecta1', 'incorrecta2'];
            for (let i = 0; i < 3; i++) {
                let opcion = Math.floor(Math.random() * (vectorOpciones.length - 1));
                const div = document.createElement('div');
                div.className = 'opcionPregunta'

                const input = document.createElement('input');
                input.type = 'radio';
                input.className = 'opcion';
                input.name = 'respuesta';

                const label = document.createElement('label');
                label.innerHTML = data[vectorOpciones[opcion]];
                label.id = 'opcion' + i;

                const icon = document.createElement('img');
                icon.style = 'width: 20px; height: 20px;';
                icon.src = '/s/media/sound.png';
                icon.alt = 'Audio';

                const botonEscuchar = document.createElement('button');
                botonEscuchar.className = 'audio';
                botonEscuchar.addEventListener('click', () => decir(label.innerHTML));

                botonEscuchar.appendChild(icon);
                div.append(input, label, botonEscuchar)
                containerPreguntas.append(div);
                vectorOpciones.splice(opcion, 1);
            }
            guardarCambios();
        });
}

//Funcion para guardar el estado de la partida
function guardarEstado() {
    const data = {
        tableroId: estadoPartida.tableroId,
        jugador1Id: estadoPartida.jugador1Id,
        jugador2Id: estadoPartida.jugador2Id,
        color1Id: estadoPartida.color1Id,
        color2Id: estadoPartida.color2Id,
        turno: estadoPartida.turno,
        lleno: estadoPartida.lleno,
        posicion1: estadoPartida.posicion1,
        posicion2: estadoPartida.posicion2,
        indicesPreguntas: estadoPartida.indicesPreguntas
    };
    //Se envia el estado de la partida al servidor
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (estadoPartida.turno != idJugador)
        downloadBoard();
}

//Funcion para actualizar los cambios del tablero
function guardarCambios() {
    const data = {
        tableroId: estadoPartida.tableroId,
        turno: estadoPartida.turno,
        posicion1: estadoPartida.posicion1,
        posicion2: estadoPartida.posicion2,
        nombrePregunta: document.getElementById('nombrePregunta').innerHTML,
        ganador: estadoPartida.ganador,
    };
    if (document.getElementById('valorRespuesta') != null)
        data.valorRespuesta = document.getElementById('valorRespuesta').innerHTML;
    fetch('/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (estadoPartida.turno != idJugador && !estadoPartida.ganador)
        downloadBoard();
}

//Funcion que cuando se une el jugador 2 a la partida se actualiza el HTML
function actualizarJugador() {
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tableroId: estadoPartida.tableroId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.jugador2Id !== null) {
                Object.assign(estadoPartida, data);
                document.getElementById('jugador2').style.borderColor = estadoPartida.color2Id;
                document.getElementById('jugador2').style.boxShadow = `0 15px 15px -15px ${estadoPartida.color2Id}`;
                document.getElementById('nombre2').innerHTML = 'JUGADOR 2: ' + data.jugador2Id;
                document.getElementById('botonTirarJugador1').removeAttribute('disabled');
                document.getElementById('botonTirarJugador' + idJugador).removeAttribute('disabled');
            }
        })
}

//Funcion que se ejecuta mientras se este esperando al jugador 2
const esperandoJugador = () => {
    if (estadoPartida.turno != idJugador) {
        actualizarJugador()
        setTimeout(esperandoJugador, 1000);
    }
    else {
        document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: 1';
        document.getElementById('entrada').style.background = `linear-gradient(90deg,${estadoPartida.color1Id} 50%,${estadoPartida.color2Id} 50%)`;
    }
}

//Funcion que se ejecuta cuando hay un ganador
const declararGanador = ganador => {
    const botonEnviar = document.getElementById('enviarPregunta');
    botonEnviar.setAttribute('disabled', '');
    botonPreguntaAudio.setAttribute('disabled', '');
    const nombreGanador = ganador == 1 ? estadoPartida.jugador1Id : estadoPartida.jugador2Id;
    const colorGanador = ganador == 1 ? estadoPartida.color1Id : estadoPartida.color2Id;
    const texto = document.getElementById('turnoJugador');
    texto.innerHTML = 'El jugador ' + ganador + ': ' + nombreGanador + ' ha ganado la partida!';
    texto.style.webkitTextStroke = '0.5px black';
    texto.style.color = colorGanador;
    const link = document.createElement('a');
    link.href = 'http://localhost:3000';
    link.textContent = 'Volver al lobby';
    const txt = document.getElementById('turnoActual');
    txt.appendChild(link);
}

//Funcion para marcar el casillero en el tablero
const marcarCasillero = (posicionA, posicionB, salida, colorA, colorB) => { 
    if (posicionA === 0) {
        let entrada = document.getElementById('entrada');
        entrada.removeAttribute('style');
        entrada.style.backgroundColor = posicionB === 0 ? colorB : 'white';
    } else
        document.getElementById(posicionA).style.backgroundColor = 'white';
    let marcar = salida >= 21 ? 'salida' : salida;
    document.getElementById(marcar).style.backgroundColor = colorA;
}

//Funcion que se encarga de actualizar el tablero constantemente
function actualizarTablero() { 
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tableroId: estadoPartida.tableroId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.ganador)
                declararGanador(data.ganador);
            const containerPreguntas = document.getElementById('container-preguntas');
            let namePreg = document.getElementById('nombrePregunta');
            document.getElementById('enviarPregunta').setAttribute('disabled', '');
            document.getElementById('escucharRespuesta').setAttribute('disabled', '');
            if (namePreg === null) {
                namePreg = document.createElement('p');
                namePreg.id = 'nombrePregunta';
                containerPreguntas.append(namePreg);
            }
            namePreg.innerHTML = data.nombrePregunta;
            let valorR = document.getElementById('valorRespuesta');
            if (valorR === null) {
                valorR = document.createElement('p');
                valorR.id = 'valorRespuesta';
                containerPreguntas.append(valorR);
            }
            valorR.innerHTML = data.valorRespuesta;
            if (valorR.innerHTML !== '') {
                let contenido = valorR.innerHTML;
                let partes = contenido.split(':');
                let texto = partes[1].trim();
                valorR.className = texto === 'Incorrecta' ? 'incorrecta' : 'correcta';
            }
            if (data.posicion1 != estadoPartida.posicion1)
                marcarCasillero(estadoPartida.posicion1, estadoPartida.posicion2, data.posicion1, data.color1Id, estadoPartida.color2Id);
            else if (data.posicion2 != estadoPartida.posicion2)
                marcarCasillero(estadoPartida.posicion2, estadoPartida.posicion1, data.posicion2, data.color2Id, estadoPartida.color1Id);
            Object.assign(estadoPartida, data);
        })
}

//Funcion que se encarga de descargar el tablero
const downloadBoard = () => {
    if (estadoPartida.ganador)
        return;
    //Solo actualiza el tablero si no es el turno del jugador
    if (estadoPartida.turno != idJugador) {
        actualizarTablero();
        setTimeout(downloadBoard, 3000);
    }
    else {
        //Si es el turno del jugador, se actualiza el tablero y se habilita el boton de tirar dado
        cambiarBotones();
        document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: ' + estadoPartida.turno;
    }
}

//Funcion para verificar si es correcta o no la respuesta elegida
function verificarRespuesta(seleccionado) {
    let p = document.createElement('p');
    p.id = 'valorRespuesta';
    let contenido = document.getElementById('nombrePregunta').innerHTML;
    let pregunta = contenido.substring(contenido.indexOf('¿'));
    const data = {
        nombrePregunta: pregunta,
        seleccionada: seleccionado,
        id: estadoPartida.tableroId
    }
    fetch('/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            let destino1 = estadoPartida.posicion1 + numeroFinal;
            let destino2 = estadoPartida.posicion2 + numeroFinal;
            let posicion = estadoPartida.turno == 1 ? estadoPartida.posicion1 : estadoPartida.posicion2;
            let destino = estadoPartida.turno == 1 ? destino1 : destino2;
            let colorJugador = estadoPartida.turno == 1 ? estadoPartida.color1Id : estadoPartida.color2Id;
            let casillero = destino >= 21 ? document.getElementById('salida') : document.getElementById(destino);
            if (data == 'Correcta') {
                p.innerHTML = 'Respuesta jugador ' + estadoPartida.turno + ': Correcta';
                p.className = 'correcta';
                casillero.style.border = '1px solid';
                casillero.style.backgroundColor = colorJugador;
                if (posicion === 0) {
                    let inicio = document.getElementById('entrada');
                    inicio.removeAttribute('style');
                    if (estadoPartida.turno === 1)
                        estadoPartida.posicion2 === 0 ? inicio.style.backgroundColor = estadoPartida.color2Id : inicio.style.backgroundColor = 'white';
                    else
                        estadoPartida.posicion1 === 0 ? inicio.style.backgroundColor = estadoPartida.color1Id : inicio.style.backgroundColor = 'white';
                }
                else
                    document.getElementById(posicion).removeAttribute('style');
                estadoPartida.turno == 1 ? estadoPartida.posicion1 = destino : estadoPartida.posicion2 = destino;
                posicion = destino;
            }
            else {
                p.innerHTML = 'Respuesta jugador ' + estadoPartida.turno + ': Incorrecta';
                p.className = 'incorrecta';
                casillero.removeAttribute('style');
            }
            document.getElementById('container-preguntas').append(p);
            //Se cambia el turno del jugador
            estadoPartida.turno == 1 ? estadoPartida.turno++ : estadoPartida.turno--;
            if (posicion >= 21) {
                estadoPartida.ganador = idJugador;
                declararGanador(estadoPartida.ganador);
            }
            else {
                document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: ' + estadoPartida.turno;
                setTimeout(eliminarAnterior, 3500);
            }
            guardarCambios();
        })
}

//Funcion que invoca la opcion elegida por el jugador
const opcionElegida = () => {
    const opciones = document.querySelectorAll('.opcion');
    let seleccionado;
    for (let i = 0; i < 3; i++) {
        if (opciones[i].checked) {
            seleccionado = document.getElementById('opcion' + i).innerHTML;
            break;
        }
    }
    verificarRespuesta(seleccionado);
}

//Funcion que se ejecuta al cargar la pagina
function iniciar() {
    document.getElementById('idPartida').innerHTML = 'ID de la partida: ' + id;
    document.getElementById('enviarPregunta').addEventListener('click', () => opcionElegida());
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tableroId: id })
    })
        .then(response => response.json())
        .then(data => {
            Object.assign(estadoPartida, data);
            //Se asignan los ids a los jugadores
            if (data.jugador1Id && !data.jugador2Id) {
                idJugador = 1;
                boton1.addEventListener('click', mostrarNumerosRapidos);
                esperandoJugador();
            }
            else if (data.jugador2Id) {
                idJugador = 2;
                boton2.addEventListener('click', mostrarNumerosRapidos);
                estadoPartida.lleno = true;
                estadoPartida.turno = 1;
                document.getElementById('turnoJugador').innerHTML = 'Turno del jugador: ' + estadoPartida.turno;
                document.getElementById('entrada').style.background = `linear-gradient(90deg,${estadoPartida.color1Id} 50%,${estadoPartida.color2Id} 50%)`;
                guardarEstado();
            }
        });
}

window.alert = function(message, timeout = null) {
    const alert = document.createElement('div');
    const alertButton = document.createElement('button');
    alertButton.innerText = 'Aceptar';
    alert.classList.add('alert');
    alert.id = 'alerta';
    alertButton.id = 'alertaBoton';
    alert.innerHTML = `<span style = "padding: 10px">${message}</span>`;
    alert.appendChild(alertButton);
    alertButton.addEventListener('click', (e) => alert.remove());
    if(timeout != null) {
        setTimeout(() => {
            if(alert) alert.remove();
        }, Number(timeout));
    }
    document.body.appendChild(alert);
}

const sendPing = () => {
    fetch('/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: idJugador, gameId: estadoPartida.tableroId })
    }).catch(err => console.error('Error sending ping:', err));
}

setInterval(sendPing, 1000);

let ok = false;
const checkGameStatus = () => {
    fetch(`/game-status/${estadoPartida.tableroId}`)
        .then(response => response.json())
        .then(data => {
            if ((data.status === 'win_by_disconnect')&&(!ok)){
                ok = true;
                alert('Has Ganado, tu oponente se ha desconectado', 5000);
                declararGanador(idJugador);
                estadoPartida.ganador = idJugador;
                guardarCambios();
            }
        })
        .catch(err => console.error('Error checking game status:', err));
}

setInterval(checkGameStatus, 3000);