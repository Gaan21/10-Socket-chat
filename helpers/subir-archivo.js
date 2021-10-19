const { path } = require("path");
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => { 
//Recibe un file que se va a subir y unas extensiones que si no las recibe tienen este valor por defecto

    return new Promise ((resolve, reject) => {

        const { archivo } = files; //Lo que viene en la peticion para subir
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1];
        //Para ver la extension del archivo que es la ultima posicion del arreglo
    
        //Validar extension:
        if ( !extensionesValidas.includes(extension) ) {
        return reject(`La extension ${extension} no es valida, ${extensionesValidas}`); 
        }
        
    
        //Para dar un identificador unico a nuesttro archivo y le concatenamos la extension
        const nombreTemp = uuidv4() + '.' + extension; 
    
    //TODO: DUDA porque no funciona con __dirname
    //const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
    const carpetaNueva = 'C:/Users/Luciano Plaza/Desktop/Node/07-Restserver/uploads/'+ carpeta + '/'
    const uploadPath = carpetaNueva + nombreTemp
//const uploadPath = 'C:/Users/Luciano Plaza/Desktop/Node/07-Restserver/uploads/'+ carpeta + nombreTemp
//Construimos el path donde se guardaran las imagenes, si nos mandan nombre de carpeta la manda ahi
      
        archivo.mv(uploadPath, (err) => { //Movemos el archivo al path
          if (err) {
              console.log( err );
            reject(err);
          }
      
          resolve(nombreTemp)
        });    
    }) 
}


module.exports = {
    subirArchivo
}