const { Router } = require('express');
const { check } = require('express-validator');
<<<<<<< HEAD
=======
<<<<<<< HEAD
const { validarCampos } = require('../middlewares/validar-campos');

const { login, googleSignIn } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');
=======
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea
const { validarCampos, validarJWT } = require('../middlewares');

const { login, googleSignIn, renovarToken } = require('../controllers/auth');

<<<<<<< HEAD
=======
>>>>>>> 0a27de5bce3bb7a5f08b06388a38dc9379a072c9
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea


const router = Router();


router.post('/login', [
    
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contraseña', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login  );  //Se importa el controlador 'login'
//No se pone auth/login porque ya esta puesto en el const de la clase Router


router.post('/google', [
    
    check('id_token', 'id_token es necesario').not().isEmpty(),
    
    validarCampos
], googleSignIn  );


<<<<<<< HEAD
router.get('/', validarJWT, renovarToken )


=======
<<<<<<< HEAD
=======
router.get('/', validarJWT, renovarToken )


>>>>>>> 0a27de5bce3bb7a5f08b06388a38dc9379a072c9
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea
module.exports =  router; 