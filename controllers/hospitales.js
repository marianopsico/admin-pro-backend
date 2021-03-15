const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async( req, res = response ) => {

    // el metodo populate es de mongoose
    const hospitales = await Hospital.find()
                                    .populate('usuario', 'nombre img')

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async( req, res = response ) => {

    const uid = req.uid; // nosotros siempre vamos a tener el uid despues de la validacion del token
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });
        
    try {

        // necesitamos el id el usuario que lo esta creando, lo tomamos
        // del token 

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
        
    } catch (error) {
        console.log(error)

        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}

const actualizarHospital = ( req, res = response ) => {
    res.json({
        ok: true,
        msg: 'actualizarHospital'
    })
}

const borrarHospital = ( req, res = response ) => {
    res.json({
        ok: true,
        msg: 'borrarHospital'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}