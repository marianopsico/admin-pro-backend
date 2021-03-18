/**
 * Hospitales
 * ruta: './routes/hospitales'
 */



const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
} = require('../controllers/hospitales')

const router = Router();

router.get( '/', validarJWT, getHospitales );

// implementamos varios middlewares
router.post( 
    '/', 
    [
        // al grabar el id del usuario con JWT estamos seguros que es un id valido de mongo y no hay que validar
        validarJWT,
        check('nombre', 'El nombre del Hospital es necesario').not().isEmpty(),
        validarCampos
    ], 
    crearHospital ); // el segundo argumento es el middleware y el tercero el controlador

    router.put( '/:id', 
        [
            validarJWT,
            check('nombre', 'El nombre del Hospital es necesario').not().isEmpty(),
            validarCampos
        ],
        actualizarHospital 
    );

    router.delete( '/:id', 
        validarJWT,
        borrarHospital 
    );

module.exports = router;