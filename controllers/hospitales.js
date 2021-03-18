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

const actualizarHospital = async( req, res = response ) => {

    // necesitamos el id de la ruta
    const id = req.params.id;
    // como pasamos por la autorizacion del JWT tenemos el uid
    const uid = req.uid;

    try {

        // existe un hospital con ese id?
        const hospital = await Hospital.findById( id );

        if( !hospital ) {
            return res.starus(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id',
            })
        } 

        // si existe lo actualizo
       const cambiosHospital = {
           ...req.body,
           usuario: uid
       }

       const hospitalActualizado = await Hospital.findByIdAndUpdate( id , cambiosHospital, { new: true });

        res.json({
            ok: true,
            hospital: hospitalActualizado
        })
        
    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
    
}

const borrarHospital = async( req, res = response ) => {

     // necesitamos el id de la ruta
     const id = req.params.id;
    
     try {
 
         // existe un hospital con ese id?
         const hospital = await Hospital.findById( id );
 
         if( !hospital ) {
             return res.starus(404).json({
                 ok: false,
                 msg: 'Hospital no encontrado por id',
             })
         }
         
        await Hospital.findOneAndDelete(id);  
 
         res.json({
             ok: true,
             msg: 'Hospital eliminado',
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}