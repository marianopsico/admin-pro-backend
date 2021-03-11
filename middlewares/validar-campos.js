const { response } = require('express');
const { validationResult } = require('express-validator');

// al next lo llamamos si el middleware pasa
const validarCampos = (req, res = response, next ) => {
    
    // esto crea un arreglo de errores generados en la ruta
    const errores = validationResult( req ); 
    
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    // si se llego a este punto puedo llamar al next
    next();
}

// si no lo exporto no lo puedo usar en otro lado
module.exports = {
    validarCampos
}