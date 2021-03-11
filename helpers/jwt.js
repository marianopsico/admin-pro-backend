/**  usamos JWT Json Web Token
 
     instalamos el paquete de jsonwebtoken
*/
const jwt = require('jsonwebtoken');

//! necesitamos que esta funcion sea sincrona
const generarJWT = ( uid ) => {

    //! transformamos esta función en una promesa
    return new Promise( ( resolve, reject ) => {

        // lo que guardamos en el Payload del token no
        // debe contener info sensible ya que se puede desencryptar   
        const payload = {
            uid,
        }

        // firmamos el payload
        // determinamos cuanto va a durar el token
        jwt.sign( payload, process.env.JWT_SECRET , {
            expiresIn: '12h'
        }, ( err, token ) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT')
            } else {
                resolve( token );
            }
        });
    });
}

module.exports = {
    generarJWT,
}