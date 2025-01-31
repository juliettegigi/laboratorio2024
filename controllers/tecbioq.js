const { Op } = require('sequelize');

const {
  Determinacion,Examen,ExCategDeterminacion,ExamenCategoria,
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
                                            {include: [{model: Muestra},]},
                                           );
      const muestras= await Muestra.findAll();  
      const categorias=await examen.getExamenCategoria({include: [{model: ExCategDeterminacion,
                                                                  include: [{ model: Determinacion }]},]
                                                                },);
       return res.render('tecBioq/addCategDet',{ muestras,
         examen,
         categorias
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
   try {

      const {id}=req.params;
     console.log(req.body)
    
     return res.redirect(`http://localhost:3000/tecBioq/examen/${id}`)

   } catch (error) {
     console.error(error);
     return res.redirect(`http://localhost:3000/tecBioq/examen/${id}`)
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

 module.exports={
  deleteCategoria,
  getAddCategDet,
  getExamen,
  getInicio,
  getFormExamen,
  postCategDet,
  postExamen,
  putExamen,
 }