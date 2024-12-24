const axios = require('axios');
const { Op } = require('sequelize');
const { MuestraRequerida,Usuario,Paciente,sequelize,UsuarioRol,Telefono,Medico,Orden,OrdenExamen,OrdenConjuntoDet,Determinacion,DeterminacionDet } = require('../models');




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
    
    const usuario = await Usuario.findByPk(usuarioId,{ attributes: { exclude: ['password'] },});
    if(usuario){
      
      //busco al paciente y le incluyo todas sus órdenes
      const paciente= await Paciente.findOne({ where: { UsuarioId:usuario.id },
                                               include:{model: Orden,
                                                        where: {
                                                          EstadoId: { [Op.ne]: 3 }, // Filtra órdenes donde estado sea diferente de 3
                                                        },
                                                        required: false
                                                      }
                                            });
    //console.log( paciente.Ordens)
     const  ordenId=paciente.Ordens.length>0? await paciente.Ordens[0].id:null;

    const arr=[]; 
     for(let orden of paciente.Ordens){ //todas las ordenes del paciente
      const [diagnostico,medico,estado,ordenExamenes,ordenConjuntoDets]=await Promise.all([orden.getDiagnostico(),
                                                            orden.getMedico(),
                                                            orden.getEstado(),
                                                          orden.getOrdenExamens(),
                                                        orden.getOrdenConjuntoDets()]); 
      const arr2=[]
      for(let muestra of await MuestraRequerida.findAll({where:{OrdenId:ordenId}})){
         const m=await muestra.getMuestra();
         arr2.push({muestra:m.nombre,isPresentada:muestra.isPresentada})
      } 

        const determinaciones = await Promise.all(
          ordenExamenes.map(ordenExamen => ordenExamen.getDeterminacion())
        );
        const conjuntoDets = await Promise.all(
          ordenConjuntoDets.map(ordenConjuntoDet => ordenConjuntoDet.getConjuntoDet())
        );
      arr.push({
          id:orden.id,
          diagnostico: diagnostico?.get(),
          medico: medico?.get(), 
          estado: estado?.get(),
          isPresuntivo:orden.isPresuntivo,
          fecha:orden.fecha,
          muestrasRequeridas:arr2,
          determinaciones,
          conjuntoDets
        })
     }

     
     
      return res.render('administrador/clickPaciente',{usuario,
                                                       paciente,
                                                       telefonos:await usuario.getTelefonos(),
                                                       ordenes:arr,
                                                       medicos:await Medico.findAll()})
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



const crearOrdenExamen=async(determinacionId,orden,transaction)=>{

    const determinacion=await Determinacion.findByPk(determinacionId);
    const existe = await determinacion.getOrdenExamens({where: {OrdenId: orden.id },transaction});
    if(existe.length===0){
      const [_,muestra]=await Promise.all([determinacion.createOrdenExamen({OrdenId:orden.id},{ transaction }),
                                           determinacion.getMuestra()
      ])

      //const existe = muestrasRequeridas.some(m => m.nombre === muestra.nombre);
     // if (!existe)   muestrasRequeridas.push(muestra) 
     const existe=await MuestraRequerida.findOne({where:{MuestraId:muestra.id ,OrdenId:orden.id}, transaction })
     if(!existe)
      await MuestraRequerida.create({OrdenId:orden.id,MuestraId:muestra.id,isPresentada:0},{transaction})
    }
   
}

const crearOrden=async(req,res)=>{
  console.log(req.body)
  const transaction = await sequelize.transaction();
    try {

      const{PacienteId,MedicoId,DiagnosticoId,isPresuntivo,fecha}=req.body
      const examenesId=(req.body.examenesId && Array.isArray(req.body.examenesId ))?req.body.examenesId:[req.body.examenesId];
      

      const orden=await Orden.create({PacienteId,MedicoId,DiagnosticoId,isPresuntivo:isPresuntivo==='true'?true:false,fecha},
                                   { transaction }
    )
   //examenesId: [ '1-conjuntoDets', '2-determinaciones' ]
   // examenesId: '1-determinaciones'
          for(let examen of examenesId){
                  const [id,tabla]=examen.split('-');
                  if(tabla==='determinaciones'){
                    await crearOrdenExamen(id, orden,transaction)

                  }
                  else { 
                    const [_,determinacionesDelConjunto]=await Promise.all([orden.createOrdenConjuntoDet({ConjuntoDetId:id},{transaction}),
                                                                           DeterminacionDet.findAll({where: {conjuntoDetId:id}})
                                                                         ]) 
                    for(let registro of determinacionesDelConjunto){
                      await crearOrdenExamen(registro.DeterminacionId, orden,transaction)                     
                    }                                                     
                  }
                
          }

     // buscar las muestras requeridas
     console.log("MUESTRAS REQUERIDAS *****************************************************")
     console.log("orden.id: ",orden.id)
    const muestrasRequeridas= await MuestraRequerida.findAll({where:{OrdenId:orden.id, isPresentada:0}, transaction})
    if(muestrasRequeridas.length!=0){
       orden.EstadoId=2;  // esperando toma de muestra
    }
    else orden.EstadoId=1; //analítica
    await orden.save({ transaction });

     //TODO: mostrar las muestras requeridas,
     //TODO: devolver los examenes q el laboratorio no realiza,
     //TODO: decir en que fecha van a estar todos los resultados ,

      await transaction.commit();  
      return res.render('administrador/index')

    } catch (error) {
      console.log(error)
      await transaction.rollback();
      return res.render('administrador/index')
    };



    
}



const putOrden=async(req,res)=>{
  console.log(req.body)
//  const transaction = await sequelize.transaction();
  return res.render('administrador/index')


}

module.exports={
    getBusqueda,
    getInicio,
    getForm,
    getFormOrden,
    getPaciente,
    crearPaciente,
    crearOrden,
    editarPaciente,
    putOrden
}