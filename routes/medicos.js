
/**
 * Medicos
 * ruta: './routes/medico'
 */



const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
} = require('../controllers/medicos')

const router = Router();

router.get( '/', validarJWT, getMedicos );

// implementamos varios middlewares
router.post( 
    '/', 
    [   
        validarJWT,
        check('nombre', 'El nombre del Médico es necesario').not().isEmpty(),
        check('hospital', 'El hospital id debe ser valido').isMongoId(),
        validarCampos
    ], 
    crearMedico ); // el segundo argumento es el middleware y el tercero el controlador

    router.put( '/:id', 
        [
            validarJWT,
            check('nombre', 'El nombre del Médico es necesario').not().isEmpty(),
            check('hospital', 'El hospital id debe ser valido').isMongoId(),
            validarCampos
        ],
        actualizarMedico 
    );

    router.delete( '/:id', 
        validarJWT,
        borrarMedico 
    );

    router.get( '/:id', 
        validarJWT,
        getMedicoById
    );

module.exports = router;





