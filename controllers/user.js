const { response, request } = require('express'); //Para poder poner res.algo
const bcrypt = require('bcryptjs');

const Usuario = require ('../models/usuario');


//CONTROLADORES 
const userGet = async (req = request, res = response ) => {
    //res.status
    //const { q, nombre= 'No name', apikey, page = 1 , limit } = req.query;
    //Desestructuracion de argumentos para sacar lo que nos piden en la url

    const { limite = 5, desde = 0 } = req.query; //Extraemos limite que viene del req.query
    const status = { estado:true } //cuenta los elementos del array que coincidan con estado = true

    /* const usuarios = await Usuario.find( status )
    .skip(Number( desde ) )  //Muestra desde el numero que le digamos
    .limit(Number( limite ));
    //Casteo a un numero. //Se puede hacer una validacion extra para asegurarnos que viene un num

  const total = await Usuario.countDocuments( status ); */


//Para que no tenga que esperar el await dos veces y acumular 3 segundos + 2:
  const [ total, usuarios ] = await Promise.all([  //Coleccion de promesas
      Usuario.countDocuments( status ),//total es resultado de la 1º promesa
      Usuario.find( status )          //usuarios de la 2º
          .skip(Number( desde ) )  
          .limit(Number( limite ))
  ])//Hay que poner el await para que espere la resolucion de las dos promesas(Se ejecutan simultaneamente)
  
    res.json({
      total,
      usuarios
    });
  }

  const userPost = async (req, res = response ) => {  

    const { nombre, correo, contraseña, rol } = req.body; //Sacamos lo que nos interesa de lo que inserten
    //Lo que solicita el usuario en el req.Se construye en postman con formato JSON

    //Creacion de la instancia para el objeto mongo
    const usuario = new Usuario({ nombre, correo, contraseña, rol });//De esta manera se le envian solo 
    //estos campos en la creacion de un usuario

    //Verificar si existe el correo: //Ya se ha hecho en los validators
    /* const existeEmail = await Usuario.findOne({ correo }); 
    //Busca un objeto que tenga el correo igual al correo que recibo como argumento.En js es redundante
    if (existeEmail) {
        return res.status(400).json({
            msg: 'Ese correo ya esta registrado'
        });
    } */

    //Encriptar la contraseña:
    const salt = bcrypt.genSaltSync(10); //Generar encriptado. Esta en la docu de bcryptjs
    usuario.contraseña = bcrypt.hashSync( contraseña, salt); //La contraseña se encripta y se guarda en 
    //usuario.contraseña

    //Guardar en BD
    await usuario.save();

    res.json({
        usuario
    })
  }

  const userPut = async (req, res = response ) => {
    
    const ide = req.params.userId;
    const { _id, contraseña, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos el id
    if ( contraseña ) {
          //Encriptar la contraseña:
        const salt = bcrypt.genSaltSync(10); 
        resto.contraseña = bcrypt.hashSync( contraseña, salt);
        //Si viene una contraseña en el req graba una nueva
    }

    const usuario = await Usuario.findByIdAndUpdate( ide, resto )
    //Encuentra por el id introducido y actualiza los campos que estan en el resto.

    res.json({
        usuario
    })
  }

  const userPatch = (req, res = response ) => {
    
    res.json({
        msg: 'get API - controlador'
    })
  }

  const userDelete = async (req, res = response ) => {
    
    const { userId } = req.params; //params de lo que nos solicitan

    
    //DUDA DEL CUADERNO: 
    const uid = req.uid; //podemos extraer esta propiedad del req porque la hemos
    //creado en el primer validador y llega hasta aqui


    //const usuario = await Usuario.findByIdAndDelete( userId );//Borrar fisicamente(poco recomendable)

    //Forma cambiando el estado: Cambia a false el estado del id introducido
    const usuario = await Usuario.findByIdAndUpdate( userId, { estado: false} );

    //const usuarioAutenticado = req.usuario;

    res.json({
        //msg: 'delete API - userDelete1',
        //userId,
        usuario,
        //usuarioAutenticado
        //uid
    })
  }

  
  

  module.exports = {
        userGet,
        userPost,
        userPut,
        userPatch,
        userDelete
  }