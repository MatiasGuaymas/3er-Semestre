import express from 'express';
import { preguntaRandom, cargar, numeroRandom, join, joinExisting, joining, update, save, verificar, ping, gameStatus } from './controllers/principal.js';
var routerServer = express.Router();

routerServer.get('/', cargar);
routerServer.post('/', cargar);

routerServer.post('/partida', join);
routerServer.get('/partida/:tableroId', joining);
routerServer.post('/join/:tableroId', joinExisting);
routerServer.post('/update', update);
routerServer.post('/save', save);
routerServer.post('/verify', verificar);
routerServer.get('/numeroFinal', numeroRandom);
routerServer.get('/preguntaFinal', preguntaRandom);
routerServer.post('/ping', ping); 
routerServer.get('/game-status/:tableroId', gameStatus);

export default routerServer;