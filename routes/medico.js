var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');

var Medico = require('../models/Medico');

//--------------------------------------------------------
// Obtener Todos los Medicos
//--------------------------------------------------------

app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', ['nombre', 'email'])
        .populate('hospital', ['nombre', 'usuario'])
        .exec(
            (err, Medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }

                Medico.countDocuments({}, (err, conteo) => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: Medicos,
                        total: conteo
                    });
                });

            }
        );
});

//--------------------------------------------------------
// Actualizar Medico
//--------------------------------------------------------

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findById(id, (err, medico) => {
        var body = req.body;
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medicos',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;
        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });

    });
});

//--------------------------------------------------------
// Crear Nuevo Medico
//--------------------------------------------------------

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            // El usuario token es el que manda la solicitud
        });

    });
});

//--------------------------------------------------------
// Borrar Medico por ID
//--------------------------------------------------------

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con esa Id: ' + id,
                errors: { message: 'No existe un medico con esa Id: ' + id }
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });

});

module.exports = app;