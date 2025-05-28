
const procesarBody=(req,res,next)=>{

    let {email,nacimiento}=req.body;

    email='aloja'
    console.log("pruebaaaaaaaakkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkka")
    console.log(req.body.email)
    if(email===''){
        req.body.email=null;
    }
    if(nacimiento===''){
        req.body.nacimiento=null;
    }
      
    next() ;
  }
  

module.exports={
    procesarBody,}