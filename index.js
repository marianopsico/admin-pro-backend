require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors')
const { dbConnection } = require('./database/config');

//! usamos mongoose!
//! usamos el paquete de npm dotenv para las variables de entorno
//! usamos el paquete de npm cors (sirve para que el servidor acepte peticiones desde distintos dominios) 

// Crear el servidor de express
const app = express();

// Configurar cors
app.use(cors())

// Lectura y parseo del body
app.use( express.json() ); //! tambien usamos un middleware que ya trae

//Base de datos
dbConnection();

// Directorio Público
app.use( express.static('public') );

// Rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));
app.use('/api/login', require('./routes/auth'));

//! esto es por heroku sino no encuentra las rutas
// lo último
app.get('*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
})