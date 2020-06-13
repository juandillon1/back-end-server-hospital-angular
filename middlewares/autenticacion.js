const jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//--------------------------------------------------------
// Verificar Token
//--------------------------------------------------------

exports.verificaToken = function(req, res, next) {
    //Obtiene el token
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            //401-forbidden
            return res.status(401).json({
                ok: false,
                mensaje: 'Token inválido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        // next dice que se puede seguir la ejecución
        next();

    });

}