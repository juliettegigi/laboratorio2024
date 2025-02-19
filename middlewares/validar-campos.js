const {validationResult}=require('express-validator');

const validarCampos=(req,res,next)=>{

    const e=validationResult(req);
    if(!e.isEmpty()){
      console.log("ok")
      console.log(e.errors)
       return req.renderizar(e.errors)
      }
      
    next() ;
  }
  

module.exports={
    validarCampos,}