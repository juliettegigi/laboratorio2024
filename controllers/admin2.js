const path = require('path');
const axios = require('axios');
const PdfMake=require('pdfmake')

const { Op } = require('sequelize');

const {
    Bioquimico,
    Paciente,
    Rol,
    Tecnico,
    Telefono,
    Usuario,
    UsuarioRol,
    sequelize,
   } = require('../models');

const ESTADO=require('../constantes/estados')




const getInicio=async(req,res)=>{
   return res.render('administrador2/layout')  //le respondo con la página de inicio,  

}


const getBusqueda=async(req,res)=>{
  try{  
    const{roles,tablas}=req.query
        let{page=1,inputSearch="",group=1}=req.query;
        const limit=5;
        page=parseInt(page)
        group=parseInt(group)
        let offset=page*limit-limit;

        const {rows,count}=await Usuario.getUsuariosByEmailOdniOnombre(inputSearch,limit,offset,tablas,roles);
       /*  let vista;
        switch(rol){
           case 'Técnico':vista='administrador2/indexTecnico' 
                            break;
           default: vista='administrador2/layout'
        } */
        return res.render('administrador2/indexUsuario',{inputSearch,
                                         usuarios:rows,
                                         limit,
                                         totalRegistros:count,
                                         page,
                                         PAGES_CANTIDADxGRUPO:3,
                                         queryString: { tablas, roles },
                                         group})
  }catch(error){  console.log(error)
                  return res.render('administrador2/layout',{error:error.message})
    } 
}



const getForm=async(req,res)=>{
  const{ rol}=req.query
    try {
      const roles=await Rol.findAll();
      return res.render(`administrador2/form`,{roles,rol,origen:"getForm"})
    } catch (error) {
      console.log(error)
      return res.render('administrador2/form',{editarUsuario:false, rol})
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
                                                       editarUsuario:true,
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
const getTecnico=async(req,res)=>{
  try {
      const {UsuarioId}=req.params;
    const rta=req.flash('rta')[0];
    const tecnico= await Tecnico.findOne({ where: { UsuarioId },
     
   });
   if(tecnico){
     const usuario = await Usuario.findByPk(tecnico.UsuarioId,{
      attributes: { exclude: ['password'] },
      include: {
        model: Rol, 
        attributes: ['nombre'] 
      }});
       const roles=await Rol.findAll();
      const rolesUsuario=await usuario.getRols()
      const rolesString = rolesUsuario.map(r => r.nombre).join(', ');
      return res.render('administrador2/clickTecnico',{usuario,
                                                       telefonos:await usuario.getTelefonos(),
                                                       rta,
                                                       editarUsuario:true,
                                                       oculto:true,
                                                       roles,
                                                       rolesUsuario,
                                                       rolesString
                                                       })
    }
    
    return res.render('administrador2/clickTecnico',{rta:{alertType:'danger',alertMessage:"Usuario no encontrado"}})
  } catch (error) {
    console.error(error);
    return res.render('administrador/clickTecnico')
  };



  
}
const getUsuario=async(req,res)=>{
  try {
      const {UsuarioId}=req.params;
    const rta=req.flash('rta')[0];
    const usuario=  await Usuario.findByPk(UsuarioId,{
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Rol,
          attributes: ['nombre']
        },
        {
          model: Paciente,
          as:'Paciente',
          required: false 
        },
        {
          model: Bioquimico,
          as:'Bioquimico',
          required: false 
        },
        {
          model: Tecnico,
          as:'Tecnico',
          required: false 
        },
      ]
    });

       const roles=await Rol.findAll();
      
      const rolesString = usuario.Rols.map(r => r.nombre).join(', ');
      const rolesArray = usuario.Rols.map(r => r.nombre);//[ 'Paciente' ]
      return res.render('administrador2/clickUsuario',{usuario,
                                                       telefonos:await usuario.getTelefonos(),
                                                       rta,
                                                       editarUsuario:true,
                                                       oculto:true,
                                                       roles,
                                                       rolesArray,
                                                       rolesString
                                                       })
    
  } catch (error) {
    console.error(error);
    return res.render('administrador/clickUsuario')
  };



  
}


