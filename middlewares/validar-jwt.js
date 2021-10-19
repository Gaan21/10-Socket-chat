const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async ( req = request, res = response, next) => {

    const token = req.header('xtoken');//El parametro que hay en el header llamado x-token
    //POSIBLEMENTE HABIA PROBLEMAS CON EL GUION -

    if ( !token ) {
        return res.status(401).json({ 
            msg: 'No hay token en la peticion'
        });
    }
    
    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);//Para verificar el JWT
        //console.log(payload);

        //leer el usuario que corresponde al uid del usuario que viene en el token
        const usuario = await Usuario.findById( uid );

        //Verificar que existe el usuario
        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no existe'
            })
        }

        //Verificar que el estado del usuario logeado es true para que un usuario que ha sido 
        //'borrado' no pueda borrar otros
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario registrado con estado false'
            })
        }


        //DUDA DEL CUADERNO
        req.usuario = usuario//Se crea la propiedad nueva dentro del objeto req. y pasa por
        //los validadores que van despues de este hasta el ultimo.
        
        next();
        
    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    } 
}

module.exports = {
    validarJWT
}