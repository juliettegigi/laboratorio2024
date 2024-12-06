const Sequelize = require('sequelize');
const bcryptjs=require('bcryptjs');

const {Usuario,Rol}=require("../models");
const { googleVerify } = require('./validaciones');







const login=async(req,res)=>{  
try{  
  let usuario={}; 
  const authHeader = req.headers['authorization'];
  
  // si se auth con google
  if (authHeader) { 
    //obtengo el token
    const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }
    // obtengo el email 
    const {email}=await googleVerify(token);
    // busco al usuario en mi base de datos
    usuario=await Usuario.findOne({where:{email}, include:[{ model: Rol}]});
    if(!usuario)return res.render("index"); 
    req.session.google=true;   
  }
  else{  //si no se auth con google
    //en el body recibo el nick name, la pass 
    let {nickName,pass}=req.body;
    //busco al usuario en mi base de datos
    usuario=await Usuario.findOne({where:{nickName}, include: [{model: Rol}]});
    if(!usuario)return res.render("index");
    // tengo que ver si la contraseña es correcta
    const passValida=await bcryptjs.compare(pass,usuario.pass);
    if(!passValida) return res.render("index");
    req.session.google=false;
  }
        const roles=usuario.Rols.map(elem=>elem.nombre)
        req.session.usuario = usuario;
        req.session.roles=roles;
        //si el usuario tiene un único rol
        if(usuario.Rols.length===1){
          console.log(usuario.Rols[0])
        switch(usuario.Rols[0].nombre){
          case "Paciente": return res.redirect(`/pacientes`);
          case "Recepcionista":return res.redirect(`/admins`);
          case "Tecnico":return res.redirect(`/vistaTecBioq/inicio`);
          case "Bioquimico":return res.redirect(`/vistaTecBioq/inicio`);
        }
    }     } 
    catch(error){
      console.log(error)
      return res.status(500).render("error",{error})
    }
  }
  
  
  const registro=async(req,res)=>{
    console.log("----------------------------------------------------------");
    console.log(req.body);
   const{documento,pass,nickName}=req.body;
       try{
           const usuario = await Usuario.findOne({
               where: { documento },
               
             });

         if(!usuario)return res.render("login/index")

         const salt=bcryptjs.genSaltSync();
         usuario.pass=bcryptjs.hashSync(pass,salt);
         usuario.nickName=nickName;
         await usuario.save(); 
         return res.render("login/index",{msg:"Ahora podés loguearte"})
       }
       catch(error){
        console.log(error);
           return res.status(500).render("error",{error})
       }
     
   }


   const salir=(req,res)=>{
    
    //if(req.session.google)
    //  res.redirect('googleSignOut',{email:req.session.usuario.email})
  
    req.session.usuario = null;
    req.session.roles=null;
    res.redirect('/'); 
   }
   



module.exports={login,salir,registro} 