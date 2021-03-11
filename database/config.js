const mongoose = require('mongoose');

const dbConnection = async ()=> { // el async crea devuelve una promesa

    try {
        // con el await le decimos que espere a que todo eso pase, en realidad nos permite
        // trabajar con esto como si fuera sincrono. Nos ayuda a trbajar de manera sincrona a pesar que esto es una promesa
        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
    });

        console.log('DB Online')
        
    } catch (error) {
        console.log( error );
        throw new Error('Error a la hora de iniciar la DB, ver logs');
    }

}

module.exports = {
    dbConnection
}