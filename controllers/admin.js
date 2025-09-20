const path = require('path');
const axios = require('axios');
const PdfMake=require('pdfmake')

const { Op } = require('sequelize');

const {
  MuestraRequerida,
  Usuario,
  Paciente,
  sequelize,
  UsuarioRol,
  Telefono,
  Medico,
  Orden,
  OrdenAuditoria,
  OrdenEliminada, 
       OrdenExamen,
       Examen,
       Sequelize
      } = require('../models');

const ESTADO=require('../constantes/estados')




const getInicio=async(req,res)=>{
   const rta = req.flash('rta')[0];
   const roles=req.session.roles;
   return res.render('administrador/index' ,{ rta,roles })  //le respondo con la página de inicio,  

}


const getBusqueda=async(req,res)=>{
  try{  // http://localhost:3000/admins/busqueda/?limit=3&paciente=bog&page=3
        let{page,inputSearch,group}=req.query;
        const limit=5;
        page=parseInt(page)
        group=parseInt(group)
        let offset=page*limit-limit;
        const {rows,count}=await Usuario.getUsuariosByEmailOdniOnombre(inputSearch,limit,offset,{tablas:["paciente"]},false);
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
      return res.render('administrador/form',{provincias,
        origen:"getForm"
      })
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
    const {UsuarioId}=req.params;
    const rta=req.flash('rta')[0];

    //busco al paciente y le incluyo todas sus órdenes
    const paciente= await Paciente.findOne({ where: { UsuarioId },
      include:{model: Orden,
               where: {
                 EstadoId: { [Op.ne]: 3 }, // Filtra órdenes donde estado sea diferente de 3
               },
               required: false
             },
       order: [[{ model: Orden }, 'fecha', 'DESC'],
               [{ model: Orden }, 'id', 'DESC']
              ] 
   });


   if(paciente){
     const usuario = await Usuario.findByPk(paciente.UsuarioId,{ attributes: { exclude: ['password'] }, 
                                                                 include: [{ model: Telefono }]});
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
          isUrgente:orden.isUrgente,
          fecha:orden.fecha,
          muestrasRequeridas:arr2,
          examenes
        })
     }

     const telefonos=await usuario.getTelefonos();
     console.log("TELEFONOS DEL USUARIO ")
     console.log(telefonos)
      return res.render('administrador/clickPaciente',{usuario,
                                                       paciente,
                                                       telefonos,
                                                       ordenes:arr,
                                                       medicos:await Medico.findAll(),
                                                       rta,
                                                       LABORATORIOnombre:require('../constantes/laboratorio').LABORATORIOnombre
                                                       })
    }
  } catch (error) {
    console.error(error);
    return res.render('administrador/clickPaciente')
  };



  
}


const putPaciente=async(req,res)=>{
  const transaction = await sequelize.transaction();
  const {UsuarioId}=req.params;
  try {
    
    const {
           sexo,nacimiento, embarazada, provincia, localidad, direccion,edad,
           telefono}=req.body
    const usuario = await Usuario.findByPk(UsuarioId, { transaction });
    await usuario.set(req.datosActualizar);
    await usuario.save({
      transaction,
      userId: req.session.usuario.id // ✅ Esto sí llega al hook
    });

    const [updatedRows2]=await Paciente.update({sexo,nacimiento, embarazada:embarazada=='on'?1:0, provincia, localidad, direccion,edad}, 
                                               {where:{UsuarioId}, 
                                                transaction });
    const [updatedRows3]=await Telefono.update({numero:telefono}, 
                                               {where:{UsuarioId},
                                                transaction });
    await transaction.commit();
      req.flash('rta',{ 
        origen:'putPaciente',
        alertType: 'success',
        alertMessage: 'Registro editado' })
        console.log("USUARIO ID --->  ",UsuarioId)
    return res.redirect(`http://localhost:3000/admins/paciente/${UsuarioId}`)
  } catch (error) {
    console.error(error);
    await transaction.rollback();
   

    return res.redirect(`http://localhost:3000/admins/paciente/${UsuarioId}`)
  };



  
}


