const { validationResult } = require('express-validator');


//Los Middlewares usan los mismos objetos req y res que los controladores ademas de 'next' que es para
//que se ejecute si el middleware pasa.
const validarCampos = ( req, res, next) => {

      //Confirmar errores almacenados en los middlewares
      const errors = validationResult(req); //errores almacenados en los middlewares

      if ( !errors.isEmpty() ) {
          return res.status(400).json( errors ); //Mostrar los errores
      }

      next(); //Si llega aqui sigue con el siguiente middleware.
}


module.exports = {
     validarCampos 
}