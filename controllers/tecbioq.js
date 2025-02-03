const { Op } = require('sequelize');

const {
  Determinacion,Examen,ExCategDeterminacion,ExamenCategoria,ExCategParametro,Parametro,
  Muestra,sequelize,
   } = require('../models');

const getInicio=async(req,res)=>{

   try{  // http://localhost:3000/admins/busqueda/?limit=3&paciente=bog&page=3
      let{page=1,inputSearch="",group=1}=req.query;
      const limit=5;
      page=parseInt(page)
      group=parseInt(group)
      let offset=page*limit-limit;
      const { count, rows } = await Examen.findAndCountAll({
         where:{ [Op.or]: [{ nombre: { [Op.regexp]: inputSearch } },
                                         { codigo: { [Op.regexp]: inputSearch } }
                                       ]
                              } ,
         limit, 
         offset, 
         order: [['nombre', 'ASC']], 
       });
      return res.render('tecBioq/index',{inputSearch,
                                       examenes:rows,
                                       limit,
                                       totalRegistros:count,
                                       page,
                                       PAGES_CANTIDADxGRUPO:3,
                                       group})
}catch(error){  console.log(error)
                return res.render('tecBioq/index')
  } 
   
 }
const getFormExamen=async(req,res)=>{
    const muestras= await Muestra.findAll();
    return res.render('tecBioq/addExamen',{muestras}) 
 
 }

 const postExamen=async(req,res)=>{
   console.log('------------------------------------------------');
   console.log(req.body)
   
   
   const transaction = await sequelize.transaction();
   try {
      const {nombre,codigo,tags,tiempoProcesamiento,laboratorioQueLoRealiza,MuestraId}=req.body
      // inserto en la tabla examenes
      const nuevoExamen = await Examen.create({MuestraId,codigo,nombre,tags,tiempoProcesamiento,laboratorioQueLoRealiza},
         { transaction });
         const categorias=(req.body.categorias 
            && Array.isArray(req.body.categorias ))
            ?req.body.categorias
            :[req.body.categorias];
      

      // hago un arreglo de determinaciones de cada caregoria
      const arrDetId = Object.keys(req.body)
      .filter((key) => /^determinaciones-\d+Id$/.test(key)) 
      .map((key) => Array.isArray(req.body[key]) ? req.body[key] : [req.body[key]]);       


   //  inserto cada categoria del examen en la tabla ExamenCategoria
   let index=0;
   console.log('------------------------------------------------ARR');
   console.log(arrDetId)
   for(let nombre of categorias){
      const exCateg = await ExamenCategoria.create({ExamenId:nuevoExamen.id, nombre }, { transaction });
      console.log('------------------------------------------------ IDDDDDDDDDDD');
      console.log(exCateg.id)
      // cada categoria la relaciono con sus determinaciones
      for(let DeterminacionId of arrDetId[index]){
              await ExCategDeterminacion.create(
               { ExamenCategoriaId: exCateg.id, DeterminacionId },
               { transaction }
             );
            }   
      index++;
   }

      
        
            
      
      await transaction.commit();
      return res.render('tecBioq/index');
     }catch (error) {
           await transaction.rollback()
           
           console.log(error)
           return res.render('tecBioq/index');
    };


}

 

const getExamen=async(req,res)=>{
  try {
    const {id}=req.params;
    const examen = await Examen.findByPk(  id,
                                          {include: [{model: Muestra},]},
                                         );
    const muestras= await Muestra.findAll();                                     
    if(examen){
      return res.render('tecBioq/clickExamen',{ muestras,
                                                examen,
                                                      })
    }
  } catch (error) {
    console.error(error);
    return res.render('tecBioq/clickExamen')
  };



  
}




const getAddCategDet=async(req,res)=>{
   try {
      const {id}=req.params;
      const examen = await Examen.findByPk(  id,
                                           );
      const categorias=await examen.getExamenCategoria({include: [{model: ExCategDeterminacion,
                                                                  include: [{ model: Determinacion }]},
                                                                  {model: ExCategParametro,
                                                                  include: [{ model: Parametro }]
                                                                  }
                                                                ]
                                                                },);


       return res.render('tecBioq/addCategDet',{ 
         examen,
         categorias
               })
     
   } catch (error) {
     console.error(error);
     return res.render('tecBioq/clickExamen')
   };
 
 
 
   
 }



 const getAddCategParam=async(req,res)=>{
  try {
     const {id}=req.params;
     const examen = await Examen.findByPk(  id,
                                          );
     const categorias=await examen.getExamenCategoria({include: [{model: ExCategParametro,
                                                                 include: [{ model: Parametro }]},]
                                                               },);
      return res.render('tecBioq/addCategDet',{ 
        examen,
        categorias,
        param:true,
              })
    
  } catch (error) {
    console.error(error);
    return res.render('tecBioq/clickExamen')
  };
}




