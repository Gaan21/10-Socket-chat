

const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


async function googleVerify( token = '' ) {

  const ticket = await client.verifyIdToken({ //Utiliza el cliente para verificar el id_token
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  
      // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const { name, picture, email } = ticket.getPayload();
  //Desestructuracion de los datos que nos interesan del payload
  
  return { //Le ponemos el nombre que nos interesa
      nombre: name,
      img: picture,
      correo: email
  }
}


module.exports = {
    googleVerify
}