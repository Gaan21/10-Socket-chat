const { response } = require('express');


const esAdminRole = ( req, res = response,  next) =>{

//Para comprobar que hay un usuario con token valido despues de haber pasdo por la validacion del token
    if ( !req.usuario ) {  
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token'
        })
    }

    const { rol,nombre } = req.usuario;

    if ( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es un usuario administrador`
        });
    }

    next();
}

const tieneRol = ( ...roles ) =>{ //Recibimos los argumentos de los roles
    //Guarda los roles como un arreglo
    //Devolvemos la funcion que se va a ejecutar en los midlewares
    return ( req, res = response,  next ) =>{
        
        if ( !req.usuario ) {  
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token'
            })
        }

        if ( !roles.includes( req.usuario.rol )  ) { 
//Si en el arreglo roles no existe el rol del usuario solicitante no lo dejes borrar.
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }

        next();
    }
}

module.exports = { 
    esAdminRole,
    tieneRol
}