const crearPaciente=async(req,res)=>{
  const transaction = await sequelize.transaction();
    try {
        const {email,nombre,apellido,documento,
               sexo,nacimiento, embarazada, provincia, localidad, direccion,edad=0,
               telefono}=req.body
      let nuevoUsuario=(!req.UsuarioId)
                       ? (await Usuario.create({email:email===''?null:email,nombre,apellido,documento},
                                                { transaction , 
                                                  userId: req.session.usuario.id}))
                       :null;

      const usuarioId=nuevoUsuario? nuevoUsuario.id:req.UsuarioId;
      const paciente=await Paciente.create({UsuarioId:usuarioId,nacimiento:nacimiento===''?null:nacimiento, embarazada:embarazada?1:0, provincia, localidad,edad:edad===''?null:edad, direccion,sexo},
                            { transaction }) 
      
      await Telefono.create({UsuarioId:usuarioId,numero:telefono,descripcion:"propio"},
                            { transaction })
      await UsuarioRol.create({UsuarioId:usuarioId,RolId:1},
                            { transaction })
        
      await transaction.commit();/* 
      req.flash('rta',{ 
        origen:'crearPaciente',
        alertType: 'success',
        alertMessage: 'Persona registrada.' })
        console.log(paciente.id) */
      return res.redirect(`http://localhost:3000/admins/paciente/${usuarioId}`)

    } catch (error) {
      try{
           await transaction.rollback();
           if(error.parent.code==='ER_DUP_ENTRY')
              return res.render('administrador/rtaRegistrar',{ alertType: 'danger', alertMessage: 'El correo ingresado ya se encuentra registrado.' })
           else
            return res.render('administrador/rtaRegistrar',{ alertType: 'danger', alertMessage: error.errors.message })
          }catch(error){
            return res.render('administrador/rtaRegistrar',{ alertType: 'danger', alertMessage:'Error: no se ha podido crear el registro. ' })
          }finally{
            console.log(error)
          }
    };



    
}


const calcularFechaDeEntrega=async(ordenNueva,transaction,userId)=>{  
  
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

  ordenNueva.fechaEntrega=fechaEntrega;
  await ordenNueva.save({ transaction, userId , skipAudit: true });
}


const postOrden=async(req,res)=>{
  console.log("EB POST ORDENN")
  const transaction = await sequelize.transaction();
    try {
      // la fecha puede ser distinta a la fecha de creación del registro, porq pude haber anotado en un papel y haber cargado después
      const{PacienteId,MedicoId,DiagnosticoId,isPresuntivo,isUrgente,fecha,UsuarioId}=req.body
      const examenesId=(req.body.examenesId && Array.isArray(req.body.examenesId ))?req.body.examenesId:[req.body.examenesId];
      console.log(req.body)
      const userId= req.session.usuario.id;
      const orden=await Orden.create({PacienteId,MedicoId,DiagnosticoId,isPresuntivo:isPresuntivo==='true'?true:false,isUrgente:isUrgente?1:0,fecha},
                                     { transaction}
                                    )


       await OrdenAuditoria.create({
                  operacion: 'CREATE',
                  registroId: orden.id,
                  usuarioId: userId || null,
                  fecha: new Date()
                }, { transaction });

      let tiempoDeProcesamientoTotal=0;      
      let examenesNoRealizados=[]                              
      let promises = examenesId.map(async (ExamenId) => { 
                                                       await OrdenExamen.create({ OrdenId: orden.id, ExamenId,tieneResultado:0 }, { transaction });
                                                       const examen = await Examen.findByPk(ExamenId);
                                                      
                                                       tiempoDeProcesamientoTotal+=examen.tiempoProcesamiento;
                                                       if (!examen) {
                                                           throw new Error(`Examen con ID ${ExamenId} no encontrado.`);
                                                       }
                                                       if(examen.laboratorioQueLoRealiza!='lab1')
                                                          examenesNoRealizados.push(examen)
                                                      return examen.getMuestra(); // Devuelve la muestra como resultado de la promesa
                                                });
      let muestrasRequeridas = await Promise.all(promises);
      orden.tiempoDeProcesamiento= tiempoDeProcesamientoTotal; 
      await orden.save({ transaction });
      // calculo la fecha de entrega
     // await calcularFechaDeEntrega(orden,transaction,userId);


      muestrasRequeridas=muestrasRequeridas.filter((muestra, index, self) => index === self.findIndex((m) => m.id === muestra.id));

      promises = muestrasRequeridas.map(async (muestra) => {
        return MuestraRequerida.create({OrdenId:orden.id,MuestraId:muestra.id,isPresentada:false},{ transaction });
      });

      await Promise.all(promises);

    if(muestrasRequeridas.length!=0){
       orden.EstadoId=ESTADO.esperandoTomaDeMuestra.id; 
    }
    else orden.EstadoId=ESTADO.analitica.id;
    await orden.save({ transaction});

     //TODO: mostrar las muestras requeridas,
     //TODO: devolver los examenes q el laboratorio no realiza,
     //TODO: decir en que fecha van a estar todos los resultados ,

      await transaction.commit();  

      req.flash('rta',{ 
        origen:'postOrden',
         alertType: 'success',
         alertMessage: 'Orden cargada.', 
         muestrasRequeridas,
       //  fechaResultados:orden.fechaEntrega,
         examenesNoRealizados })
      return res.redirect(`http://localhost:3000/admins/paciente/${UsuarioId}`)

    } catch (error) {
      console.log(error)
      await transaction.rollback();
      return res.render('administrador/index')
    };



    
}



