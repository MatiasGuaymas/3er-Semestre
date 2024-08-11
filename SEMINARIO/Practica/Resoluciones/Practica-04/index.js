const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(cors());

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));

app.get('/insertarVehiculos', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});


app.get('/', (req, res) => {
    res.send('TP JS');
});

app.get('/vehiculos', (req, res) => {
    const filePath = path.join(__dirname, 'vehiculos.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).send('Error al leer el archivo');
            return;
        }
        res.send(JSON.parse(data));
    });
});

app.get('/DistanciaTotalRecorrida', (req, res) => {
    const filePath = path.join(__dirname, 'vehiculos.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).send('Error al leer el archivo');
            return;
        }

        const jsonData = JSON.parse(data);
        const totalDistancias = jsonData.reduce((sum, item) => sum + item.distance, 0);

        res.json({ totalDistancias })
    });
});

app.get('/DistanciaPromedio', (req, res) => {
    const filePath = path.join(__dirname, 'vehiculos.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo', err);
            res.status(500).send('Error al leer el archivo');
            return;
        }

        const jsonData = JSON.parse(data);
        const cantElem = [];
        const sumElem = [];
        for (let i = 0; i < 3; i++) {
            cantElem[i] = 0;
            sumElem[i] = 0;
        }
        jsonData.forEach(item => {
            const type = item.type;
            if (item.type === "automóvil") {
                cantElem[0]++;
                sumElem[0] += item.distance;
            }
            else {
                if (item.type === "bicicleta") {
                    cantElem[1]++;
                    sumElem[1] += item.distance;
                }
                else
                    cantElem[2]++;
                sumElem[2] += item.distance;
            }
        })
        const resultado = []
        for (let i = 0; i < cantElem.length; i++) {
            resultado[i] = sumElem[i] / cantElem[i];
        }

        const resultadoFinal = resultado.map(num => num.toFixed(2));
        res.json(resultadoFinal);
    })
})

app.get('/MayorConsumo', (req, res) => {
    const filePath = path.join(__dirname, 'vehiculos.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).send('Error al leer el archivo');
            return;
        }

        const jsonData = JSON.parse(data);
        let maximaConsumision = null;
        let maximoVehiculo = null;

        jsonData.forEach(vehiculo => {
            if (vehiculo.fuelConsumption && vehiculo.distance) {
                const consumo = vehiculo.fuelConsumption;
                const distancia = vehiculo.distance;
                const consumoPorKm = consumo / distancia;

                if (consumoPorKm > maximaConsumision) {
                    maximaConsumision = consumoPorKm;
                    maximoVehiculo = vehiculo;
                }
            }
        });
        res.json(maximoVehiculo);
    });
});

app.get('/MayorDistancia', (req, res) => {
    const filePath = path.join(__dirname, 'vehiculos.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            res.status(500).send('Error al leer el archivo');
            return;
        }

        const vehiculos = JSON.parse(data);
        let max = -1;
        let maxVehiculo = null;

        vehiculos.forEach(vehiculo => {
            if (vehiculo.distance > max) {
                max = vehiculo.distance;
                maxVehiculo = vehiculo;
            }
        });

        if (maxVehiculo) {
            res.json(maxVehiculo);
        }
    });
});

app.options('/insertarVehiculo', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

app.post('/insertarVehiculo', (req, res) => {
    const newVehiculo = req.body;
    const filePath = path.join(__dirname, 'vehiculos.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err){
            console.error('Error al Leer', err);
            res.status(500).send('Error al leer el archivo');
            return
        }

        try{
            const jsonData = JSON.parse(data);

            jsonData.push(newVehiculo);

            const jsonAct = JSON.stringify(jsonData, null, 2);

            fs.writeFile(filePath, jsonAct, 'utf-8', (err) => {
                if (err) {
                    console.error('Error al escribir el archivo:', err);
                    res.status(500).send('Error al escribir el archivo');
                    return;
                }

                res.status(200).send('Vehiculo Agregado');
            })
        }
        catch(error){
            console.error("Error al parsear el JSON: ", error);
            res.status(500).send("Error al parsear el JSON");
        }
    })
})



app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});