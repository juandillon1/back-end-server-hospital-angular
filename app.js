// Requires
var express = require('express');
var mongoose = require('mongoose')
    // sirve para parsear un body
var bodyParser = require('body-parser')

// Inicializar variables
var app = express();



// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


// conexión a BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
    })
    .catch((err) => {
        console.log(err);
    })

// Rutas
app.use('/Usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server corre en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});