const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

//getTodo
const getTodo = async(req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i'); // lo hacemos insensible a minusculas y mayusculas

    const [ usuarios, medicos, hospitales ] = await Promise.all([
        Usuario.find({ nombre: regex }),// usamos la expresion regular en vez de la busqueda
        Medico.find({ nombre: regex }),// usamos la expresion regular en vez de la busqueda
        Hospital.find({ nombre: regex }),// usamos la expresion regular en vez de la busqueda 
    ]);

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    })
}

//por coleccion
const getDocumentoColeccion = async(req, res = response) => {

    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp( busqueda, 'i'); // lo hacemos insensible a minusculas y mayusculas

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img')
                                ;// usamos la expresion regular en vez de la busqueda
            break;

        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                .populate('usuario', 'nombre img');// usamos la expresion regular en vez de la busqueda
            break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });// usamos la expresion regular en vez de la busqueda
            break;
    
        default:
            // si llegamos aqui no queremos continuar
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });     
    }
    
    res.json({
        ok: true,
        resultados: data
    })
    
    // const [ usuarios, medicos, hospitales ] = await Promise.all([
    //     Usuario.find({ nombre: regex }),// usamos la expresion regular en vez de la busqueda
    //     Medico.find({ nombre: regex }),// usamos la expresion regular en vez de la busqueda
    //     Hospital.find({ nombre: regex }),// usamos la expresion regular en vez de la busqueda 
    // ]);

    // res.json({
    //     ok: true,
    //     usuarios,
    //     medicos,
    //     hospitales
    // })
}

module.exports = {
    getTodo,
    getDocumentoColeccion
}