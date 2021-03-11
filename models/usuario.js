const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
});

UsuarioSchema.method('toJSON', function() {
    // extraemos la version, el id, el password y los objetos en la instancia creada
    const { __v, _id, password, ...object } = this.toObject(); // obtenemos la instancia del objeto actual. esto es mongoose
    object.uid = _id; // definimos el uid esto es solo a efectos visuales NO afecta a la DB
    return object;
})

// implementamos el usuario
module.exports = model( 'Usuario', UsuarioSchema ); //! por defecto mongoose le pone el plural