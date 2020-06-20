var express = require('express');
var app = express();

var Hospital = require('../models/Hospital');
var Medico = require('../models/Medico');
var Usuario = require('../models/Usuario');

//--------------------------------------------------------
// Búsqueda por colección
//--------------------------------------------------------
app.get('/coleccion/:tabla/:busqueda', (req, resp) => {
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    switch (tabla) {
        case 'hospital':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medico':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'usuario':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        default:
            return resp.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda son usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla no válida' }
            });
            break;
    }
    promesa.then(data => {
        return resp.status(200).json({
            ok: true,
            // Con los [] busca el contenido de la variable
            [tabla]: data
        });
    })

})


//--------------------------------------------------------
// Búsqueda General
//--------------------------------------------------------
app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    // Hay que crear una expresión regular para que aparezcan la búsqueda por un like
    var regex = new RegExp(busqueda, 'i');

    // Retorna un array de promesas, si da bien, se procede al then, sino al catch
    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });


});

function buscarHospitales(busqueda, regex) {
    //se obtiene la info a través de una promesa
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec(
                (err, hospitales) => {
                    if (err) {
                        reject('Error al cargar hospitales', err);
                    } else {
                        resolve(hospitales);
                    }
                });
    });
}

function buscarMedicos(busqueda, regex) {
    //se obtiene la info a través de una promesa
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre email')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {
    //se obtiene la info a través de una promesa
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            // el OR sirve para buscar en dos o más columnas de la tabla
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;