const path = require('path');
const axios = require('axios');
const PdfMake=require('pdfmake')

const { Op } = require('sequelize');

const {
    Bioquimico,
    Diagnostico,
    Estado,
    Examen,
    Medico,
    Orden,
    OrdenExamen,
    Paciente,
    Rol,
    Tecnico,
    Telefono,
    Usuario,
    UsuarioAuditoria,
    UsuarioRol,
    sequelize,
   } = require('../models');

const ESTADO=require('../constantes/estados')




const getRegistrarUsuario=async(req,res)=>{
  const formDataUsuario = req.flash('formDataUsuario')[0] || null;
  const roles=await Rol.findAll();
  let rolesDelUsuario=null;
  if(formDataUsuario){
        rolesDelUsuario = roles.filter(rol => formDataUsuario.roles.includes(String(rol.id)))
                                 .map(rol => rol.nombre);
  }
  console.log("FORM DATA USUARIO: ",formDataUsuario)
  console.log("roles del usuario  ----->   ",rolesDelUsuario)
   return res.render('administrador2/clickRegistrarUsuario',{roles,formDataUsuario,rolesDelUsuario})  //le respondo con la página de inicio,  

}


const getBusqueda=async(req,res)=>{
  try{  
  
    let queryString=req.query.tablas?{tablas: Array.isArray(req.query.tablas)
                                            ? req.query.tablas
                                            : [req.query.tablas]
                                     }
                                    :{}
    if(req.query.roles){
        queryString.roles= Array.isArray(req.query.roles)
                         ? req.query.roles      
                         :[req.query.roles]
      }
      
    
    
        let{page=1,inputSearch="",group=1}=req.query;
        const limit=5;
        page=parseInt(page)
        group=parseInt(group)
        let offset=page*limit-limit;
   
        const {rows,count}=await Usuario.getUsuariosByEmailOdniOnombre(inputSearch,limit,offset,queryString,false);
       console.log("CAUNT: ",count)
        return res.render('administrador2/indexUsuario',{inputSearch,
                                         usuarios:rows,
                                         limit,
                                         totalRegistros:count,
                                         page,
                                         PAGES_CANTIDADxGRUPO:3,
                                         queryString,
                                         group,
                                        roles:req.session.roles
                                      })
  }catch(error){  console.log(error)
                  return res.render('administrador2/layout',{error:error.message})
    } 
}

