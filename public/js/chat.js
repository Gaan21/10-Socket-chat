
let socket = null;
let usuario = null;


const url = 'http://localhost:8080/api/auth/'


//Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');


//Validar el token del localstorage
const validarJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if (token.length < 10) {
        window.location = 'index.html'; //Para redireccionar a la pagina inicial
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, { //Necesita el await porque es una promesa
        headers: { 'xtoken': token } //Le mandamos en los headers el xtoken con el valor de token
    })

    const { usuario: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem( 'token', tokenDB ); //Para renovar el JWT
    usuario = userDB;
    document.title = usuario.nombre; //Titulo de la pestaña con el usuario que se conecto

    await conectarSocket();
}


const conectarSocket = async() => {

    socket = io({
        'extraHeaders': { //Headers adicionales en esta conexion
            'xtoken': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online')
    })

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    })

    socket.on('recibir-mensajes', (payload) =>{
        dibujarMensajes(payload);
    })

    socket.on('usuarios-activos', ( payload ) =>{ //Se puede: ('usuari..', dibujarUsuarios)
        dibujarUsuarios(payload);
    })

    socket.on('mensaje-privado', ( payload ) =>{
        console.log( 'Privado:', payload );
    })
}


const dibujarUsuarios = ( usuarios = [] ) =>{

    let usersHtml = '';
    usuarios.forEach( ({ nombre, uid }) => {
//String multilinea
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    })

    ulUsuarios.innerHTML = usersHtml;
}


const dibujarMensajes = ( mensajes = [] ) =>{

    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {
//String multilinea
        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary"> ${ nombre } </span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    })

    ulMensajes.innerHTML = mensajesHTML;
}


txtMensaje.addEventListener('keyup', ({keyCode}) => { //Por cada tecla(Con su keyCode) crea un evento
    
    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;

    if( keyCode !== 13 ){ return; } //13 es enter
    if (mensaje.length === 0 ) { return; }

    socket.emit('enviar-mensaje', {mensaje, uid}); // {} Mejor mandar como objeto

    txtMensaje.value = ''; //Limpir el cuadro de mensaje
})


const main = async() => {

    //Validar JWT
    await validarJWT();
}


main();


//const socket = io();