const { response } = require('express');
const usuario = require('../models/usuario');
// para encriptar las contraseñas usamos npm i encryptjs
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login = async( req, res) => {
    
    const { email, password } = req.body;

    try {

        //! podriamos demorar 1 segundo la respueta, apr aun usario no es nada y si alguien esta bordardeando el login lo destruye
        //buscamos el usaurio por el email
        const usuarioDB = await usuario.findOne( { email }); 

        // verificamos email
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // si llegamos aca entonces verificamos contraseña
        // ! esto regresa un true si hacen match
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'contraseña no valida'
            }) 
        }

        // generar un token
        const token = await generarJWT( usuarioDB.id); // mongoose va a saber que queremos hacer referencia al id

        res.json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }

}

module.exports = {
    login
};