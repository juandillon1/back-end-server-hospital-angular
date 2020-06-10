// Requires
var express = require('express');
var mongoose = require('mongoose')


// Inicializar variables
var app = express();


// conexión a BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
    })
    .catch((err) => {
        console.log(err);
    })

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición OK'
    });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server corre en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});