const putOrden=async(req,res)=>{
  const transaction = await sequelize.transaction();
  console.log("en el p ut orden")
  console.log(req.body)
  try {

    // validar el estado de la orden una orden con estado "Ingresada, Esperando toma de muestra, Analítica"
    const{PacienteId,MedicoId,DiagnosticoId,isPresuntivo,fecha,ordenId,isUrgente}=req.body
      const examenesId=req.body.examenesId 
                       ?   Array.isArray(req.body.examenesId )
                           ?req.body.examenesId
                           :[req.body.examenesId]
                        :[];   


 const examenesIdNum = examenesId.map(id => Number(id));
    // ****************************************************************************************************  
    // ****************************************************************************************************  
   // si a la orden le cambio los exámenes ==> la relación orden-examen también cambia
   const ordenExamenesExistentes = await OrdenExamen.findAll({where: { ordenId }});
   
   // agrego todos los exámenes que están en el formulario
   await Promise.all(
    examenesIdNum.map(examenId => 
      OrdenExamen.findOrCreate({
        where: {
          OrdenId:ordenId,
          ExamenId:examenId
        },
        defaults: {
          OrdenId:ordenId,
          ExamenId:examenId
        },
        transaction,
      })
    )
  );

  const ordenExamenesAEliminar = ordenExamenesExistentes.filter(oe => 
  !examenesIdNum.includes(oe.ExamenId)

);

// Paso 3: elimino los que sobran
await Promise.all(
  ordenExamenesAEliminar.map(oe => oe.destroy({
    transaction
  }))
);


 // ****************************************************************************************************  
    // ****************************************************************************************************  
   // si a la orden le cambio los exámenes ==> las muestras requeridas de la orden también cambian
    const muestrasRequeridasActuales = await MuestraRequerida.findAll({
          where: { OrdenId: ordenId },
          attributes: ['id', 'MuestraId', 'isPresentada'],
          raw: true,
        });
    const muestrasRequeridasActualesIds = muestrasRequeridasActuales.map((m) => m.MuestraId);
    
    // tengo que relacionar a las muestras requeridas con los exámenes que quedaron con la orden
    const muestrasRequeridasNuevasIds = [];
    for (const examenId of examenesId) {
      const examen = await Examen.findByPk(examenId);
      if (examen) {
        const muestra = await examen.getMuestra();
        if (muestra && !muestrasRequeridasNuevasIds.includes(muestra.id)) {
          muestrasRequeridasNuevasIds.push(muestra.id);
        }
      }
    }
  
    // tengo que crear las nuevas relaciones en MuestraRequerida
     await Promise.all(
     muestrasRequeridasNuevasIds.map(muestraId => 
      MuestraRequerida.findOrCreate({
        where: {
          OrdenId:ordenId,
          MuestraId:muestraId
        },
        defaults: {
          OrdenId:ordenId,
          MuestraId:muestraId
        }
      })
    )
  );



// 4) Eliminar las relaciones que ya no deben estar
const muestrasAEliminarIds = muestrasRequeridasActualesIds.filter(
  id => !muestrasRequeridasNuevasIds.includes(id)
);

await Promise.all(
  muestrasAEliminarIds.map(muestraId =>
    MuestraRequerida.destroy({
      where: {
        OrdenId: ordenId,
        MuestraId: muestraId
      }
    })
  )
);


    const orden = await Orden.findByPk(ordenId, { transaction });
    orden.MedicoId = MedicoId;
    orden.DiagnosticoId = DiagnosticoId;
    orden.isPresuntivo = isPresuntivo;
    orden.fecha = fecha;
    orden.isUrgente = isUrgente ? 1 : 0;
    await orden.save({ transaction});

    await OrdenAuditoria.create({
      operacion: 'UPDATE',
      registroId: ordenId,
      UsuarioId: req.session.usuario.id,
      fecha: new Date()
    }, { transaction });

    const paciente=await Paciente.findByPk(PacienteId, { transaction });
    await transaction.commit(); 
    console.log("EXAMENES A ELIMINAR  44444444444")
    req.flash('rta',{ 
      origen:'putOrden',
       alertType: 'success',
       alertMessage: `Orden ${ordenId} actualizada.` })
    return res.redirect(`http://localhost:3000/admins/paciente/${paciente.UsuarioId}`)
    
  }catch(error) {
    console.log(error)
    await transaction.rollback();
    return res.render('administrador/index')
  };


}



