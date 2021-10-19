const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require('../controllers/Productos');

const { existeCategoriaID, existeProductoID } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');



const router = Router();


//http://localhost:8080/api/Productos


//Obtener todos las Productos - publico
router.get('/', obtenerProductos);

//Obtener una Producto por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoID ),
    validarCampos,  
], obtenerProducto);

//Crear Producto - privado - cualquier persona con un token valido
router.post('/', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaID),
    validarCampos
    ], crearProducto
);

//Actualizar un registro por id - privado - cualquiera con token
router.put('/:id', [ 
    validarJWT,
    //check('categoria', 'No es un id de Mongo').isMongoId(),
    check('id').custom( existeProductoID ),
    validarCampos 
], actualizarProducto);

//Borrar una Producto - solo Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    //validarCampos, //Para ver hasta donde falla
    check('id').custom( existeProductoID ),
    validarCampos
],borrarProducto );

module.exports =  router; 