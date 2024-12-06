const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client("961283639807-dbu75hn2c1eckvf47ho7lltkhi7an950.apps.googleusercontent.com");

async function googleVerify(token='') {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience:"961283639807-dbu75hn2c1eckvf47ho7lltkhi7an950.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
     });
  const payload = ticket.getPayload();
  return({email:payload.email})
}

module.exports={
    googleVerify
}