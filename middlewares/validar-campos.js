const {validationResult}=require('express-validator');
const {
    Paciente
   } = require('../models');


const userExisteCheckTablasHijas=async (req,res,next)=>{

  let errores=validationResult(req).errors;
  console.log(" *************/************/****************/*********************----------")
  console.log(errores)
    if(errores.length!==0){
     const arr = ["documento", "nombre", "apellido", "email", "titulo", "matricula", "telefono"]
      const erroresPath= arr.filter(elem=>errores.find(e=>e.path===elem))  
      console.log('pajajajjaajj11111')
        console.log(erroresPath)
      if(erroresPath.includes('email') || erroresPath.includes('documento')){
        const pacienteEncontrado=await Paciente.findPacienteByEmailODocumento(req.body.email, req.body.documento)
        console.log('pajajajjaajj')
        console.log(pacienteEncontrado)
        if(!pacienteEncontrado){
          errores= errores.filter(elem=> elem.path!== 'documento' && elem.path!=='email')
          req.errores=errores 

          console.log("ENTROOOOOOOOOO")
          console.log(errores)
        }
      }
    }
    next() ;
}

const validarCampos=(req,res,next)=>{
    console.log("queeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    console.log(req.errores)
    const e=req.errores
            ? req.errores
            :validationResult(req).errors;
    if(!e.length==0){
      
      console.log("ok")
      console.log(e)
       return req.renderizar(e)
      }
      
    next() ;
  }
  

module.exports={
    validarCampos,
    userExisteCheckTablasHijas
  }