const mongoose = require('mongoose');


const dbConnection = async() => {

    try {
//Espera a que la conexion se haga:Podemos poner await porque estamos dentro de una funcion async
        await mongoose.connect( process.env.MONGODB_CONEXION, {
        //Cosas que hay que poner segun la documentacion oficial: pero dan error si las pones
            /* useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false */
            
        }); 

        console.log('Base de datos online');
    

    } catch (error) {
        console.log(error);
        throw new Error ('Error en la base de datos');
    }

}

module.exports = {
    dbConnection
}