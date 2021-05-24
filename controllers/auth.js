const { response } = require('express');
const Usuario = require('../models/usuario');
// para encriptar las contraseñas usamos npm i encryptjs
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res) => {
    
    const { email, password } = req.body;

    try {

        //! podriamos demorar 1 segundo la respueta, apr aun usario no es nada y si alguien esta bordardeando el login lo destruye
        //buscamos el usaurio por el email
        const usuarioDB = await Usuario.findOne( { email }); 

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

const googleSignIn = async( req, res = response ) => {

    // recibimos el token
    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );

        // tenemos que verificar si existe el usuario
        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if (!usuarioDB) {
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@', // con esto no se puede logear
                img: picture,
                google: true
            })
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true; // marcamos que es un usuario de Googles
            // usuario.password = '@@@'; // si no le cambiamos la contraseña 
            // el usuario tiene los dos metodos de autenticacion, 
            // si se cambia la contraseña el usuario pierde la conexion normal
        }

        // Guardar en DB
        await usuario.save();

        // generar un token
        // si es nuevo este usuario tiene el uid
        const token = await generarJWT( usuario.id); // mongoose va a saber que queremos hacer referencia al id

        res.json({
            ok: true,
            token // enviamos el token
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto',
        });
    }
}

const renewToken = async( req, res = response ) => {

    // tomamos el uid del usuario que viene en la request
    const uid = req.uid;

    // si llegamos aqui es porque tenemos el uid
    // generar un token
    const token = await generarJWT( uid ); // mongoose va a saber que queremos hacer referencia al id

    // Obtener el usuario por el UID
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        //! regresamos un nuevo Token, es el que el usuario debe grabar en el localStorage y proveerlo despues en las peticiones
        token, // regresamos el nuevo token
        usuario
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
};