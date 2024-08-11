import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routerServer from './rutas.js';

var app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Aplicamos EJS
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/s/', express.static(path.join(__dirname, 'public-static')));
app.use('/', routerServer);

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

export default app;