const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario'); 

const validarJWT = (req, res, next) =>  {

    // Leer el token de los headers que viene en la request -> req
    const token = req.header('x-token');

    console.log(token);

    // tenemos que verificar el token
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        })
    }

    try {

        const { uid } = jwt.verify( token, process.env.JWT_SECRET );

        // si llegamos a este punto el token es correcto
        //console.log(uid);
        
        // puedo establecer info en la request
        // entonces decimos que la request va a tener un nuevo elemento
        // el uid por ejemplo. Esto solo funciona el token es correcto
        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        }); 
    }
}

const validarADMIN_ROLE = async (req, res, next) => {

    const uid = req.uid;
    
    try {

        const usuarioDB = await Usuario.findById(uid); // esperamos a que esto se resuelva

        if (!usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            })
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
        });
    }

        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const validarADMIN_ROLE_o_MismoUsuario = async (req, res, next) => {

    const uid = req.uid;
    const id = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(uid); // esperamos a que esto se resuelva

        if (!usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            })
        }

        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
            
            next()
        
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
        });
    }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}