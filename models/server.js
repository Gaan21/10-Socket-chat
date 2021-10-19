
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
<<<<<<< HEAD
=======
<<<<<<< HEAD

const { dbConnection } = require('../database/config');
=======
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea
const { createServer } = require('http');

const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');
<<<<<<< HEAD
=======
>>>>>>> 0a27de5bce3bb7a5f08b06388a38dc9379a072c9
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea


class Server {

    constructor() { //En el constructor se declaran las propiedades en javascript

        this.app = express(); //Creamos la app de express como propiedad en la clase
        this.port = process.env.PORT;

<<<<<<< HEAD
        this.server = createServer( this.app );
        this.io     = require('socket.io')(this.server);

=======
<<<<<<< HEAD
=======
        this.server = createServer( this.app );
        this.io     = require('socket.io')(this.server);

>>>>>>> 0a27de5bce3bb7a5f08b06388a38dc9379a072c9
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea
        //Paths para la autenticacion y para los usuarios
        this.paths = {
            auth:       '/api/auth'     ,
            buscar:     '/api/buscar'   ,
            usuarios:   '/api/usuarios' ,
            productos:  '/api/productos',
            categorias: '/api/categorias',
            uploads:    '/api/uploads'
        }
       
        //Conectar a base de datos:
        this.conectarDB();

        //Midlewares:  Funciones que se van a ejecutar siempre cuando levantemos el servidor
        this.middlewares();

        //Rutas de mi app:
        this.routes();

        //Sockets
        this.sockets();
    }


    async conectarDB() {

        await dbConnection();
<<<<<<< HEAD
    }


=======
    }


<<<<<<< HEAD
    async conectarDB() {

        await dbConnection();
    }


=======
>>>>>>> 0a27de5bce3bb7a5f08b06388a38dc9379a072c9
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea
    middlewares() { //Todo esto se ejecuta antes de llegar a las rutas

        //CORS: te quita muchos errores con navegadores. Protege el servidor de manera superficial.
        this.app.use( cors() );

        //Lectura y parseo del body:
        this.app.use( express.json() ); //cualquier info que venga la intenta serializar a JSON.

        //Directorio publico:   //Sirve el contenido que hay en la carpeta public en index.html
        this.app.use( express.static('public') ); 

        //File upload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //Para que cree una carpeta dentro de uploads si le mandamos 
            //una ruta con una carpeta nueva que no existe
        }));

       /*  this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(bodyParser.json()); */
    }

    
    routes() {
        //Definimos las rutas:
        this.app.use(this.paths.auth,       require('../routes/auth'));
        this.app.use(this.paths.buscar,     require('../routes/buscar'));

    //Midleware condicional, se solicita a /usuarios y se llama a /routes/user
        this.app.use(this.paths.usuarios,   require('../routes/user'));
    //Nuevo path que hay que poner en el navegador
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos,  require('../routes/productos'));
        this.app.use(this.paths.uploads,    require('../routes/uploads'))
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea
    }


    sockets() {
        this.io.on('connection', ( socket ) => socketController(socket, this.io) )//NO ENTIENDO
<<<<<<< HEAD
=======
>>>>>>> 0a27de5bce3bb7a5f08b06388a38dc9379a072c9
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea
    }


    listen(){
        
        this.server.listen( this.port, () => {

            console.log('Servidor corriendo en el puerto: ', this.port )
        });
    }
}


module.exports = Server;