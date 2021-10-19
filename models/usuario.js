
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema ({
//Objeto de mongo: se graba en objetos tipo Schema(documento) que se graban dentro de colecciones(tablas)
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El coreo es obligatorio'],
        unique: true
    },
    contraseña: {
        type: String,
        required: [true, 'Contraseña obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true, 
        //enum: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'] //Supuestamente esta linea no haria falta.
        //El fallo estaba en mantener esta linea, solo dejaba crear los roles que estuvieran en enum:
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },  
});


//Para sobrescribir metodos de moongose o crear personalizados:
//tiene que ser funcion normal. Las de flecha mantienen a lo que apunta el this fuera
UsuarioSchema.methods.toJSON = function () { //Cuando se mande ejecutar el toJSON ejecuta la funcion
    //Sacamos la version, el pass y el resto se almacena en usuario.
    const { __v, contraseña, _id, ...usuario } = this.toObject();
    usuario.uid = _id;  //No sale como _id sino como uid pero es el mismo numero
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema ); //Nombre del modelo y el Schema.