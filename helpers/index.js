
const dbValidators = require('./db-validators');
const generarJWT = require('./generarJWT');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');


module.exports = { //Con los ... para tener todas las propiedades de cada uno
...dbValidators,
...generarJWT,
...googleVerify,
...subirArchivo
}