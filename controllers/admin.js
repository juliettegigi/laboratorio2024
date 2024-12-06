const axios = require('axios');

const { Usuario,Paciente,sequelize,UsuarioRol,Telefono } = require('../models');




const getInicio=async(req,res)=>{
   return res.render('administrador/index')  //le respondo con la página de inicio,  

}


const getBusqueda=async(req,res)=>{
  try{  // http://localhost:3000/admins?limit=3&paciente=bog&page=3
        let{page,inputSearch,group}=req.query;
        const limit=5;
        page=parseInt(page)
        group=parseInt(group)
        let offset=page*limit-limit;
        const {rows,count}=await Usuario.getUsuariosByEmailOdniOnombre(inputSearch,limit,offset);
        console.log("rows.length: ",rows.length)
        console.log("limit- rows.length: ", limit-rows.length)
        console.log(" rows: ",rows)
        return res.render('administrador/rtaBusqueda',{inputSearch,
                                         usuarios:rows,
                                         limit,
                                         totalRegistros:count,
                                         page,
                                         PAGES_CANTIDADxGRUPO:3,
                                         group})
  }catch(error){  console.log(error)
                  return res.render('administrador/rtaBusqueda',{error:error.message})
    } 
}



const getForm=async(req,res)=>{
    const url = 'https://apis.datos.gob.ar/georef/api/provincias';
  
    try {
      const rta = await axios.get(url);
      const provincias = rta.data.provincias;
      return res.render('administrador/form',{provincias})
    } catch (error) {
      console.error('Error en api provincias:', error.message);
      return res.render('administrador/form')
    };



    
}


const getPaciente=async(req,res)=>{
  try {
    const {usuarioId}=req.params;
    
    const usuario = await Usuario.findByPk(usuarioId,{ attributes: { exclude: ['password'] },});
    if(usuario){
      const paciente= await Paciente.findOne({ where: { usuarioId:usuario.id } });
      return res.render('administrador/clickPaciente',{usuario,paciente,telefonos:await usuario.getTelefonos()})
    }
  } catch (error) {
    console.error(error);
    return res.render('administrador/clickPaciente')
  };



  
}


const editarPaciente=async(req,res)=>{
  const transaction = await sequelize.transaction();
  try {
    const {usuarioId}=req.params;
    console.log(req.body);
    const {email,nombre,apellido,documento,
           sexo,nacimiento, embarazada, provincia, localidad, direccion,
           telefono}=req.body
    const [updatedRows1]=await Usuario.update({email,nombre,apellido,documento}, {where:{id:usuarioId}},{ transaction });
    const [updatedRows2]=await Paciente.update({sexo,nacimiento, embarazada:embarazada=='on'?1:0, provincia, localidad, direccion}, {where:{usuarioId}},{ transaction });
    const [updatedRows3]=await Telefono.update({numero:telefono}, {where:{usuarioId}},{ transaction });
    await transaction.commit();
    return res.render('administrador/rtaRegistrar', { alertType: 'success', alertMessage: 'Registro editado.' })
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    return res.render('administrador/rtaRegistrar', { alertType: 'danger', alertMessage: 'Error: error al editar.' })
  };



  
}


const crearPaciente=async(req,res)=>{
  
  const transaction = await sequelize.transaction();
    try {
        console.log(req.body);
        const {email,nombre,apellido,documento,
               sexo,nacimiento, embarazada, provincia, localidad, direccion,
               telefono}=req.body
        
      const nuevoUsuario = await Usuario.create({email,nombre,apellido,documento},
                                                { transaction });
      console.log(nuevoUsuario)
      console.log('------------------------------------------------');
      console.log(nuevoUsuario.id)
      const usuarioId=nuevoUsuario.id;
      await Paciente.create({UsuarioId:usuarioId,nacimiento, embarazada:embarazada?1:0, provincia, localidad, direccion,sexo},
                            { transaction }) 
      
      await Telefono.create({UsuarioId:usuarioId,numero:telefono,descripcion:"propio"},
                            { transaction })
      await UsuarioRol.create({UsuarioId:usuarioId,RolId:1},
                            { transaction })
        
      await transaction.commit();
      return res.render('administrador/rtaRegistrar', { alertType: 'success', alertMessage: 'Registro creado' })

    } catch (error) {
      try{
           await transaction.rollback();
           if(error.parent.code==='ER_DUP_ENTRY')
              return res.render('administrador/rtaRegistrar',{ alertType: 'danger', alertMessage: 'El correo ingresado ya se encuentra registrado.' })
           else
            return res.render('administrador/rtaRegistrar',{ alertType: 'danger', alertMessage: error.errors.message })
          }catch(error){
            return res.render('administrador/rtaRegistrar',{ alertType: 'danger', alertMessage:'Error: no se ha podido crear el registro. ' })
          }
    };



    
}



module.exports={
    getBusqueda,
    getInicio,
    getForm,
    getPaciente,
    crearPaciente,
    editarPaciente
}