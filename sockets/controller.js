const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();


//Cuando se conecta una persona se crea un socket
const socketController = async ( socket = new Socket(),io ) => { //io: Todo el servidor de sockets

    const token = socket.handshake.headers['xtoken'];

    const usuario = await comprobarJWT(token);

    if ( !usuario ) {
//Si no viene el usuario desconectamos el socket porque no esta autenticado y no es quien dice ser
        return socket.disconnect(); 
    }


    //Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuriosARR) //Manda el arreglo de usuarios conectados
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);


    //Conectarlo a una sala especial
    socket.join( usuario.id ); // global, socket.id, usuario.id


    //Limpiar el arreglo cuando alguien se desconecta
    socket.on('disconnect', () => {

        chatMensajes.desconectarUsuario( usuario.id );

        io.emit('usuarios-activos', chatMensajes.usuriosARR)
    })


    socket.on('enviar-mensaje', ({uid, mensaje}) => {

        if (uid) { // Si el uid viene es que es un mensaje privado
            
            socket.to( uid ).emit( 'mensaje-privado', {de: usuario.nombre, mensaje});
                                //Evento disparado,     //Payload
        } else{ //Si no es un mensaje publico

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
        
        
    })
}


module.exports = {
    socketController
}