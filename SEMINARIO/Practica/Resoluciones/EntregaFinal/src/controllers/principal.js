import fs from 'fs';
import { creandoPartida, leerEstado, uniendoPartida, guardarCambios } from "../bd.js";

const preguntasJuego = JSON.parse(fs.readFileSync('src/data/preguntas.json', 'utf8'));

//Funcion que devuelve una pregunta al azar
const preguntaRandom = (req, res) => {
    let partida = leerEstado(req.query.id);
    let randomQuestion = Math.floor(Math.random() * partida.indicesPreguntas.length);
    res.json(preguntasJuego[partida.indicesPreguntas[randomQuestion]]);
}

const cargar = (req, res) => {
    res.render('lobby', {
        nombres: req.body.jugador || undefined
    });
};

const numeroRandom = (req, res) => {
    res.json({
        numero: Math.floor(Math.random() * 6) + 1
    });
}

const join = (req, res) => {
    let partida = creandoPartida(req.body);
    res.redirect('/partida/' + partida.tableroId);
}

const joining = (req, res) => {
    let partida = leerEstado(req.params.tableroId);
    if (partida) {
        res.render('tablero', {
            nombre1: partida.jugador1Id,
            nombre2: partida.jugador2Id,
            color1: partida.color1Id,
            color2: partida.color2Id
        })
    }
}

const joinExisting = (req, res) => {
    let partida = uniendoPartida(req.body);
    if (!partida) {
        res.send('Tablero desconocido');
        return;
    }
    if (partida.lleno) {
        res.send('Partida llena');
        return;
    }
    res.redirect('/partida/' + partida.tableroId);
}

const update = (req, res) => {
    let estado = leerEstado(req.body.tableroId);
    res.send(estado);
}

const save = (req, res) => {
    guardarCambios(req.body);
    res.send('ok');
}

const verificar = (req, res) => {
    let namePregunta = req.body.nombrePregunta; 
    let encontrada = preguntasJuego.find(data => data.pregunta == namePregunta);
    if (encontrada.correcta == req.body.seleccionada) {
        let partida = leerEstado(req.body.id);
        //Una vez que se responde correctamente, se elimina la pregunta de la lista de preguntas para evitar repetidos
        partida.indicesPreguntas.splice(partida.indicesPreguntas.findIndex(x => x === (encontrada.id - 1)), 1);
        guardarCambios(partida);
        res.json('Correcta');
    }
    else
        res.json('Incorrecta');
}

const jugadores = {};

const ping = (req, res) => {
    const { playerId, gameId } = req.body;
    if (!jugadores[gameId]) jugadores[gameId] = {};
    jugadores[gameId][playerId] = Date.now();
    res.json({ mensaje: 'pong' });
};

const gameStatus = (req, res) => {
    const { tableroId } = req.params;
    const partida = leerEstado(tableroId);
    if (!partida) {
        res.json({ status: 'unknown_game' });
        return;
    }

    const tiempoActual = Date.now();
    const jugador1UltimoPing = jugadores[tableroId] ? jugadores[tableroId][1] : null;
    const jugador2UltimoPing = jugadores[tableroId] ? jugadores[tableroId][2] : null;
    const disconnectTimeout = 10000; 

    if (jugador1UltimoPing && tiempoActual - jugador1UltimoPing > disconnectTimeout) {
        res.json({ status: 'win_by_disconnect', winner: 2 });
        return;
    }
    if (jugador2UltimoPing && tiempoActual - jugador2UltimoPing > disconnectTimeout) {
        res.json({ status: 'win_by_disconnect', winner: 1 });
        return;
    }

    res.json({ status: 'ongoing' });
};

export { cargar, numeroRandom, join, joinExisting, update, save, joining, preguntaRandom, verificar, ping, gameStatus};