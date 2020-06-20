var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');


app.get('/:tipo/:imagen', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.imagen;
    // DirName obtiene la ruta de dónde se encuentra en el momento
    var pathimg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathimg)) {
        res.sendFile(pathimg);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }
});

module.exports = app;