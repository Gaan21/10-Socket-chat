const { Schema, model } = require('mongoose');

const RolSchema = Schema({

    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
});


module.exports = model( 'role', RolSchema ); //Por algun motivo con 'Rol' daba error y con role no