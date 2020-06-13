var mongoose = require('mongoose');

var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// Se crea un objeto con los roles válidos
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

// Trae el esquema de la BD
var usuarioSchema = new Schema({
    // Define el tipo de dato, si es requerido o no y el mensaje cuando falla la validación
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El correo es requerido'] },
    pass: { type: String, required: [true, 'La contraseña es requerida'] },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }

});

// Librería unique validator de mongoose, sirve para manejar errores, se envia en el schema cómo un plugin
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

// Exporta el esquema para que se pueda usar en otro lado, 'Usuario' puede ser cualquier nombre
module.exports = mongoose.model('Usuario', usuarioSchema);