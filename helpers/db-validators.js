const { Categoria, Usuario, Producto } = require('../models');
const role = require('../models/rol');
//DUDA //Con 'Rol' daba error y con 'role' no




const esRolValido = async (rolee = '') => {
    //Si encuentra un rol en nuestro schema(Rol) como el que estamos intentando validar(rol)
    
          const existeRol = await role.findOne( { rol:rolee } );
          //TODO://DUDA: rol:rolee, rolee es el parametro que recibe la funcion custom.
          //Necesito ENTENDER MEJOR ESTA FUNCION.
    
          if (!existeRol) {
            throw new Error(`El rol ${rolee} no esta registrado en la BD`)
          }
    }


    const existeEmail =  async function ( email = '')  {

      const existeMail = await Usuario.findOne( { correo:email } )

      if (existeMail) {
        throw new Error ( 'Este correo ya esta registrado' )      
        };
    }
    //Busca un objeto que tenga el correo igual al correo que recibo como argumento.En js es redundante
    

    //Validador de usuarios
    const existeUsuarioID =  async function ( ide = '')  {

      const existeID = await Usuario.findById( ide )

      if (!existeID) {
        throw new Error ( `El id: ${ide} no existe` )      
        };
    }

    //Validador de categorias
    const existeCategoriaID =  async function ( ide = '')  {

      const existeID = await Categoria.findById( ide )

      if (!existeID) {
        throw new Error ( `El id: ${ide} no existe` )      
        };
    }

    //Validador de productos
    const existeProductoID =  async function ( ide = '')  {

      const existeID = await Producto.findById( ide )

      if (!existeID) {
        throw new Error ( `El id: ${ide} no existe` )      
        };
    }


    //Validar colecciones permitidas
    const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

      const incluida = colecciones.includes( coleccion );

      if ( !incluida ) {
        throw new Error (`La coleccion ${coleccion} no es permitida, ${colecciones}`)
      }
      return true;
      //en los otros helpers al no retornar Error, express-validator interpreta que 
      //la validación es exitosa con un return implícito. En este hay que poner return true
    }



module.exports = { 
  esRolValido, 
  existeEmail, 
  existeUsuarioID,
  existeCategoriaID,
  existeProductoID,
  coleccionesPermitidas
 }