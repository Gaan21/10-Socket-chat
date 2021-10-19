const { response } = require("express")


const validarArchivoSubido = ( req, res = response, next ) => {

    //Si no vienen archivos en la peticion || Hace un barrido de los files y si viene 0 lo mismo
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({ 
            msg: 'No hay archivos que subir 1 - validarArchivoSubido'});
        return;
      }
    
     /*  if (!req.files.archivo) {//Si no viene en la peticion el file llamado archivo
        res.status(400).json({ 
            msg: 'No hay archivos que subir 2 - validarArchivoSubido'});
        return;
      } */
      next();
}


module.exports = {
    validarArchivoSubido
}