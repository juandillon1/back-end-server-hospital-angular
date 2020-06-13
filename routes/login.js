var express = require('express');
var app = express();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var Usuario = require('../models/Usuario');

app.post('/', (req, res) => {

    var body = req.body;
    // Lo de adentro del parentesis es el filtro
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales inválidas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.pass, usuarioDB.pass)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales inválidas - password',
                errors: err
            });
        }

        //Crear Token
        // Se manda el usuario DB y mandar una semilla única y fecha de expiración, la semilla sirve para validar el token
        usuarioDB.pass = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4horas


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB.id
        });
    });




});



module.exports = app;