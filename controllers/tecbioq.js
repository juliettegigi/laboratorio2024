const { Op } = require('sequelize');

const {
  Determinacion,DeterminacionPadre,DeterminacionUnidad,DeterminacionValorReferencia,
  Examen,ExCategDeterminacion,ExamenCategoria,ExCategParametro,Parametro,
  Muestra,
  Unidad,sequelize,
   } = require('../models');
const { post } = require('../routes/tecbioq');

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



 const getInicioDeterminaciones=async(req,res)=>{

  try{  // http://localhost:3000/admins/busqueda/?limit=3&paciente=bog&page=3
     let{page=1,inputSearch="",group=1}=req.query;
     const limit=5;
     page=parseInt(page)
     group=parseInt(group)
     let offset=page*limit-limit;
     const { count, rows } = await Determinacion.findAndCountAll({
        where:{ [Op.or]: [{ nombre: { [Op.regexp]: inputSearch } },
                          { codigo: { [Op.regexp]: inputSearch } },
                          { tags: { [Op.regexp]: inputSearch } }
                                      ]
                             } ,
        limit, 
        offset, 
        order: [['nombre', 'ASC']], 
      });
     return res.render('tecBioq/indexDeterminacion',{inputSearch,
                                      determinaciones:rows,
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

const putDet=async(req,res)=>{
  console.log('------------------------------------------------aaaaaaaaa');
  console.log(req.body)
  
  
  const transaction = await sequelize.transaction();
  try {
      const {nombre,codigo,tags,id,unidad}=req.body
      const unidades=req.body.unidades?(Array.isArray(req.body.unidades)? req.body.unidades
                                                                        : [req.body.unidades])
                                        :[];
      const detId= req.body.detId?( Array.isArray(req.body.detId)?  req.body.detId
                                                                 : [req.body.detId])
                                 :[];              
             
                                 
       await DeterminacionUnidad.destroy({
        where: { determinacionId: id },
        transaction
      });                           
      for( let unidad of unidades){
         const u=await Unidad.findOrCreate({where:{unidad},transaction})
         await DeterminacionUnidad.create({ DeterminacionId: id, UnidadId: u[0].id },
                                                  {transaction}
                                                );                          
      }
      await Determinacion.update( {nombre,codigo,tags},
        { where: { id }, transaction }
      )

      await DeterminacionPadre.destroy({
        where: { determinacionId: id },
        transaction
      });

      const nuevasRelaciones = detId.map(padreId => ({
        determinacionId: id,
        padreId
      }));

      await DeterminacionPadre.bulkCreate(nuevasRelaciones, { transaction });

     await transaction.commit();
     return res.redirect(`http://localhost:3000/tecBioq/determinacion/${id}`);
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

const getDeterminacion=async(req,res)=>{
  try {
    const {id}=req.params;
    const determinacion = await Determinacion.findByPk(id, { paranoid: false });
    const determinacionPadre= await determinacion.getParents();   
    const vrUnidades= await determinacion.getUnidads();   
    const unidades= await Unidad.findAll({ order: [['unidad', 'ASC']]});   
    const valoresRef = await determinacion.getValoresReferencia({
      order: [
        [sequelize.Sequelize.literal("FIELD(sexo, 'F', 'M', 'A')"), 'ASC'],
        ['edadMin', 'ASC'],
        ['valorMin', 'ASC']
      ]
    });
     
    
    const vrF=[];
    const vrM=[];
    const vrA=[];

    for(let vr of valoresRef){
      switch(vr.unidadMin){
        case '-':
          vr.edadMin=0
          break;
        case 'Días':
          break;
        case 'Meses':
          vr.edadMin/=30
          break;

        case 'Años':
          vr.edadMin/=365
          break;
      }
      switch(vr.unidadMax){
        case '-':
          vr.edadMax=0
          break;
        case 'Días':
          break;
        case 'Meses':
          vr.edadMax/=30
          break;

        case 'Años':
          vr.edadMax/=365
          break;
      }
      switch(vr.sexo){
        case 'F':
              vrF.push(vr)
              break;      
        case 'M':
              vrM.push(vr)
              break;      
        case 'A':
              vrA.push(vr)
              break;      
      }
    }
    if(determinacion){
      return res.render('tecBioq/clickDeterminacion',{ 
                                                determinacion,
                                                determinacionPadre,
                                                valoresRef:{Femenino:vrF,
                                                            Masculino:vrM,
                                                            Ambos:vrA},
                                                vrUnidades,
                                                unidades
                                                      })
    }
    else{
      return res.render('tecBioq/clickDeterminacion',{ 
        msg:"Determinacion no encontrada"
              })
    }
  } catch (error) {
    console.error(error);
    return res.render('tecBioq/clickDeterminacion')
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
  /*     for(let categoria of categorias){
        console.log('------------------------------------------------ categoria nombre');   
        console.log(categoria.nombre)
        console.log('------------------------------------------------ arr de parametros');
        console.log(categoria.ExCategParametros)
        console.log('------------------------------------------------ arr de determinaaciones');
        console.log(categoria.ExCategDeterminacions)
      } */
       return res.render('tecBioq/addCategDet',{ 
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
  const transaction = await sequelize.transaction();
  const {id}=req.params;
   try {

     console.log(req.body)
     const categorias=Array.isArray(req.body.categorias)?  req.body.categorias
                                                        :  [req.body.categorias];
    let i=0;
    for(let nombre of categorias){
      console.log("i: ",i)
      
      const exCateg=await ExamenCategoria.create({ExamenId:id,nombre},
                                                 { transaction })
        console.log("paso 1",i)
      const detId=req.body[`${i}`]?Array.isArray(req.body[`${i}`]) ? req.body[`${i}`]
                                                 : [req.body[`${i}`]]
                                  : []                 
        console.log("paso 2  ---> ",detId)
      const paramId= req.body[`param-${i}`]? Array.isArray(req.body[`param-${i}`]) ? req.body[`param-${i}`]
                                                                                  : [req.body[`param-${i}`]]
                                           : []
      console.log("paso 3  -->  ",paramId)
      for (let id2 of detId){
            await ExCategDeterminacion.create({ExamenCategoriaId:exCateg.id,DeterminacionId:parseInt(id2)},
                                              { transaction })
      }     
      
      console.log("paso 5")
      for (let id3 of paramId){
            await ExCategParametro.create({ExamenCategoriaId:exCateg.id,ParametroId:parseInt(id3)},
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


const deleteDeterminacion=async(req,res)=>{
  try {
    const {id}=req.params;
    const determinacion = await Determinacion.findByPk(id, { paranoid: false });
    if(determinacion){
           if(determinacion.deletedAt){
             await determinacion.restore();
           }
           else{
             await determinacion.destroy();
           }
  }

    return res.redirect(`http://localhost:3000/tecBioq/determinacion/${id}`)
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


 const postParamCateg=async(req,res)=>{
  try {

    console.log(req.body)
    const{ExamenCategoriaId,ExamenId}=req.params;
    const detId=Array.isArray(req.body.detId)?  req.body.detId
                                             :  [req.body.detId];
    const det=Array.isArray(req.body.detId)?  req.body.det
                                             :  [req.body.det];

    console.log(ExamenCategoriaId)
    let i=0;
    for(let id of detId){
      if(id=='undefined'){
        const p=await Parametro.create({nombre:det[i]})
        id=p.id
        console.log(id)
      }
      await ExCategParametro.findOrCreate({
        where: { ExamenCategoriaId, ParametroId: id },
        defaults: { ExamenCategoriaId, ParametroId: id }
      });

      i++
   }
    return res.redirect(`http://localhost:3000/tecBioq/examen/${ExamenId}/addCategDet`)

  } catch (error) {
    console.error(error);
  
    return res.redirect(`http://localhost:3000/tecBioq/examen/${id}/addCategDet`)
  };

 }

  


const putvr=async(req,res)=>{
  const transaction = await sequelize.transaction();
  try {
    const{id}=req.body;
    
    for(let propiedad in req.body){
      req.body[`${propiedad}`]=Array.isArray(req.body[`${propiedad}`])?req.body[`${propiedad}`]:[req.body[`${propiedad}`]];
    }
    console.log('------------------------------------------------');
    console.log(req.body)
    await DeterminacionValorReferencia.destroy({
      where: { DeterminacionId: id },
      transaction
    })
    
    const arr=['Femenino','Masculino','Ambos'];
    for(let sexo of arr){
      if(req.body[`nota${sexo}`]){
        for(let i=0;i<req.body[`nota${sexo}`].length;i++){
              console.log(req.body[`edadMin${sexo}`][i])
              console.log("resultado  ",sexo," -------> ",req.body[`edadMin${sexo}`][i]*365)

             await DeterminacionValorReferencia.create({ DeterminacionId: id,
                                                         unidadMin:req.body[`unidadMin${sexo}`][i],
                                                         unidadMax:req.body[`unidadMax${sexo}`][i],                                                         
                                                         edadMin: req.body[`unidadMin${sexo}`][i]==='Meses'? (req.body[`edadMin${sexo}`][i]*30):
                                                                  (req.body[`unidadMin${sexo}`][i]==='Años'? (req.body[`edadMin${sexo}`][i]*365):
                                                                   req.body[`edadMin${sexo}`][i])
                                                         ,
                                                         edadMax:  req.body[`unidadMax${sexo}`][i]==='Meses'? (req.body[`edadMax${sexo}`][i]*30):
                                                                   (req.body[`unidadMax${sexo}`][i]==='Años'? (req.body[`edadMax${sexo}`][i]*365):
                                                                    req.body[`edadMax${sexo}`][i]),
                                                         sexo:sexo[0],
                                                         valorMin: req.body[`valorMin${sexo}`][i],
                                                         valorMax:req.body[`valorMax${sexo}`][i],
                                                         nota: req.body[`nota${sexo}`][i] 
                                                        },
                                                        {transaction})    
        }
      }

    }



    await transaction.commit();
    return res.redirect(`http://localhost:3000/tecBioq/determinacion/${id}`)

  } catch (error) {
    console.error(error);
    await transaction.rollback()
    return res.redirect(`http://localhost:3000/tecBioq/examen/${id}/addCategDet`)
  };

}







const getAddDeterminacion=async(req,res)=>{
  try {
    const unidades= await Unidad.findAll({ order: [['unidad', 'ASC']]});
    return res.render(`tecBioq/clickAddDeterminacion`,{unidades})

  } catch (error) {
    console.error(error);
    return res.redirect(`http://localhost:3000/tecBioq/`)
  };

}






const postDet=async(req,res)=>{
  const transaction = await sequelize.transaction();
  try {
    console.log('------------------------------------------------ POST DETERMINACION');
    console.log(req.body)
    const{nombre,codigo,tags}= req.body;
    const unidades=req.body.unidades?  
                       Array.isArray(req.body.unidades) ? req.body.unidades : [req.body.unidades]
                   : [];    
    const detId=req.body.detId?  
                   Array.isArray(req.body.detId) ? req.body.detId : [req.body.detId]
               : [];    

    //const unidades= await Unidad.findAll({ order: [['unidad', 'ASC']]});
    
    const determinacion=await Determinacion.create({nombre,codigo,tags},{transaction})
    
    for(let unidad of unidades){
        const u=await Unidad.findOne( { where: { unidad},transaction })
        if(u) await DeterminacionUnidad.create({DeterminacionId:determinacion.id,UnidadId:u.id},{transaction})
    }

    for(let id of detId){
      await DeterminacionPadre.create({DeterminacionId:determinacion.id,PadreId:id},{transaction})
  }




  const valoresRef = await determinacion.getValoresReferencia({
    order: [
      [sequelize.Sequelize.literal("FIELD(sexo, 'F', 'M', 'A')"), 'ASC'],
      ['edadMin', 'ASC'],
      ['valorMin', 'ASC']
    ]
  });
   
  
  const vrF=[];
  const vrM=[];
  const vrA=[];

  for(let vr of valoresRef){
    switch(vr.unidadMin){
      case '-':
        vr.edadMin=0
        break;
      case 'Días':
        break;
      case 'Meses':
        vr.edadMin/=30
        break;

      case 'Años':
        vr.edadMin/=365
        break;
    }
    switch(vr.unidadMax){
      case '-':
        vr.edadMax=0
        break;
      case 'Días':
        break;
      case 'Meses':
        vr.edadMax/=30
        break;

      case 'Años':
        vr.edadMax/=365
        break;
    }
    switch(vr.sexo){
      case 'F':
            vrF.push(vr)
            break;      
      case 'M':
            vrM.push(vr)
            break;      
      case 'A':
            vrA.push(vr)
            break;      
    }
  }
    await transaction.commit();
    return res.render(`tecBioq/addVr`,{determinacion,valoresRef:{Femenino:vrF,
      Masculino:vrM,
      Ambos:vrA}})

  } catch (error) {
    console.error(error);
    await transaction.rollback()
    return res.redirect(`http://localhost:3000/tecBioq/`)
  };

}

 module.exports={
  deleteCategoria,
  deleteCategDet,
  deleteCategParam,
  deleteDeterminacion,
  getAddCategDet,
  getDeterminacion,
  getExamen,
  getInicio,
  getInicioDeterminaciones,
  getFormExamen,
  getAddDeterminacion,
  postCategDet,
  postDet,
  postDetCateg,
  postParamCateg,
  postExamen,
  putDet,
  putvr,
  putExamen,
  putCateg,
 }