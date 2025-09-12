const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client("961283639807-dbu75hn2c1eckvf47ho7lltkhi7an950.apps.googleusercontent.com");

const {Usuario,Examen,Paciente} = require('../models');
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
    return res.status(401).render('error', { msg: 'No autorizado', codigo: 401 });
  }
  next();
};


const existeId = (modelo) => {
  return async (id, { req }) => {
    const reg = await modelo.findByPk(id);
    if (!reg) {
      throw new Error('No existe registro');
    }
    req.registro = reg;
  };
};

const isCampoUnicoUsuario=async (campo,valorNuevo,req,editar=false,href="") => {
  console.log("CAMPO ",campo)
  console.log("VALOR NUEVO ",valorNuevo)
  console.log("EDITAR ",editar)
  console.log("REQ  ",req.body)
  if (valorNuevo.trim() === '') return true; 
  if(editar ){
    const {email,nombre,apellido,documento,
      telefono}=req.body
    const datosActualizar = {nombre,apellido,documento,email,
                             telefono};
    delete datosActualizar[campo];                                  
    if (valorNuevo !== req.registro[campo]) {
      
      datosActualizar[campo] = req.body[campo];
    }  
    req.datosActualizar=datosActualizar;                       
  }
 if(((editar && valorNuevo !== req.registro[campo]) || !editar)){
     const existeCampo = await Usuario.findOne({ where: { [campo]:valorNuevo } });
     if (existeCampo) {
      console.log("entroooooooooooooogggggggggggggggggggddddddddd")
      const error=new Error(`${campo} ya está registrado`)
      req.href=`${href}${existeCampo.id}` //http://localhost:3000/admins2/
      req.UsuarioId=existeCampo.id
         throw error;
     }
}

}


const isCampoUnicoExamen=async (campo,valorNuevo,req,href="") => {
  if (valorNuevo.trim() === '') return true; 
  try{
     const existeCampo = await Examen.findOne({ where: { [campo]:valorNuevo } });
     if (existeCampo) {
        const error=new Error(`${campo} ya está registrado`)
        req.href=`${href}${existeCampo.id}` //http://localhost:3000/admins2/
        req.ExamenId=existeCampo.id
        throw error;
    }
}
  catch(error){
    console.log("ERROR ",error)
    throw error;
  }
}


module.exports={
    googleVerify,
    existeId,
    isAuth,
    isCampoUnicoUsuario,
    tieneRole,
    isCampoUnicoExamen
}



