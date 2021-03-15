const { Schema, model } = require('mongoose');

const MedicoSchema = Schema({
    nombre: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
});

MedicoSchema.method('toJSON', function() {
    // extraemos la version, el id, el password y los objetos en la instancia creada
    const { __v, ...object } = this.toObject(); // obtenemos la instancia del objeto actual. esto es mongoose
    return object;
})

// implementamos el usuario
module.exports = model( 'Medico', MedicoSchema ); //! por defecto mongoose le pone el plural