const putMuestrasRequeridas=async(req,res)=>{
  const transaction = await sequelize.transaction();
  try{
    
    const{OrdenId,UsuarioId}=req.body
    const muestrasRequeridasIdPresentadas=(req.body.muestrasRequeridas && Array.isArray(req.body.muestrasRequeridas ))?req.body.muestrasRequeridas:[req.body.muestrasRequeridas];
    const muestrasRequeridas = await MuestraRequerida.findAll({ where: { OrdenId } });
    let  i=0;
    const promises = muestrasRequeridas.map( (muestraRequerida) => {
                                               if (muestrasRequeridasIdPresentadas.includes(muestraRequerida.id.toString())) {
                                                  i++;
                                                  return MuestraRequerida.update({ isPresentada: true },  { where: { id:muestraRequerida.id } },{ transaction });
                                               } else {
                                                   return MuestraRequerida.update({ isPresentada: false }, { where: { id:muestraRequerida.id} }, { transaction });
                                                 }
                                           });
     // si están todas las muestras presentadas ==> cambio el estaado a Analítica                                      
     if(i===muestrasRequeridas.length){
        promises.push(Orden.update({EstadoId:ESTADO.analitica.id},
         { where: { id:OrdenId } }, { transaction })
       )
     }
     await Promise.all(promises);
     await transaction.commit();  
     req.flash('rta',{ 
       origen:'putOrden',
        alertType: 'success',
        alertMessage: `Orden ${OrdenId} muestras actualizadas.` })

     return res.redirect(`http://localhost:3000/admins/paciente/${UsuarioId}`)
     }catch(error) {
      console.log(error)
      await transaction.rollback();
      return res.render('administrador/index')
    };
  
   
}


const deleteOrden=async(req,res)=>{
  const transaction = await sequelize.transaction();
  try{
    console.log("-------------------------------- DELETE ORDEN")
    console.log(req.body)
    const {OrdenId,PacienteId,motivo}=req.body
    await Orden.destroy({ where: {id: OrdenId},
                          transaction});
    await OrdenEliminada.create({OrdenId,motivo},
                                { transaction });

    await OrdenAuditoria.create({
      operacion: 'DELETE',
      registroId: OrdenId,
      usuarioId: req.session.usuario.id,
      fecha: new Date()
    }, { transaction });

    await transaction.commit();  

    req.flash('rta',{ 
      origen:'deleteOrden',
      alertType: 'success',
      alertMessage: `Registro ${OrdenId} eliminado` })

    const paciente=await Paciente.findByPk(PacienteId);
    return res.redirect(`http://localhost:3000/admins/paciente/${paciente.UsuarioId}`)

  }catch(error) {
    console.log(error)
    await transaction.rollback();
    return res.render('administrador/index')
  };


}







const getPDF=async(req,res)=>{
  
  const { ordenId, nombre, apellido, documento,personaId } = req.query;
 console.log(ordenId,personaId, nombre, apellido, documento)
  try  { 
    const today = new Date();
    const fecha=new Date().toLocaleDateString('es-ES',{
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    const hora = today.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });


    var fonts = {
        Roboto: {
            normal:path.join(__dirname,'/fonts/Roboto-Regular.ttf'),
            bold:path.join(__dirname, 'fonts/Roboto-Medium.ttf'),
            italics:path.join(__dirname, 'fonts/Roboto-Italic.ttf'),
            bolditalics: path.join(__dirname,'fonts/Roboto-MediumItalic.ttf')
        },

    };
    
    const etiquetaData = {
      numeroOrden: ordenId,
      codigoPersona: personaId,
      nombre: `${nombre} ${apellido}`,
      documento: `${documento}`,
      fechaYhora:`${fecha} ${hora}`
    };
    
    let pdfMake=new PdfMake(fonts);
    
   
    const docDefinition = {
      pageSize: { width: 113.4, height: 56.7 }, // 4x2 cm en puntos (72 DPI)
      pageMargins: [2, 2, 2, 2], // Márgenes de la etiqueta
      content: [
        { text: `Nº de Orden: ${etiquetaData.numeroOrden}`, fontSize: 8},
        { text: `Código: ${etiquetaData.codigoPersona}`, fontSize: 8},
        { text: `Nombre: ${etiquetaData.nombre}`, fontSize: 8},
        { text: `Doc: ${etiquetaData.documento}`, fontSize: 8},
        { text: `${etiquetaData.fechaYhora}`, fontSize: 8},
      ],
    };


    var pdfDoc = pdfMake.createPdfKitDocument(docDefinition,{});
   res.setHeader('Content-Disposition', 'attachment; filename="etiqueta.pdf"');
   res.setHeader('Content-Type', 'application/pdf');
   pdfDoc.pipe(res);
    pdfDoc.end();
} catch(error){
    console.log("ERROR")
    console.log(error)
}
 

}


module.exports={
    getBusqueda,
    getInicio,
    getForm,
    getFormOrden,
    getPaciente,
    getPDF,
    crearPaciente,
    postOrden,
    deleteOrden,
    putMuestrasRequeridas,
    putOrden,
    putPaciente,
}