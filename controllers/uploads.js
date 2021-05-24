const path = require('path'); // esto viene en node
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");


const fileUpload = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    // el tipo tiene que ser valido
    const tiposValidos = ['medicos', 'hospitales', 'usuarios'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital (tipo)'
        })
    }

    // aca ya deberiamos poder tener subido el archivo
    // validamos que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg:'No hay ningún archivo'
        });
      }

    // Procesar la imagen...
    //extraemos la imagen
    const file = req.files.imagen;

    // extraemos la extension del archivo
    const nombreCortado = file.name.split('.'); // wolverine.1.3.jpg || lo cortamos por el punto
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1]; // obtenemos el ultimo

    // Validamos la extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (!extensionesValidas.includes( extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg:'No es una extension permitida'
        });
    }

    // Generamos el nombre del archivo
    //! usamos uuid para generar un nombre diferente con cada imagen
    const nombreArchivo = `${ uuidv4()}.${ extensionArchivo }`;

    // Creamos el Path en donde guardamos esa imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // movemos la imagen
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover el archivo'
            });
        }


        // Actualizar base de datos
        actualizarImagen(tipo, id, nombreArchivo);


        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });
};

const retornaImagen = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }`);

    // imagen por defecto
    if ( fs.existsSync( pathImg ) ) {
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg`);
        res.sendFile( pathImg );
    }
};

module.exports = {
    fileUpload,
    retornaImagen
}
