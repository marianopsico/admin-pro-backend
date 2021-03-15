//! esto es de node
const fs = require('fs'); // con esto podemos leer el fileSystem

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


const borrarImagen = ( path ) => {
// tiene una imagen previamente asignada?
// si la tiene hay que actualizarla

    if ( fs.existsSync( path ) ) {
        // borramos la imagen anterior
        fs.unlinkSync( path );
    }
};

const actualizarImagen = async( tipo, id, nombreArchivo ) => {

    let pathViejo = '';
    
    switch (tipo) {
        case 'medicos':
            // existe un medico con ese id?
            const medico = await Medico.findById(id);
            if (!medico) {
                console.log('No es un médico');
                return false;
            }

            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen( pathViejo );

            // lo cambiamos y grabamos
            medico.img = nombreArchivo;
            await medico.save();
            return true;

            break;
        case 'hospitales':
            // existe un hospital con ese id?
            const hospital = await Hospital.findById(id);
            if (!hospital) {
                console.log('No es un hospital');
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen( pathViejo );

            // lo cambiamos y grabamos
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        
            break;
        case 'usuarios':
            // existe un usuario con ese id?
            const usuario = await Usuario.findById(id);
            if (!usuario) {
                console.log('No es un usuario');
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen( pathViejo );

            // lo cambiamos y grabamos
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
    
            break;
    
        default:
            break;
    }

    // console.log('Vamos bien');
}


module.exports = {
    actualizarImagen
}