const jwt = require('jsonwebtoken');

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

module.exports = {
    validarJWT,
}