const putBioquimico=async(req,res)=>{
  console.log(req.body)
  const transaction = await sequelize.transaction();
  const {UsuarioId}=req.params;
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
    return res.redirect(`http://localhost:3000/admins2/bioquímico/${UsuarioId}`)
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    if(error.parent.code==='ER_DUP_ENTRY'){
      req.flash('rta',{ 
        origen:'putBioquimico',
        alertType: 'danger',
        alertMessage: 'Error: el email pertenece a otro usuario' })
        return res.redirect(`http://localhost:3000/admins2/bioquímico/${UsuarioId}`)
    }

    return res.render('administrador/rtaRegistrar', { alertType: 'danger', alertMessage: 'Error: error al editar.' })
  };



  
}
const putPaciente=async(req,res)=>{
  console.log('------------------------------------------------ PUT PACIENTE');
  console.log(req.body)
  const {UsuarioId}=req.body;
  const transaction = await sequelize.transaction();
  const {id}=req.params;  
  try {
    const {sexo,nacimiento, embarazada, provincia, localidad, direccion,edad}=req.body
    const [updatedRows2]=await Paciente.update({sexo,nacimiento, embarazada:embarazada=='on'?1:0, provincia, localidad, direccion,edad}, {where:{id}},{ transaction });
       
   
    return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    if(error.parent.code==='ER_DUP_ENTRY'){
      req.flash('rta',{ 
        origen:'putBioquimico',
        alertType: 'danger',
        alertMessage: 'Error: el email pertenece a otro usuario' })
        return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
    }

    return res.render('administrador/rtaRegistrar', { alertType: 'danger', alertMessage: 'Error: error al editar.' })
  };



  
}
const putTecnico=async(req,res)=>{

  const transaction = await sequelize.transaction();
  const {UsuarioId}=req.params;
  try {
    
   
    const {
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
    const [updatedRows3]=await Telefono.update({numero:telefono}, 
                                               {where:{UsuarioId}, transaction });
    await transaction.commit();
      req.flash('rta',{ 
        origen:'putTecnico',
        alertType: 'success',
        alertMessage: 'Registro editado' })
    return res.redirect(`http://localhost:3000/admins2/tecnico/${UsuarioId}`)
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    if(error.parent.code==='ER_DUP_ENTRY'){
      req.flash('rta',{ 
        origen:'putTecnico',
        alertType: 'danger',
        alertMessage: 'Error: el email pertenece a otro usuario' })
        return res.redirect(`http://localhost:3000/admins2/tecnico/${UsuarioId}`)
    }

    return res.render('administrador/rtaRegistrar', { alertType: 'danger', alertMessage: 'Error: error al editar.' })
  };



  
}
const putUsuario=async(req,res)=>{
  console.log('------------------------------------------------ PUT USUARIO');
  const transaction = await sequelize.transaction();
  const {UsuarioId}=req.params;
  try {
    const {telefono}=req.body
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
    const [updatedRows3]=await Telefono.update({numero:telefono}, 
                                               {where:{UsuarioId}, transaction });
    await transaction.commit();
      req.flash('rta',{ 
        origen:'putUsuario',
        alertType: 'success',
        alertMessage: 'Registro editado' })
    return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    if(error.parent.code==='ER_DUP_ENTRY'){
      req.flash('rta',{ 
        origen:'putTecnico',
        alertType: 'danger',
        alertMessage: 'Error: el email pertenece a otro usuario' })
        return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
    }

    return res.render('administrador/rtaRegistrar', { alertType: 'danger', alertMessage: 'Error: error al editar.' })
  };



  
}


const postBioquimico=async(req,res)=>{
  const {UsuarioId}=req.body
  const transaction = await sequelize.transaction();
    try {
        const {matricula,titulo}=req.body
      await Bioquimico.create({UsuarioId,matricula,titulo},
                            { transaction }) 
      
        
      await transaction.commit();
      req.flash('rta',{ 
        origen:'postBioquimico',
        alertType: 'success',
        alertMessage: 'Persona registrada.' })
      return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)

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


const postTecnico=async(req,res)=>{
  
  const transaction = await sequelize.transaction();
    try {
        const {email,nombre,apellido,documento,
               telefono}=req.body
      const nuevoUsuario = await Usuario.create({email,nombre,apellido,documento},
                                                { transaction });
      const usuarioId=nuevoUsuario.id;
      await Tecnico.create({UsuarioId:usuarioId},
                            { transaction }) 
      await Telefono.create({UsuarioId:usuarioId,numero:telefono,descripcion:"propio"},
                            { transaction })
      await UsuarioRol.create({UsuarioId:usuarioId,RolId:3},
                            { transaction })
        
      await transaction.commit();
      req.flash('rta',{ 
        origen:'postTecnico',
        alertType: 'success',
        alertMessage: 'Persona registrada.' })
      return res.redirect(`http://localhost:3000/admins2/tecnico/${usuarioId}`)

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

const postUsuario=async(req,res)=>{
  const transaction = await sequelize.transaction();
    try {
        const {email,nombre,apellido,documento,
               telefono}=req.body
      const nuevoUsuario = await Usuario.create({email,nombre,apellido,documento},
                                                { transaction });
      const usuarioId=nuevoUsuario.id;
      await Telefono.create({UsuarioId:usuarioId,numero:telefono,descripcion:"propio"},
                            { transaction })
      
        
      const {rol}=req.query
      switch(rol){
      case 'Técnico':await Tecnico.create({UsuarioId:usuarioId},
                            { transaction })  
                     await UsuarioRol.create({UsuarioId:usuarioId,RolId:3},
                       { transaction })      
                            break;
      case 'Bioquímico':
        const{matricula,titulo}=req.body;
        await Bioquimico.create({UsuarioId:usuarioId,matricula,titulo},
          { transaction }) ;
        break;
      }
       
      await transaction.commit();
      req.flash('rta',{ 
        origen:'postTecnico',
        alertType: 'success',
        alertMessage: 'Persona registrada.' })
      return res.redirect(`http://localhost:3000/admins2/${rol}/${usuarioId}`)

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
    getTecnico,
    getUsuario,
    postBioquimico,
    postTecnico,
    postUsuario,
    putBioquimico,
    putPaciente,
    putTecnico,
    putUsuario,
}