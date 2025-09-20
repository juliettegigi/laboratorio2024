const Sequelize = require('sequelize');
const bcryptjs=require('bcryptjs');

const {Usuario,Rol,Paciente}=require("../models");
const { googleVerify } = require('./validaciones');
const guardarRoles = require('../helpers/guardar-roles');







const login=async(req,res)=>{  
try{   
  let usuario={}; 
  const authHeader = req.headers['authorization'];
  
  // si se auth con google
  if (authHeader) { 
    //obtengo el token
    const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({
            error: true,
            msg: 'Token missing'
          });
        }
    // obtengo el email 
    const {email}=await googleVerify(token);
    // busco al usuario en mi base de datos
    usuario=await Usuario.findOne({where:{email}, include:[{ model: Rol},{ model: Paciente, as: 'Paciente'  }]});
    if(!usuario){
      return res.status(404).json({
        error: true,
        msg: "Para poder ingresar con Google, primero debe registrarse presencialmente en el sistema"
      });
    }
    req.session.google=true;   
  }
  else{  //si no se auth con google
    //en el body recibo el nick name, la pass 
    let {nickName,pass}=req.body;
    //busco al usuario en mi base de datos
    usuario=await Usuario.findOne({where:{nickName}, include: [{model: Rol}]});
    if(!usuario)return res.render("login/index",{error:true,msg:"Para poder ingresar, primero debe registrarse presencialmente en el sistema"});
    // tengo que ver si la contraseña es correcta
    const passValida=await bcryptjs.compare(pass,usuario.pass);
    if(!passValida) return res.render("login/index",{error:true,msg:"Los datos ingresados son incorrectos"});
    req.session.google=false;
  }
        guardarRoles(req,res,usuario)
        //si el usuario tiene un único rol
        if(usuario.Rols.length>0){
          console.log("ROL---------------------")
          console.log(usuario.Rols[0].nombre)
        switch(usuario.Rols[0].nombre){
          case "Paciente": return res.redirect(`/pacientes`);
          case "Recepcionista":return res.redirect(`/admins`);
          case "Administrativo":return res.redirect(`/admins2`);
          case "Técnico":return res.redirect(`/tecBioq/`);
          case "Bioquímico":return res.redirect(`/tecBioq/`);
        }
    }     } 
    catch(error){
      console.log(error)
      return res.status(500).render("error",{error})
    }
  }
  
  
  const registro=async(req,res)=>{
   const{documento,pass,nickName}=req.body;
       try{
           const usuario = await Usuario.findOne({
               where: { documento },
               
             });

         if(!usuario)return res.redirect("login/index",
          {registro:true,ruta:'/?_method=put',title:"Registro",msg:"No hay registro del DNI ingresado."})
          const nick = await Usuario.findOne({
            where: {nickName:null,documento},
            
          });

          if(nick) {
            const nick2 = await Usuario.findOne({
              where: {nickName},
              
            });
            if(nick2)
             return res.render("login/index",{registro:true,ruta:'/?_method=put',title:"Registro",msg:"El nombre de usuario ya está en uso."})
          }
          else{
            return res.render("login/index", {error:true,title:"Iniciar sesión",msg:"Ya posee un nombre de usuario."})
          }
         
         const salt=bcryptjs.genSaltSync();
         usuario.pass=bcryptjs.hashSync(pass,salt);
         usuario.nickName=nickName;
         await usuario.save(); 
         return res.render("login/index",{title:"Iniciar sesión",msg:"Ahora podés loguearte"})
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