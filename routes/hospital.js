var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');

var Hospital = require('../models/Hospital');

//--------------------------------------------------------
// Obtener Todos los Hospitales
//--------------------------------------------------------

app.get('/', (req, res) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', ['nombre', 'email'])
        .exec(
            (err, Hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }

                Hospital.countDocuments({}, (err, conteo) => {
                    return res.status(200).json({
                        ok: true,
                        mensaje: Hospitales,
                        total: conteo
                    });
                });
            }
        );
});

//--------------------------------------------------------
// Actualizar Hospital
//--------------------------------------------------------

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findById(id, (err, hospital) => {
        var body = req.body;
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospitales',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }
        hospital.nombre = body.nombre;
        //hospital.img = body.img;
        hospital.usuario = req.usuario._id;
        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                // usuario = nombre que retorna, usuarioGuardado = Como se llama en BD
                hospital: hospitalGuardado
            });
        });

    });
});

//--------------------------------------------------------
// Crear Nuevo Hospital
//--------------------------------------------------------

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            // usuario = nombre que retorna, usuarioGuardado = Como se llama en BD
            hospital: hospitalGuardado,
            // El usuario token es el que manda la solicitud
        });

    });
});

//--------------------------------------------------------
// Borrar Hospital por ID
//--------------------------------------------------------

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con esa Id: ' + id,
                errors: { message: 'No existe un hospital con esa Id: ' + id }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });

});

module.exports = app;