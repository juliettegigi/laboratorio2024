const path = require('path');
const axios = require('axios');
const PdfMake=require('pdfmake')

const { Op } = require('sequelize');

const {
    Bioquimico,
    Examen,
    Medico,
    MuestraRequerida,
    Orden,
    OrdenEliminada,
    OrdenExamen,
    Rol,
    Telefono,
    Usuario,
    UsuarioRol,
    sequelize,
    Sequelize} = require('../models');

const ESTADO=require('../constantes/estados')




const getInicio=async(req,res)=>{
   return res.render('administrador2/layout')  //le respondo con la página de inicio,  

}


const getBusqueda=async(req,res)=>{
  try{  
        let{page=1,inputSearch="",group=1,rol='Bioquímico'}=req.query;
        const limit=5;
        page=parseInt(page)
        group=parseInt(group)
        let offset=page*limit-limit;
     console.log('--------------------ROL')
     console.log(rol)

        const {rows,count}=await Usuario.getUsuariosByEmailOdniOnombre(inputSearch,limit,offset,rol);
        let vista;
        switch(rol){
           case 'Técnico':vista='administrador2/indexTecnico' 
                            break;
           default: vista='administrador2/layout'
        }
        console.log("antes de render")
        console.log(vista)
        return res.render(vista,{inputSearch,
                                         usuarios:rows,
                                         limit,
                                         totalRegistros:count,
                                         page,
                                         PAGES_CANTIDADxGRUPO:3,
                                         group})
  }catch(error){  console.log(error)
                  return res.render('administrador2/layout',{error:error.message})
    } 
}



const getForm=async(req,res)=>{
    try {
      return res.render('administrador2/form',{
        origen:"getForm"
      })
    } catch (error) {
      return res.render('administrador2/form',{editarBioquimico:false})
    };    
}

const getRegistrarTecnico=async(req,res)=>{
    try {
      return res.render('administrador2/form',{
        origen:"getForm"
      })
    } catch (error) {
      return res.render('administrador2/form',{editarBioquimico:false})
    };    
}




const getBioquimico=async(req,res)=>{
  try {
      const {UsuarioId}=req.params;
    const rta=req.flash('rta')[0];
     
    const bioquimico= await Bioquimico.findOne({ where: { UsuarioId },
     
   });
   if(bioquimico){
     const usuario = await Usuario.findByPk(bioquimico.UsuarioId,{
      attributes: { exclude: ['password'] },
      include: {
        model: Rol, 
        attributes: ['nombre'] 
      }});
       const roles=await Rol.findAll();
      const rolesUsuario=await usuario.getRols()
      const rolesString = rolesUsuario.map(r => r.nombre).join(', ');
      return res.render('administrador2/clickBioquimico',{usuario,
                                                       bioquimico,
                                                       telefonos:await usuario.getTelefonos(),
                                                       rta,
                                                       editarBioquimico:true,
                                                       oculto:true,
                                                       roles,
                                                       rolesUsuario,
                                                       rolesString
                                                       })
    }
    
    return res.render('administrador2/clickBioquimico')
  } catch (error) {
    console.error(error);
    return res.render('administrador/clickBioquimico')
  };



  
}


const putBioquimico=async(req,res)=>{
  console.log(req.body)
  const transaction = await sequelize.transaction();
  const {UsuarioId}=req.params;
  console.log("UsuarioId*** ",UsuarioId)
  try {
    
   
    const {matricula,titulo,
           telefono}=req.body
    const roles=req.body.roles?
                     Array.isArray(req.body.roles)?req.body.roles:[req.body.roles]
                :[];
    const usuario = await Usuario.findByPk(UsuarioId);
    await usuario.setRols([]);
    if (roles.length > 0) {
      const rolesSeleccionados = await Rol.findAll({ where: {id: roles }});
      await usuario.setRols(rolesSeleccionados);
    }
             
    const [updatedRows1]=await Usuario.update(req.datosActualizar, 
                                              {where:{id:UsuarioId}, transaction });
    const [updatedRows2]=await Bioquimico.update({matricula,titulo}, 
                                                 {where:{UsuarioId}, transaction });
    const [updatedRows3]=await Telefono.update({numero:telefono}, 
                                               {where:{UsuarioId}, transaction });
    await transaction.commit();
      req.flash('rta',{ 
        origen:'putBioquimico',
        alertType: 'success',
        alertMessage: 'Registro editado' })
    return res.redirect(`http://localhost:3000/admins2/bioquimico/${UsuarioId}`)
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    if(error.parent.code==='ER_DUP_ENTRY'){
      req.flash('rta',{ 
        origen:'putBioquimico',
        alertType: 'danger',
        alertMessage: 'Error: el email pertenece a otro usuario' })
        return res.redirect(`http://localhost:3000/admins2/bioquimico/${UsuarioId}`)
    }

    return res.render('administrador/rtaRegistrar', { alertType: 'danger', alertMessage: 'Error: error al editar.' })
  };



  
}


const crearBioquimico=async(req,res)=>{
  
  const transaction = await sequelize.transaction();
    try {
        const {email,nombre,apellido,documento,
               matricula,titulo,
               telefono}=req.body
      const nuevoUsuario = await Usuario.create({email,nombre,apellido,documento},
                                                { transaction });
      const usuarioId=nuevoUsuario.id;
      await Bioquimico.create({UsuarioId:usuarioId,matricula,titulo},
                            { transaction }) 
      
      await Telefono.create({UsuarioId:usuarioId,numero:telefono,descripcion:"propio"},
                            { transaction })
      await UsuarioRol.create({UsuarioId:usuarioId,RolId:2},
                            { transaction })
        
      await transaction.commit();
      req.flash('rta',{ 
        origen:'crearBioquimico',
        alertType: 'success',
        alertMessage: 'Persona registrada.' })
      return res.redirect(`http://localhost:3000/admins2/bioquimico/${usuarioId}`)

    } catch (error) {
      try{
           await transaction.rollback();
           if(error.parent.code==='ER_DUP_ENTRY')
              //,{ alertType: 'danger', alertMessage: 'El correo ingresado ya se encuentra registrado.' }
              return res.redirect('http://localhost:3000/admins2')
           else
            return res.render('admins2',{ alertType: 'danger', alertMessage: error.errors.message })
          }catch(error){
            return res.render('admins2',{ alertType: 'danger', alertMessage:'Error: no se ha podido crear el registro. ' })
          }finally{
            console.log(error)
          }
    };



    
}





module.exports={
    getBusqueda,
    getInicio,
    getForm,
    getBioquimico,
    getRegistrarTecnico,
    crearBioquimico,
    putBioquimico,
}