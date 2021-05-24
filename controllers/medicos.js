const { response } = require('express');

const Medico = require("../models/medico");

const getMedicos = async( req, res = response ) => {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async( req, res = response ) => {

    const uid  = req.uid; // como ya pasamos la validacion del tojen aqui tenemos el id

    const medico = new Medico({
        usuario: uid,
        ...req.body
    })

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
    
}

const actualizarMedico = async( req, res = response ) => {
    
    // necesitamos el id de la ruta
    const id = req.params.id;
    // como pasamos por la autorizacion del JWT tenemos el uid
    const uid = req.uid;

    try {

        // existe un hospital con ese id?
        const medico = await Medico.findById( id );

        if( !medico ) {
            return res.starus(404).json({
                ok: false,
                msg: 'Medico no encontrado por id',
            })
        } 

        // si existe lo actualizo
       const cambiosMedico = {
           ...req.body,
           usuario: uid
       }

       const medicoActualizado = await Medico.findByIdAndUpdate( id , cambiosMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        })
        
    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
    
}

const borrarMedico = async( req, res = response ) => {
    // necesitamos el id de la ruta
    const id = req.params.id;
    
    try {

        // existe un hospital con ese id?
        const medico = await Medico.findById( id );

        if( !medico ) {
            return res.starus(404).json({
                ok: false,
                msg: 'Medico no encontrado por id',
            })
        } 

        await Medico.findOneAndDelete(id);

        res.json({
            ok: true,
            msg: "Médico Borrado"
        })
        
    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        })
    }
}

const getMedicoById = async( req, res = response ) => {

    const id = req.params.id;

    try {

        const medico = await Medico.findById(id)
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medico
    })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        })
        
    }

    
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}