const getOrdenes=async(req,res)=>{
  try{  
    let queryString=req.query.estados?{  estados: Array.isArray(req.query.estados)
                                              ? req.query.estados
                                              : [req.query.estados]
                                       }
                                      :{}

      console.log("QUERY STRING .........................")
      console.log(queryString)
        let{page=1,inputSearch="",group=1}=req.query;
        const limit=5;
        page=parseInt(page)
        group=parseInt(group)
        let offset=page*limit-limit;
   
        const {rows,count}=await Orden.getOrdenById(inputSearch,limit,offset,queryString,false);
    
        return res.render('administrador2/clickOrdenes',{inputSearch,
                                         queryString,
                                         ordenes:rows,
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
  const{ rol}=req.query
    try {
      const roles=await Rol.findAll();
      return res.render(`administrador2/form`,{roles,rol,origen:"getForm"})
    } catch (error) {
      console.log(error)
      return res.render('administrador2/form',{editarUsuario:false, rol})
    };    
}

const getMovements=async(req,res)=>{
  const{ UsuarioId}=req.params
    try {
          const auditorias=await UsuarioAuditoria.findAll({
                                    where: { registroId:UsuarioId },
                                    order: [['fecha', 'DESC']], 
                                     include: [ { model: Usuario, as: 'Usuario' },
                                                { model: Usuario, as: 'Registro' }
                                              ]
                                  });
      req.session.auditorias = auditorias; 
      return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
    } catch (error) {
      console.log(error)
      return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
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


const getOrden=async(req,res)=>{
  try {
      const {id}=req.params;
    const orden=  await Orden.findByPk(id,{
      paranoid: false, 
      include: [
        {
          model: Paciente,
          as:'Paciente',
          required: false,
          paranoid: false  
        },
        {
          model: Medico,
          required: false,
          paranoid: false  
        },
        {
          model: Estado,
          required: false,
          paranoid: false  
        },
        {
          model: Diagnostico,
          required: false,
          paranoid: false  
        },
        {
          model: Examen,
          required: false,
          paranoid: false  
        },
      ]
    });

    const paciente = orden.Examens

      console.log("thats okay ",id)
      console.log("PACIENTEEEEEEEE")
      console.log(paciente)
      return res.render('administrador2/clickOrden',{orden, paciente
                                                       })
    
  } catch (error) {
    console.error(error);
    return res.render('administrador/clickUsuario')
  };



  
}
const getUsuario=async(req,res)=>{
  try {

    const formDataUsuario = req.flash('formDataUsuario')[0] || null;
    const {UsuarioId}=req.params;
    const rta=req.flash('rta')[0];
    console.log("formDataUsuario -----------> ",formDataUsuario)

    const usuario=  await Usuario.findByPk(UsuarioId,{
      attributes: { exclude: ['password'] },
      paranoid: false, 
      include: [
        {
          model: Rol,
          attributes: ['nombre']
        },
        {
          model: Paciente,
          as:'Paciente',
          required: false,
          paranoid: false  
        },
        {
          model: Bioquimico,
          as:'Bioquimico',
          required: false,
          paranoid: false  
        },
        {
          model: Tecnico,
          as:'Tecnico',
          required: false,
          paranoid: false  
        },
      ]
    });

       const roles=await Rol.findAll();
      
      const rolesString = usuario.Rols.map(r => r.nombre).join(', ');
      const rolesDelUsuario = usuario.Rols.map(r => r.nombre);//[ 'Paciente' ]
      const telefonos=await usuario.getTelefonos({ paranoid: false })
      let provincias;
      try{const url = 'https://apis.datos.gob.ar/georef/api/provincias'; 
      const rtaApi = await axios.get(url);
             provincias = rtaApi.data.provincias;}
            catch(error){
              provincias=null
            }    
        const auditorias=await UsuarioAuditoria.findAll({
                                    where: { registroId:UsuarioId },
                                    order: [['fecha', 'DESC']], 
                                     include: [ { model: Usuario, as: 'Usuario' },
                                                { model: Usuario, as: 'Registro' }
                                              ]
                                  });          
      return res.render('administrador2/clickUsuario',{usuario,
                    telefonos:telefonos.length===0?null:telefonos,
                    rta,
                    editarUsuario:true,
                    roles,
                    rolesDelUsuario,
                    rolesString,
                    provincias,
                    formDataUsuario,
                    auditorias
                    })
    
  } catch (error) {
    console.error(error);
    return res.render('administrador/clickUsuario')
  };



  
}


const putBioquimico=async(req,res)=>{
  console.log(req.body)
  const transaction = await sequelize.transaction();
  const {BioquimicoId}=req.params;
  const {UsuarioId}=req.body;

  try {
    
 
    const {matricula,titulo}=req.body

    const [updatedRows2]=await Bioquimico.update({matricula,titulo}, 
                                               {where:{id:BioquimicoId},
                                                transaction,
                                                individualHooks: true, 
                                                userId: req.session.usuario.id 
                                               }
                                              );
    await transaction.commit();
      req.flash('rta',{ 
        origen:'putBioquimico',
        alertType: 'success',
        alertMessage: 'Registro editado' })
    return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
  } catch (error) {
    console.error(error);
    await transaction.rollback();
        return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
    } 
}


const putPaciente=async(req,res)=>{
  console.log(req.body)
  const {PacienteId}=req.params;
  const {UsuarioId}=req.body;
  console.log(PacienteId)
  console.log("usuarioID: ",UsuarioId)
  const transaction = await sequelize.transaction();
  try {

    const {sexo,nacimiento, embarazada, provincia, localidad, direccion,edad}=req.body
        console.log(parseInt(edad))
    const [updatedRows2]=await Paciente.update({sexo,nacimiento: nacimiento || null, embarazada:embarazada=='on'?1:0, provincia, localidad, direccion,edad:parseInt(edad) || 0}, 
                                               {where:{id:PacienteId},
                                                transaction,
                                                individualHooks: true, 
                                                userId: req.session.usuario.id 
                                               }
                                              );
        console.log("llego a este punto ------------------------")
        await transaction.commit();
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
    console.log(error)
    return res.render('administrador/rtaRegistrar', { alertType: 'danger', alertMessage: 'Error: error al editar.' })
  };  
}


const putOrden=async(req,res)=>{
  const transaction = await sequelize.transaction();
  
  try{
  console.log('------------------------------------------------ PUT ORDEN');
  console.log(req.body)
  const {id}=req.params
  const{MedicoId,DiagnosticoId,
       EstadoId,isPresuntivo,fecha,isUrgente}=req.body   
  const examenesId = req.body.examenesId
       ? (Array.isArray(req.body.examenesId) ? req.body.examenesId : [req.body.examenesId])
         .map(id => Number(id))  // Convertir a número
       : [];
     

  await Orden.update({MedicoId,DiagnosticoId, isPresuntivo,fecha,isUrgente:isUrgente?1:0,EstadoId},
        { where: { id } }, { transaction }
      )
  
  await OrdenExamen.destroy({
    where: { OrdenId:id },
    transaction,
  });
  
  const nuevasRelaciones =[] ; 
  for(let examenId of examenesId){
            nuevasRelaciones.push({ OrdenId: id, ExamenId: examenId});
        }  
  
        console.log("Relaciones a insertar:", nuevasRelaciones);
        console.log("📌 Estado de la transacción antes de bulkCreate:", transaction.finished);
  await OrdenExamen.bulkCreate(nuevasRelaciones, { transaction });
  await transaction.commit();  
    return res.redirect(`http://localhost:3000/admins2/orden/${id}`)
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    if(error.parent.code==='ER_DUP_ENTRY'){
      req.flash('rta',{ 
        origen:'putBioquimico',
        alertType: 'danger',
        alertMessage: 'Error: el email pertenece a otro usuario' })
        return res.redirect(`http://localhost:3000/admins2/${id}`)
    }

    return res.render('administrador/rtaRegistrar', { alertType: 'danger', alertMessage: 'Error: error al editar.' })
  };  
}


/* const putTecnico=async(req,res)=>{

  const transaction = await sequelize.transaction();
  const {TecnicoId}=req.params;
  try {
    
   const [updatedRows2]=await Tecnico.update({}, 
                                               {where:{id:TecnicoId},
                                                transaction,
                                                individualHooks: true, 
                                                userId: req.session.usuario.id 
                                               }
                                              );
 
                                           


  
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



  
} */
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
             
    const [updatedRows1]= await Usuario.update( req.datosActualizar, 
                                                { where: { id: UsuarioId },
                                                  transaction,
                                                  individualHooks: true, // ⚠️ Esto es clave para ejecutar beforeUpdate en cada instancia
                                                  userId: req.session.usuario.id // ⚠️ Pasamos el usuario manualmente
                                                }
                                              );                                              
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

    return res.render('administrador/rtaRegistrar', { alertType: 'danger', alertMessage: 'Error: error al editar.' })
  };  
}


const patchUsuario=async(req,res)=>{
  const {id}=req.params;
  return await patch('usuario',id,req,res)
}

const patchTecnico=async(req,res)=>{
  const {id}=req.params;
  return await patch('tecnico',id,req,res)
}
const patchBioquimico=async(req,res)=>{
  const {id}=req.params;
  return await patch('bioquimico',id,req,res)
}
const patchPaciente=async(req,res)=>{
  const {id}=req.params;
  return await patch('paciente',id,req,res) 
}

const patch=async(tabla,id,req,res)=>{
  try {
    let registro;
    const obj={ where: { UsuarioId: id }, paranoid: false};

    switch(tabla){
      case 'bioquimico':
         registro= await Bioquimico.findOne(obj);
         break;
      case 'tecnico':
        registro= await Tecnico.findOne(obj);
        break;  
      case 'usuario':
        registro= await Usuario.findOne({ where: {  id }, paranoid: false});
        break;  
      case 'paciente':
        registro= await Paciente.findOne(obj);
        break;  
    }

    if (registro.deletedAt) {
      await registro.restore({ userId: req.session.usuario.id });
    } else {
      if(tabla==='usuario')
         await registro.destroy({userId: req.session.usuario.id});
      else 
        await registro.destroy();
    }
   return res.redirect(`http://localhost:3000/admins2/${id}`)
  } catch (error) {
    console.error(error);

    return res.render('administrador/rtaRegistrar', { alertType: 'danger', alertMessage: 'Error: error al editar.' })
  };  
}



const postBioquimico=async(req,res)=>{
  const {UsuarioId}=req.body
  const transaction = await sequelize.transaction();
    try {
        const {matricula,titulo}=req.body
      await Bioquimico.create({UsuarioId,matricula,titulo},
                              { transaction, userId: req.session.usuario.id  }) 
      
        
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
const postPaciente=async(req,res)=>{
  console.log('------------------------------------------------ post paciente');
  console.log(req.body)
  const {UsuarioId}=req.body
  const transaction = await sequelize.transaction();
    try {
        const {edad,nacimiento,sexo,provincia,localidad,direccion,embarazada}=req.body
        
        await Paciente.create({UsuarioId,
                               edad:parseInt(edad) || 0,
                               nacimiento:nacimiento || null,
                               sexo,
                               provincia,
                               localidad,
                               direccion,
                               embarazada:embarazada?true:false}, 
                               { transaction, userId: req.session.usuario.id  }) 
      
        
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
  const {UsuarioId}=req.params
  console.log("UsuarioId :  ",UsuarioId)
    try {
      await Tecnico.create({UsuarioId}, 
                           { transaction, userId: req.session.usuario.id  })

      await transaction.commit();
      req.flash('rta',{ 
        origen:'postTecnico',
        alertType: 'success',
        alertMessage: 'Persona registrada.' })
      return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)

    } catch (error) {
      try{
           await transaction.rollback();
           if(error.parent.code==='ER_DUP_ENTRY')
              //,{ alertType: 'danger', alertMessage: 'El correo ingresado ya se encuentra registrado.' }
           return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
           else
           return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
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
                                                { transaction, userId: req.session.usuario.id });
      const usuarioId=nuevoUsuario.id;
      await Telefono.create({UsuarioId:usuarioId,numero:telefono,descripcion:"propio"},
                            { transaction })
      
        
      const roles=Array.isArray(req.body.roles)?req.body.roles:[req.body.roles]
      for(let rol of roles){
        await UsuarioRol.create({UsuarioId:usuarioId,RolId:rol},
          { transaction })
      }
       
      await transaction.commit();
      req.flash('rta',{ 
        origen:'postUsuario',
        alertType: 'success',
        alertMessage: 'Persona registrada.' })
      return res.redirect(`http://localhost:3000/admins2/${usuarioId}`)

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
    patchBioquimico,
    patchTecnico,
    patchPaciente,
    patchUsuario,
    getBioquimico,
    getBusqueda,
    getForm,
    getOrdenes,
    getOrden,
    getRegistrarUsuario,
    getTecnico,
    getUsuario,
    postBioquimico,
    postPaciente,
    postTecnico,
    postUsuario,
    putBioquimico,
    putOrden,
    putPaciente,
    //putTecnico,
    putUsuario,
}