//Para meter todos los middlewares en una sola exportancion en routes/user.js

const  validarCampos  = require('../middlewares/validar-campos');
const  validarJWT  = require('../middlewares/validar-jwt');
const  validaRoles  = require ('../middlewares/validar-roles');
const  validarArchivoSubido = require ('../middlewares/validar-archivo');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivoSubido
}