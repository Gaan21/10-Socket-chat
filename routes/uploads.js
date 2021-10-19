const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarCampos, validarArchivoSubido } = require('../middlewares');


const router = Router();


//Para crear archivos nuevos el estandar el el post, para actualizar el put
router.post( '/', [validarArchivoSubido] , cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubido,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( colec => coleccionesPermitidas( colec, ['usuarios','productos'])),
    validarCampos
  
], actualizarImagenCloudinary)  //actualizarImagen

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom( colec => coleccionesPermitidas( colec, ['usuarios','productos'])),
    validarCampos
], mostrarImagen)


module.exports =  router; 