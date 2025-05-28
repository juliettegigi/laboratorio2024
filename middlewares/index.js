const validarCampos=require('./validar-campos');
const tecBioq=require('./tecBioq');
const admins=require('./admins');
module.exports={...validarCampos,...tecBioq,...admins}