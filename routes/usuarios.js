/*
    Ruta: /api/usuarios

    ! instalamos npm i express-validator

    los middlewares son funciones que siempre se ejecutan antes de otras
    verifican que la informacion venga como queremos

    ! usuamos un middleware personalizado llamado validarCamposs
*/

const { Router } = require('express');

const { check } = require('express-validator');

const { validarCampos } = require(  '../middlewares/validar-campos')

const { getUsuarios , crearUsuario , actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { 
    validarJWT, 
    validarADMIN_ROLE, 
    validarADMIN_ROLE_o_MismoUsuario 
} = require('../middlewares/validar-jwt');


const router = Router();

router.get( '/', validarJWT, getUsuarios );

// implementamos varios middlewares
router.post( 
    '/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contraseña es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos, //! siempre debe ser el ultimo despues de los checks de crear los errores
    
    ], 
    crearUsuario ); // el segundo argumento es el middleware y el tercero el controlador

    router.put( '/:id', 
        [
            validarJWT,
            validarADMIN_ROLE_o_MismoUsuario,
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            check('email', 'El email es obligatorio').isEmail(),
            check('role', 'El role es obligatorio').not().isEmpty(),
            validarCampos    
        ],
        actualizarUsuario 
    );

    router.delete( '/:id', 
        [validarJWT, validarADMIN_ROLE],
        borrarUsuario 
    );

module.exports = router;