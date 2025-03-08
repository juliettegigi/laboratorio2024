const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client("961283639807-dbu75hn2c1eckvf47ho7lltkhi7an950.apps.googleusercontent.com");

const {Usuario} = require('../models');
const req = require('express/lib/request');

async function googleVerify(token='') {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience:"961283639807-dbu75hn2c1eckvf47ho7lltkhi7an950.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
     });
  const payload = ticket.getPayload();
  return({email:payload.email})
}




const tieneAcceso=(rolAuth,rolRequired)=>{
  const userRoles = rolAuth.map(role => role.toLowerCase());
  const requiredRoles = rolRequired.map(role => role.toLowerCase());
  const tieneAcceso = userRoles.some(role => requiredRoles.includes(role));
  return tieneAcceso
}

const tieneRole=(...roles)=>{
  
  return (req,res,next)=>{
    if (!req.session || !req.session.roles) {
      return res.status(403).render('error', { msg: 'No tiene roles asignados' });
    }
    
    if (!tieneAcceso(req.session.roles, roles)) {
      return res.status(403).render('error', { msg: `El usuario no tiene el rol necesario (${roles.join(', ')}) para acceder a esta ruta.` });
    }
    next();
  }
  
}

const isAuth = (req, res, next) => {
  if (!req.session.usuario) {
    console.log("entor")
    return res.status(401).render('error', { msg: 'No autorizado', codigo: 401 });
  }
  next();
};


const existeUsuario=async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
      throw new Error('Usuario no encontrado');
  }
  req.usuarioActual=usuario;
}


const isCampoUnicoUsuario=async (campo,valorNuevo,req,editar=false) => {
  if(editar ){
    const {email,nombre,apellido,documento,
      matricula,titulo,
      telefono}=req.body
    const datosActualizar = {nombre,apellido,documento,email,
                             matricula,titulo,
                             telefono};
    delete datosActualizar[campo];                                  
    if (valorNuevo !== req.usuarioActual[campo]) {
      
      datosActualizar[campo] = req.body[campo];
    }  
    req.datosActualizar=datosActualizar;                       
  }
 if(((editar && valorNuevo !== req.usuarioActual[campo]) || !editar)){
     const existeCampo = await Usuario.findOne({ where: { [campo]:valorNuevo } });
     if (existeCampo) {
         throw new Error(`${campo} ya está registrado`);
     }
}

}

module.exports={
    googleVerify,
    existeUsuario,
    isAuth,
    isCampoUnicoUsuario,
    tieneRole,
}