const putExamen=async(req,res)=>{
   try {
     console.log(req.body)
     const{id,nombre,codigo,tags,MuestraId,tiempoProcesamiento,laboratorioQueLoRealiza}=req.body;
     await Examen.update( {nombre,codigo,tags,MuestraId,tiempoProcesamiento,laboratorioQueLoRealiza},
                          { where: { id} }
                        )
     return res.redirect(`http://localhost:3000/tecBioq/examen/${id}`)

   } catch (error) {
     console.error(error);
     return res.redirect(`http://localhost:3000/tecBioq/examen/${id}`)
   };
 
 
 
   
 }
 

 const postCategDet=async(req,res)=>{
  const transaction = await sequelize.transaction();
  const {id}=req.params;
   try {

     console.log(req.body)
     const categorias=Array.isArray(req.body.categorias)?  req.body.categorias
                                                        :  [req.body.categorias];
    let i=0;
    for(let nombre of categorias){
      const exCateg=await ExamenCategoria.create({ExamenId:id,nombre},
                                   { transaction })
      const detId=Array.isArray(req.body[`${i}`]) ? req.body[`${i}`]
                                                  : [req.body[`${i}`]]
      for (let id2 of detId){
            await ExCategDeterminacion.create({ExamenCategoriaId:exCateg.id,DeterminacionId:parseInt(id2)},
                                              { transaction })
      }     
      i++;                        
    } 

    

    await transaction.commit();
     return res.redirect(`http://localhost:3000/tecBioq/examen/${id}/addCategDet`)

   } catch (error) {
     console.error(error);
     await transaction.rollback();
     return res.redirect(`http://localhost:3000/tecBioq/examen/${id}/addCategDet`)
   };
 
 
 
   
 }



const deleteCategoria=async(req,res)=>{
   try {
    console.log("wwwwwwwwwwwwwwwwwwwwww")
     const {id,examenId}=req.params;
     await ExamenCategoria.destroy({where:{id}})
     return res.redirect(`http://localhost:3000/tecBioq/examen/${examenId}/addCategDet`)
   }catch(error){
     console.error(error)
    }
}


const deleteCategDet=async(req,res)=>{
   try {
    console.log("wwwwwwwwwwwwwwwwwwwwww")
     const {DeterminacionId,ExamenCategoriaId,examenId}=req.params;
     await ExCategDeterminacion.destroy({where:{DeterminacionId}})
     return res.redirect(`http://localhost:3000/tecBioq/examen/${examenId}/addCategDet`)
   }catch(error){
     console.error(error)
    }
}



const deleteCategParam=async(req,res)=>{
  try {
   console.log("wwwwwwwwwwwwwwwwwwwwww")
    const {ParametroId,ExamenCategoriaId,examenId}=req.params;
    await ExCategParametro.destroy({where:{ParametroId}})
    return res.redirect(`http://localhost:3000/tecBioq/examen/${examenId}/addCategDet`)
  }catch(error){
    console.error(error)
   }
}


const putCateg=async(req,res)=>{
  try {
    console.log("eeeee")
    const{id,examenId}=req.params;
    console.log(id);
    console.log(req.body.nombre);
    await ExamenCategoria.update( {nombre:req.body.nombre},
                                  { where: { id}})

    return res.redirect(`http://localhost:3000/tecBioq/examen/${examenId}/addCategDet`)

  } catch (error) {
    console.error(error);
    return res.redirect(`http://localhost:3000/tecBioq/examen/${id}`)
  };



  
}



const postDetCateg=async(req,res)=>{
   try {

     console.log("Eeeeesssss")
     console.log(req.body)
     const{ExamenCategoriaId,ExamenId}=req.params;
     const detId=Array.isArray(req.body.detId)?  req.body.detId
                                              :  [req.body.detId];

     console.log(ExamenCategoriaId)
     
     for(let id of detId){
       await ExCategDeterminacion.create({ExamenCategoriaId,
                                          DeterminacionId:id})
    }
     return res.redirect(`http://localhost:3000/tecBioq/examen/${ExamenId}/addCategDet`)

   } catch (error) {
     console.error(error);
   
     return res.redirect(`http://localhost:3000/tecBioq/examen/${id}/addCategDet`)
   };
 
 
 
   
 }


 module.exports={
  deleteCategoria,
  deleteCategDet,
  deleteCategParam,
  getAddCategDet,
  getAddCategParam,
  getExamen,
  getInicio,
  getFormExamen,
  postCategDet,
  postDetCateg,
  postExamen,
  putExamen,
  putCateg,
 }