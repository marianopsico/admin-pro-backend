const { response } = require('express');
// para encriptar las contraseñas usamos npm i encryptjs
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario'); // importamos el modelo
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    // tenemos que recibir el parametro desde
    const desde = Number(req.query.desde) || 0; // si no trae el parametro que de un Cero
    // console.log(desde);


    // const usuarios = await Usuario
    //                         .find({}, 'nombre email role google' )
    //                         .skip( desde ) // que se salte los registros antes del desde
    //                         .limit( 5 ); // cuantos registros queremos desde la posicion desde
    
    // cuantos registros en la DB?
    // const total = await Usuario.count();

    //! pero si queremos ejecutar varias promesas al mismo tiempo para no generar un error
    //! esto es una coleccion de promesas
    //! extraemos usando desestructuracion [] el resultado de la primera promesa y la segunda
     const [ usuarios ,total ] = await Promise.all([
        Usuario
            .find({}, 'nombre email role google img' )
            .skip( desde ) // que se salte los registros antes del desde
            .limit( 5 ), // cuantos registros queremos desde la posicion desde
        Usuario.countDocuments()
    ]);

    
    res.json({
        ok: true,
        usuarios,
        uid: req.uid, // agregamos el uid del usuario que hizo la petición
        total
    });
}

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: "El correo ya esta registrado"
            })
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();// un numero aleatorio, usamos un has de una sola via
        usuario.password = bcrypt.hashSync( password , salt ); // el salt es un dato aleatorio

        // generar un token
        const token = await generarJWT( usuario.id); // mongoose va a saber que queremos hacer referencia al id

        // Guardar usuario
        // necesitamos esperar a que esto termine por eso el await
        await usuario.save(); //! esto hace mongoose lo graba en la DB. es una promesa

        //! con express el res.json se puede llamar una sola vez
        // solo se puede responder a res.json una sola vez
        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: "Error inesperado... revisar Logs"
        })
    }
}

const actualizarUsuario = async (req, res = response) => {
    // TODO: Validar token y si es el usuario correcto

    const uid = req.params.id;

    try {

        // si esto se encuentra existe un usuario con este id
        const usuarioDB = await Usuario.findById( uid ); 
        
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        
        // si llegamos a este punto es porque el usuario existe en la DB
        
        // Actualizaciones
        //! cuando ponemos los tres puntos podemos extraer cosas
        const { password, google, email, ...campos} = req.body;
        
        //! si el usauario es el mismo que viene de la request quiere decir 
        //! que la persona no esta actualizando el email, entonces los quitamos
        if ( usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne({ email })
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usario con ese email'
                });
            } 
         } 
         //! necesitamos poner el email que queremos actualizar
         if ( !usuarioDB.google ) {
            campos.email = email; // esto solo deberia ser posible si no es de Google
         } else if ( usuarioDB.email !== email) {
             return res.status(400).json({
                ok: false,
                msg: 'Usuarios de Google no pueden cambiar su correo'
            })
         }
    
        // puede eliminar lo que No quiero actualizar, estos campos no deben cambiarse
        // delete campos.password;
        // delete campos.google;
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid , campos, { new: true }); // siempre le indicamos que regrese el nuevo
            
        
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async(req, res = response ) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid ); // si esto se encuentra existe un usuario con este id
        
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        
        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: "Usuario eliminado"
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
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}