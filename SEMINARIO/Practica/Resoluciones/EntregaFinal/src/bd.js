import fs from 'fs';
import crypto from 'crypto';

let estadoInicial = {
    tableroId: null,
    jugador1Id: null,
    jugador2Id: null,
    color1Id: null,
    color2Id: null,
    turno: 2,
    lleno: false,
    posicion1: 0,
    posicion2: 0,
    nombrePregunta: null,
    valorRespuesta: null,
    ganador: null,
    indicesPreguntas: []
}

//En este json se guardan los datos de las partidas
const tablero_DB = './tablero.json';

//Se generan los indices de las preguntas
for (let i = 0; i < 100; i++)
    estadoInicial.indicesPreguntas[i] = i;

//Funcion para generar un ID
const generateId = () => {
    return crypto.randomBytes(8).toString('hex');
}

//Funcion para guardar los cambios en la base de datos
const guardarCambios = tablero => {
    let partidas = JSON.parse(fs.readFileSync(tablero_DB));
    let i = partidas.findIndex(p => p.tableroId == tablero.tableroId);
    if (i == -1)
        partidas.push(tablero);
    else {
        //Se asignan los valores del tablero a la partida si estos valores no son nulos o indefinidos
        partidas[i].tableroId = tablero.tableroId ?? partidas[i].tableroId
        partidas[i].jugador1Id = tablero.jugador1Id ?? partidas[i].jugador1Id;
        partidas[i].jugador2Id = tablero.jugador2Id ?? partidas[i].jugador2Id;
        partidas[i].color1Id = tablero.color1Id ?? partidas[i].color1Id;
        partidas[i].color2Id = tablero.color2Id ?? partidas[i].color2Id;
        partidas[i].turno = tablero.turno ?? partidas[i].turno;
        partidas[i].lleno = tablero.lleno ?? partidas[i].lleno;
        partidas[i].posicion1 = tablero.posicion1 ?? partidas[i].posicion1;
        partidas[i].posicion2 = tablero.posicion2 ?? partidas[i].posicion2;
        partidas[i].nombrePregunta = tablero.nombrePregunta ?? partidas[i].nombrePregunta;
        partidas[i].valorRespuesta = tablero.valorRespuesta ?? partidas[i].valorRespuesta;
        partidas[i].ganador = tablero.ganador ?? partidas[i].ganador;
        partidas[i].indicesPreguntas = tablero.indicesPreguntas ?? partidas[i].indicesPreguntas;
    }
    fs.writeFileSync(tablero_DB, JSON.stringify(partidas, null, 2)); //Se guarda el tablero en la base de datos
}

//Funciones para crear y unir partidas
const creandoPartida = datos => {
    if (!fs.existsSync(tablero_DB))
        fs.writeFileSync(tablero_DB, JSON.stringify([]));
    let partida = {};
    //Se asignan los valores iniciales a la partida
    Object.assign(partida, estadoInicial);
    partida.tableroId = generateId();
    partida.color1Id = datos.color;
    partida.jugador1Id = datos.nombre;
    guardarCambios(partida);
    return partida;
}

//Funcion para unirse a una partida
const uniendoPartida = datos => {
    //Se busca la partida en la base de datos y si se encuentra, se asignan los valores del jugador 2
    let partida = JSON.parse(fs.readFileSync(tablero_DB)).find(p => p.tableroId == datos.id);
    if (partida) {
        if (!partida.jugador2Id) {
            partida.jugador2Id = datos.nombre;
            if (partida.color1Id == datos.color)
                partida.color2Id = 'yellow';
            else
                partida.color2Id = datos.color;
            guardarCambios(partida);
        }
        return partida;
    }
    return undefined;
}

//Funcion para leer el estado de la partida
const leerEstado = id => {
    let estado = JSON.parse(fs.readFileSync(tablero_DB)).find(p => p.tableroId == id);
    if (estado)
        return {
            tableroId: estado.tableroId,
            jugador1Id: estado.jugador1Id,
            jugador2Id: estado.jugador2Id,
            color1Id: estado.color1Id,
            color2Id: estado.color2Id,
            turno: estado.turno,
            lleno: estado.lleno,
            posicion1: estado.posicion1,
            posicion2: estado.posicion2,
            nombrePregunta: estado.nombrePregunta,
            valorRespuesta: estado.valorRespuesta,
            ganador: estado.ganador,
            indicesPreguntas: estado.indicesPreguntas
        };
    return undefined;
}

export { creandoPartida, uniendoPartida, leerEstado, guardarCambios }