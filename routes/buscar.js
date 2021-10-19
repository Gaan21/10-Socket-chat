const { Router } = require('express');
const { buscar } = require('../controllers/buscar');


const router = Router();


router.get('/:coleccion/:termino', buscar) 
//Usaremos los parametros introducidos en el navegador para buscar por coleccion
//Y por producto dentro de esa coleccion


module.exports = router;