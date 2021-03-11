require('dotenv').config();

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

// Rutas

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
})