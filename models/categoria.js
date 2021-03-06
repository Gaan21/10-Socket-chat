const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatoria'],
        unique: true
    },

    estado: {
        type: Boolean,
        default: true,
        required: true
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


CategoriaSchema.methods.toJSON = function () { 
    //Cuando se mande ejecutar el toJSON ejecuta la funcion
    const { __v, estado, ...data } = this.toObject();
   
    return data;
}


module.exports = model( 'Categoria', CategoriaSchema ); //Por algun motivo con 'Rol' daba error y con role no