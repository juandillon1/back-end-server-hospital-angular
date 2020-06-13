var express = require('express');
var app = express();

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

var Usuario = require('../models/Usuario');



//--------------------------------------------------------
// OBTENER TODOS LOS USUARIOS
//--------------------------------------------------------
app.get('/', (req, res, next) => {

    Usuario.find({},
            'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            });

});



// Acá empiezan las validaciones de token


//--------------------------------------------------------
// Actualizar Usuario
//--------------------------------------------------------
// put o patch se usan para actualizar usuarios

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    // Obtiene el id q viene cómo parámetro
    var id = req.params.id;

    Usuario.findById(id, (err, usuario) => {
        var body = req.body

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        // Sólo se actualizan estos 3 datos por acá
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.pass = ':)';
            res.status(200).json({
                ok: true,
                // usuario = nombre que retorna, usuarioGuardado = Como se llama en BD
                usuario: usuarioGuardado
            });

        });


    });

});

//--------------------------------------------------------
// Crear Nuevo Usuario
//--------------------------------------------------------

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        pass: bcrypt.hashSync(body.pass, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        // 201 = Usuario Creado
        res.status(201).json({
            ok: true,
            // usuario = nombre que retorna, usuarioGuardado = Como se llama en BD
            usuario: usuarioGuardado,
            // El usuario token es el que manda la solicitud
            usuarioToken: req.usuario
        });


    });


})


//--------------------------------------------------------
// Borrar Usuario por ID
//--------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con esa Id: ' + id,
                errors: { message: 'No existe un usuario con esa Id: ' + id }
            });
        }
        // 201 = Usuario Creado
        res.status(200).json({
            ok: true,
            // usuario = nombre que retorna, usuarioGuardado = Como se llama en BD
            usuario: usuarioBorrado
        });
    });
})



module.exports = app;