const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, { collection: 'hospitales' });

HospitalSchema.method('toJSON', function() {
    // extraemos la version, el id, el password y los objetos en la instancia creada
    const { __v, ...object } = this.toObject(); // obtenemos la instancia del objeto actual. esto es mongoose
    return object;
})

// implementamos el usuario
module.exports = model( 'Hospital', HospitalSchema ); //! por defecto mongoose le pone el plural