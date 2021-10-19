const { Router } = require('express');
const { check } = require('express-validator');

/* const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRol } = require ('../middlewares/validar-roles') */

const {validarCampos,validarJWT,esAdminRole,tieneRol} = require('../middlewares/index');//El/index sobra

const { esRolValido, existeEmail, existeUsuarioID } = require('../helpers/db-validators');

const { userGet, userPut, userPost, userDelete, userPatch } = require('../controllers/user');




const router = Router();

router.get('/', userGet ); //No ejecutamos la funcion, sino que llamamos la referencia a la misma


  router.put('/:userId',[
      check('userId', 'No es un ID valido').isMongoId(),//Para ver si el id de la ruta es de mongo
      check('userId').custom(existeUsuarioID),
      check('rol').custom( (rol) => esRolValido(rol) ),

      validarCampos

  ], userPut );


  router.post('/',[ //Midleware se coloca como 2º argumento. Si son varios se usa un Arreglo []
      check('correo', 'El correo no es valido').isEmail(),// el check prepara los errores
      //Analiza el campo correo y con.isemail le decimos que es de tipo correo electronico.

      check('correo').custom( existeEmail ), //CUSTOM

      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('contraseña', 'La contraseña debe de tener mas de 6 caracteres').isLength( {min:6} ),

      //El rol se validara con la base de datos, no con un string.
      //check('rol', 'No es un rol válido').isIn( ['ADMIN_ROLE','USER_ROLE'] ),

      //El custom(verificacion personalizada) recibe como argumento el valor del body que se esta evaluando(rol)
      check('rol').custom( (rol) => esRolValido(rol) ),

      validarCampos  //Se pone el ultimo porque revisa los errores de cada uno de los check

  ], userPost); //Si pasan todos los middlewares se ejecuta el controlador.


  router.delete('/:userId',[  
      validarJWT,  //Se crea la propiedad uid para el req
      //esAdminRole, 
      tieneRol('ADMIN_ROLE', 'VENTAS_ROLE'),//MDW que recibe argumentos
      check('userId', 'No es un ID valido').isMongoId(),
      check('userId').custom(existeUsuarioID),
      validarCampos
  ] , userDelete);//pasa por todos los middlewares y en este controlador o cualquier
  //middleware que este despues de donde se ha creado la podemos extraer.


  router.patch('/', userPatch);


  module.exports = router;