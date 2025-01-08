const axios = require('axios');
const { Op } = require('sequelize');
const {OrdenEliminada, MuestraRequerida,Usuario,Paciente,sequelize,UsuarioRol,Telefono,Medico,Orden,OrdenExamen,Examen,Sequelize} = require('../models');




const getInicio=async(req,res)=>{
   return res.render('administrador/index')  //le respondo con la página de inicio,  

}


const getBusqueda=async(req,res)=>{
  try{  // http://localhost:3000/admins/busqueda/?limit=3&paciente=bog&page=3
        let{page,inputSearch,group}=req.query;
        const limit=5;
        page=parseInt(page)
        group=parseInt(group)
        let offset=page*limit-limit;
        const {rows,count}=await Usuario.getUsuariosByEmailOdniOnombre(inputSearch,limit,offset);
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


const getFormOrden=async(req,res)=>{

  try {
    return res.render('administrador/cargarOrden',{medicos:await Medico.findAll()})
  } catch (error) {
    console.error('Error ',error.message);
    return res.render('administrador/index')
  };    
}


const getPaciente=async(req,res)=>{
  try {
    const {usuarioId}=req.params;
    const rtaCargarOrden=req.flash('rtaCargarOrden')[0];
    const usuario = await Usuario.findByPk(usuarioId,{ attributes: { exclude: ['password'] },});
    if(usuario){
      
      //busco al paciente y le incluyo todas sus órdenes
      const paciente= await Paciente.findOne({ where: { UsuarioId:usuario.id },
                                               include:{model: Orden,
                                                        where: {
                                                          EstadoId: { [Op.ne]: 3 }, // Filtra órdenes donde estado sea diferente de 3
                                                        },
                                                        required: false
                                                      },
                                                order: [[{ model: Orden }, 'fecha', 'DESC']] 
                                            });
   // console.log( paciente.Ordens)
    
    const arr=[]; 
    for(let orden of paciente.Ordens){ //todas las ordenes del paciente
      const [diagnostico,medico,estado,examenes]=await Promise.all([orden.getDiagnostico(),
        orden.getMedico(),
        orden.getEstado(),
        orden.getExamens()]); 
      const arr2=[]
      for(let muestra of await MuestraRequerida.findAll({where:{OrdenId:orden.id}})){
         const m=await muestra.getMuestra();
         arr2.push({id:muestra.id,muestraId:m.id,muestra:m.nombre,isPresentada:muestra.isPresentada})
      } 

      
      arr.push({
          id:orden.id,
          diagnostico: diagnostico?.get(),
          medico: medico?.get(), 
          estado: estado?.get(),
          isPresuntivo:orden.isPresuntivo,
          fecha:orden.fecha,
          muestrasRequeridas:arr2,
          examenes
        })
     }

     
     
      return res.render('administrador/clickPaciente',{usuario,
                                                       paciente,
                                                       telefonos:await usuario.getTelefonos(),
                                                       ordenes:arr,
                                                       medicos:await Medico.findAll(),
                                                       rtaCargarOrden})
    }
  } catch (error) {
    console.error(error);
    return res.render('administrador/clickPaciente')
  };



  
}


const putPaciente=async(req,res)=>{
  const transaction = await sequelize.transaction();
  try {
    const {UsuarioId}=req.params;
    console.log(req.body);
    
    const {PacienteId,email,nombre,apellido,documento,
           sexo,nacimiento, embarazada, provincia, localidad, direccion,
           telefono}=req.body
    const [updatedRows1]=await Usuario.update({email,nombre,apellido,documento}, {where:{id:UsuarioId}},{ transaction });
    const [updatedRows2]=await Paciente.update({sexo,nacimiento, embarazada:embarazada=='on'?1:0, provincia, localidad, direccion}, {where:{UsuarioId}},{ transaction });
    const [updatedRows3]=await Telefono.update({numero:telefono}, {where:{UsuarioId}},{ transaction });
    await transaction.commit();
      req.flash('rtaCargarOrden',{ 
        origen:'putPaciente',
        alertType: 'success',
        alertMessage: 'Registro editado' })
    return res.redirect(`http://localhost:3000/admins/paciente/${PacienteId}`)
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


const calcularFechaDeEntrega=async(ordenNueva)=>{  
  
  // Sumar los tiemposDeProcesamiento de las órdenes previas, primero urgentes
  const ordenesPrevias = await Orden.findAll({
    where: {
      id: {
        [Sequelize.Op.lt]: ordenNueva.id // Obtener órdenes con id menor al de la nueva
      },
      // deletedAt: null // Excluir las órdenes que fueron eliminadas lógicamente
    },
    order: [
      ['isUrgente', 'DESC'], // Priorizar las órdenes urgentes
      ['fecha', 'ASC'] // Ordenar por fecha o cualquier campo necesario
    ]
  });
  
  const tiempoTotal = ordenesPrevias.reduce((total, orden) => {
    return total + orden.tiempoDeProcesamiento;
  }, 0);
  
  // Aquí calculas la fechaEntrega sumando el tiempoTotal a la fecha actual
  const fechaEntrega = new Date();
  fechaEntrega.setMinutes(fechaEntrega.getMinutes() + tiempoTotal); // O sumar lo que necesites (horas, días, etc.)

  await ordenNueva.update({ fechaEntrega });
}


const crearOrden=async(req,res)=>{
  console.log(req.body)
  const transaction = await sequelize.transaction();
    try {
      // la fecha puede ser distinta a la fecha de creación del registro, porq pude haber anotado en un papel y haber cargado después
      const{PacienteId,MedicoId,DiagnosticoId,isPresuntivo,isUrgente,fecha}=req.body
      const examenesId=(req.body.examenesId && Array.isArray(req.body.examenesId ))?req.body.examenesId:[req.body.examenesId];
      

      const orden=await Orden.create({PacienteId,MedicoId,DiagnosticoId,isPresuntivo:isPresuntivo==='true'?true:false,isUrgente:isUrgente==='on'?1:0,fecha},
                                     { transaction }
                                    )
      let tiempoDeProcesamientoTotal=0;      
      let examenesNoRealizados=[]                              
      let promises = examenesId.map(async (ExamenId) => { 
                                                       await OrdenExamen.create({ OrdenId: orden.id, ExamenId }, { transaction });
                                                       const examen = await Examen.findByPk(ExamenId);
                                                       tiempoDeProcesamientoTotal+=examen.tiempoProcesamiento;
                                                       if (!examen) {
                                                           throw new Error(`Examen con ID ${ExamenId} no encontrado.`);
                                                       }
                                                       if(examen.laboratorioQueLoRealiza!='lab1')
                                                          examenesNoRealizados.push(examen)
                                                      return examen.getMuestra(); // Devuelve la muestra como resultado de la promesa
                                                });
      orden.tiempoDeProcesamiento= tiempoDeProcesamientoTotal; 
      await orden.save({ transaction });
      // calculo la fecha de entrega
      calcularFechaDeEntrega(orden);


      let muestrasRequeridas = await Promise.all(promises);
      muestrasRequeridas=muestrasRequeridas.filter((muestra, index, self) => index === self.findIndex((m) => m.id === muestra.id));

      promises = muestrasRequeridas.map(async (muestra) => {
        return MuestraRequerida.create({OrdenId:orden.id,MuestraId:muestra.id,isPresentada:false},{ transaction });
      });

      await Promise.all(promises);

     // buscar las muestras requeridas
     console.log("MUESTRAS REQUERIDAS *****************************************************")
     console.log(muestrasRequeridas)
    if(muestrasRequeridas.length!=0){
       orden.EstadoId=2;  // esperando toma de muestra
    }
    else orden.EstadoId=1; //analítica
    await orden.save({ transaction });

     //TODO: mostrar las muestras requeridas,
     //TODO: devolver los examenes q el laboratorio no realiza,
     //TODO: decir en que fecha van a estar todos los resultados ,

      await transaction.commit();  
      req.flash('rtaCargarOrden',{ 
        origen:'crearOrden',
         alertType: 'success',
         alertMessage: 'Orden cargada.', 
         muestrasRequeridas,
         fechaResultados:orden.fechaEntrega,
         examenesNoRealizados })
      return res.redirect(`http://localhost:3000/admins/paciente/${PacienteId}`)

    } catch (error) {
      console.log(error)
      await transaction.rollback();
      return res.render('administrador/index')
    };



    
}



const putOrden=async(req,res)=>{
  console.log(req.body)
  const transaction = await sequelize.transaction();
  try {

    // validar el estado de la orden una orden con estado "Ingresada, Esperando toma de muestra, Analítica"
    const{PacienteId,MedicoId,DiagnosticoId,isPresuntivo,fecha,ordenId}=req.body
    const examenesId=(req.body.examenesId && Array.isArray(req.body.examenesId ))?req.body.examenesId:[req.body.examenesId];
    const muestrasRequeridasIdPresentadas=(req.body.muestrasRequeridas && Array.isArray(req.body.muestrasRequeridas ))?req.body.muestrasRequeridas:[req.body.muestrasRequeridas];
    await Orden.update({MedicoId,DiagnosticoId, isPresuntivo,fecha},
      { where: { id:ordenId } }, { transaction }
    )

   const muestrasRequeridas = await MuestraRequerida.findAll({ where: { OrdenId: ordenId } });
   console.log('------------------------------------------------ MUESTRAS REQUERIDAS'); 
   console.log(muestrasRequeridas)
   console.log(muestrasRequeridasIdPresentadas)
   let  i=0;
   const promises = muestrasRequeridas.map( (muestraRequerida) => {
    console.log("to string  ",muestraRequerida.id.toString())
                                              if (muestrasRequeridasIdPresentadas.includes(muestraRequerida.id.toString())) {
                                                console.log("entro")
                                                 i++;
                                                 return MuestraRequerida.update({ isPresentada: true },  { where: { id:muestraRequerida.id } },{ transaction });
                                              } else {
                                                  return MuestraRequerida.update({ isPresentada: false }, { where: { id:muestraRequerida.id} }, { transaction });
                                                }
                                          });
    // si están todas las muestras presentadas ==> cambio el estaado a Analítica                                      
    if(i===muestrasRequeridas.length){
       promises.push(Orden.update({EstadoId:2},
        { where: { id:ordenId } }, { transaction })
      )
    }
    await Promise.all(promises);
    await transaction.commit();  
    return res.redirect(`http://localhost:3000/admins/paciente/${PacienteId}`)
    
  }catch(error) {
    console.log(error)
    await transaction.rollback();
    return res.render('administrador/index')
  };


}


const deleteOrden=async(req,res)=>{
  const transaction = await sequelize.transaction();
  try{
    console.log('------------------------------------------------ DELETE');
    console.log(req.body)
    const {OrdenId,PacienteId,motivo}=req.body
    await Orden.destroy({ where: {id: OrdenId},
                          transaction});
    await OrdenEliminada.create({OrdenId,motivo},
                                { transaction });
    await transaction.commit();  
    return res.redirect(`http://localhost:3000/admins/paciente/${PacienteId}`)

  }catch(error) {
    console.log(error)
    await transaction.rollback();
    return res.render('administrador/index')
  };


}
module.exports={
    getBusqueda,
    getInicio,
    getForm,
    getFormOrden,
    getPaciente,
    crearPaciente,
    crearOrden,
    deleteOrden,
    putPaciente,
    putOrden
}