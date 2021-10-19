const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria,
        borrarCategoria } = require('../controllers/categorias');
const { existeCategoriaID } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');



const router = Router();


//http://localhost:8080/api/categorias


//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaID ),
    validarCampos,  
], obtenerCategoria);

//Crear categoria - privado - cualquier persona con un token valido
router.post('/', [ validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
    ], crearCategoria
);

//Actualizar un registro por id - privado - cualquiera con token
router.put('/:id', [ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaID ),
    validarCampos 
], actualizarCategoria);

//Borrar una categoria - solo Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    //validarCampos, //Para ver hasta donde falla
    check('id').custom( existeCategoriaID ),
    validarCampos
],borrarCategoria );

module.exports =  router; 