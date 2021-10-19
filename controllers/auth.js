const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const { validationResult } = require("express-validator");

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");


const login = async ( req = request, res = response ) => {

    const { correo, contraseña } = req.body;

    try {  
        //Verificar si el email existe
        const usuario = await Usuario.findOne( { correo } )
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son corectos - usuario'
            });
        }


        //Si el usuario esta activo (No esta borrado)
        if ( usuario.estado === false ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - estado: False'
            });
        }


        //Verificar la contraseña
        const validPass = bcryptjs .compareSync( contraseña, usuario.contraseña);    
        //Compara la contraseña introducida con la contraseña almacenada en la base de datos.
        if ( !validPass ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - contraseña'
            });
        } 


        //Generar el JWT             //Es el id de mongo?
        const token = await generarJWT( usuario.id ) //NO ENTIENDO COMO FUNCIONA CON .id y no con .userId
        //console.log(token)

        
        //Enviar respuesta final
        res.json({
            msg: 'Login ok',
            usuario,
            token
        })


    } catch (error) {
        console.log(error)

        return res.status(500).json({
            msg: 'Algo salio mal'
        })
    } 
}


//Login para google
const googleSignIn = async( req, res = response ) => {

    const { id_token } = req.body;//Extraemos el id_token que sale de la respuesta de google

    try {
//Le pasamos el token de google a la funcion para tener los datos que hemos desestructurado en google-verify
        const { nombre, img, correo } = await googleVerify( id_token ); 
        //console.log(googleUser)

//Puedes ser que exista el usuario en la base de datos o no y hay que manejar las dos opciones
        let usuario = await Usuario.findOne({ correo });

        

        if ( !usuario ) { //Hay que crearlo

            const data = {
                nombre,
                correo,
                contraseña: ':p', //DUDA: El hash nunca va a ser igual a esto ¿?¿?¿?
                img,
                google: true,
                rol: 'USER_ROLE' 
                //HAY QUE MANDAR UN ROL POR DEFECTO, si no da error de token no valido
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario tiene estado false en BD
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar JWT
        const token = await generarJWT( usuario.id );
        

        res.json({
            //msg: 'Todo bien',
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            //ok: false,
            msg: 'El token no es valido'
        });
    }
}


<<<<<<< HEAD
=======
<<<<<<< HEAD
module.exports = { 
    login,
    googleSignIn
=======
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea
const renovarToken = async ( req, res = response ) => {

    const { usuario } = req;

    //Generar nuevo JWT
    const token = await generarJWT( usuario.id )

    res.json({
        usuario,
        token
    })
}


module.exports = { 
    login,
    googleSignIn,
    renovarToken
<<<<<<< HEAD
=======
>>>>>>> 0a27de5bce3bb7a5f08b06388a38dc9379a072c9
>>>>>>> 0a1ea433ff36581b9e4e3e1283b76296f54b3dea
 }