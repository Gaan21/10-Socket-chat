
const miFormulario = document.querySelector('form'); //Referencia al formulario de html

   const url = 'http://localhost:8080/api/auth/'


miFormulario.addEventListener('submit', evento =>{
    evento.preventDefault(); //Para evitar que refresque el navegador web
    const formData = {};

    for ( let elemento of miFormulario.elements ) {
        //Leer todos los campos del formulario que no tienen la propiedad name
        if ( elemento.name.length > 0 ) {
            formData[elemento.name] = elemento.value
        }
    }
    
    fetch( url + 'login', {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: { 'Content-Type': 'application/json'}
    })
    .then( resp => resp.json() )
    .then( ({ token }) => {
        
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log( err )
    })
});


function handleCredentialResponse(response) {
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response. //Google token o ID_TOKEN
    //console.log('id_token',response.credential);

    //El id_token es igual a las credenciales que vienen de google
    const body = { id_token: response.credential}; 

    //Es una promesa(peticion fetch) que por defecto es una peticion GET
    fetch( url + 'google', { //Transformar a peticion POST
       
        method: 'POST',
        headers: {  //Para decirle que tipo de contenido estoy enviando
           'Content-type':'application/json'
        },
        body: JSON.stringify( body ) 
        //DUDA //El body tiene que estar serializado, asi funciona el fetch API
    })

    .then( resp => resp.json() )//De la respuesta el fetch la pasa a .json

    .then( ({ token }) => {
       localStorage.setItem('token', token);
       window.location = 'chat.html';
    })
    .catch( console.warn );  
 }



 const button = document.getElementById('#google_signout');
 
 //Por algun motivo no funciona todo esto, el button.onclick recibe null
 /* button.onclick = () => {

  console.log( google.accounts.id )
  google.accounts.id.disableAutoSelect()//Para mantenerlo desactivado

  google.accounts.id.revoke( localStorage.getItem( 'email'), done =>{ //Un callback
     localStorage.clear(); //Para limpiar lo que haya guardado en el localstorage
     location.reload(); //Para recargar la pagina y vaciar cualquier cosa 
  })
  //Obtenemos el email guardado previamente en el localstorage
 }  */
 