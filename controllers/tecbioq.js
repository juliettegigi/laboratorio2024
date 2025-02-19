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
      let where={}
      if(inputSearch!==""){
          where={ [Op.or]: [{ nombre: { [Op.regexp]: inputSearch } },
                            { codigo: { [Op.regexp]: inputSearch } }
                           ]
                 }
      }
      const { count, rows } = await Examen.findAndCountAll({
         where ,
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



 const  getInicioMuestras=async(req,res)=>{

  try{  
     let{page=1,inputSearch="",group=1}=req.query;
     const limit=5;
     page=parseInt(page)
     group=parseInt(group)
     let offset=page*limit-limit;
     
     let where={}
     if(inputSearch!==""){
      console.log("entrooooooooooooo")
      console.log("entrooooooooooooo")
      where={ [Op.or]: [{ nombre: { [Op.regexp]: inputSearch } },
                        { id: { [Op.regexp]: inputSearch } }
                        ]
            } 
     }
     const { count, rows } = await Muestra.findAndCountAll({
        where,
        limit, 
        offset, 
        order: [['nombre', 'ASC']], 
      });
     return res.render('tecBioq/indexMuestra',{inputSearch,
                                      muestras:rows,
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
     
     let where={}
     console.log("input search")
     console.log(inputSearch)
     if(inputSearch!==""){
      where={ [Op.or]: [{ nombre: { [Op.regexp]: inputSearch } },
                        { codigo: { [Op.regexp]: inputSearch } },
                        { tags: { [Op.regexp]: inputSearch } }
                        ]
            } 
     }
     const { count, rows } = await Determinacion.findAndCountAll({
        where,
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
   for(let nombre of categorias){
      const exCateg = await ExamenCategoria.create({ExamenId:nuevoExamen.id, nombre }, { transaction });
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
  
  const transaction = await sequelize.transaction();
  try {
      const {nombre,codigo,tags,id,unidad}=req.body
      const unidades=req.body.unidades?(Array.isArray(req.body.unidades)? req.body.unidades
                                                                        : [req.body.unidades])
                                        :[];
      const detId= req.body.detId?( Array.isArray(req.body.detId)?  req.body.detId
                                                                 : [req.body.detId])
                                 :[];              
             
                                 
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
      ],
      paranoid: false  

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

const getMuestra=async(req,res)=>{
  try {
    const {id}=req.params;

    const muestra = await Muestra.findByPk(id);
   

    if(muestra){
      
      return res.render('tecBioq/clickMuestras',{ 
                                                muestra
                                                      })
    }
    else{
      return res.render('tecBioq/clickMuestras',{ 
        msg:"Determinacion no encontrada"
              })
    }
  } catch (error) {
    console.error(error);
    return res.render('tecBioq/clickMuestras')
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

     const categorias=Array.isArray(req.body.categorias)?  req.body.categorias
                                                        :  [req.body.categorias];
    let i=0;
    for(let nombre of categorias){
      
      const exCateg=await ExamenCategoria.create({ExamenId:id,nombre},
                                                 { transaction })
      const detId=req.body[`${i}`]?Array.isArray(req.body[`${i}`]) ? req.body[`${i}`]
                                                 : [req.body[`${i}`]]
                                  : []          
      const paramId= req.body[`param-${i}`]? Array.isArray(req.body[`param-${i}`]) ? req.body[`param-${i}`]
                                                                                  : [req.body[`param-${i}`]]
                                           : []
      
      for (let id2 of detId){
            await ExCategDeterminacion.create({ExamenCategoriaId:exCateg.id,DeterminacionId:parseInt(id2)},
                                              { transaction })
      }     
      
     
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
     const {id,examenId}=req.params;
     await ExamenCategoria.destroy({where:{id}})
     return res.redirect(`http://localhost:3000/tecBioq/examen/${examenId}/addCategDet`)
   }catch(error){
     console.error(error)
    }
}


const deleteCategDet=async(req,res)=>{
   try {
     const {DeterminacionId,ExamenCategoriaId,examenId}=req.params;
     await ExCategDeterminacion.destroy({where:{DeterminacionId}})
     return res.redirect(`http://localhost:3000/tecBioq/examen/${examenId}/addCategDet`)
   }catch(error){
     console.error(error)
    }
}



const deleteCategParam=async(req,res)=>{
  try {
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
    const{id,examenId}=req.params;
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

     const{ExamenCategoriaId,ExamenId}=req.params;
     const detId=Array.isArray(req.body.detId)?  req.body.detId
                                              :  [req.body.detId];
     
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

    const{ExamenCategoriaId,ExamenId}=req.params;
    const detId=Array.isArray(req.body.detId)?  req.body.detId
                                             :  [req.body.detId];
    const det=Array.isArray(req.body.detId)?  req.body.det
                                             :  [req.body.det];

    let i=0;
    for(let id of detId){
      if(id=='undefined'){
        const p=await Parametro.create({nombre:det[i]})
        id=p.id
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
    const{id,idsVrForm,isNew,sex,nota,
          unidadMin,
          edadMin,
          valorMin,
          valorMax,
          unidadMax,
          edadMax,
      }=req.body;
      
      
    console.log('------------------------------------------------ PUT VR');
    console.log(req.body)

    for(let i=0;i<idsVrForm.length;i++){
      console.log("i: ",i)
      if(isNew[i]=='1'){
         await DeterminacionValorReferencia.create({ DeterminacionId: id,
                                                  unidadMin:unidadMin[i],
                                                  unidadMax:unidadMax[i],                                                         
                                                  edadMin: edadMin[i],
                                                  edadMax: edadMax[i],
                                                  sexo:sex[i][0],
                                                  valorMin: valorMin[i],
                                                  valorMax:valorMax[i],
                                                  nota: nota[i] 
                                                 },
                                                 {transaction})    
      }else if(isNew[i]=='0'){
                    await DeterminacionValorReferencia.update({   DeterminacionId: id,
                                                                  unidadMin: unidadMin[i],
                                                                  unidadMax: unidadMax[i],                                                         
                                                                  edadMin: edadMin[i],
                                                                  edadMax: edadMax[i],
                                                                  sexo: sex[i][0],
                                                                  valorMin: valorMin[i],
                                                                  valorMax: valorMax[i],
                                                                  nota: nota[i]
                                                              }, {
                                                                  where: { id:idsVrForm[i]}, 
                                                                  transaction
                                                              });
        } else if(isNew[i]=='3'){
                  await DeterminacionValorReferencia.destroy({
                    where: { id:idsVrForm[i] },
                    transaction
                  })
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


const getAddMuestra=async(req,res)=>{
  try {
    return res.render(`tecBioq/clickAddMuestra`)

  } catch (error) {
    console.error(error);
    return res.redirect(`http://localhost:3000/tecBioq/`)
  };

}






const postDet=async(req,res)=>{
  const transaction = await sequelize.transaction();
  try {
    console.log('------------------------------------------------ POST DETERMINACION');
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





    await transaction.commit();
    return res.render(`tecBioq/addVr`,{determinacion} )

  } catch (error) {
    console.error(error);
    await transaction.rollback()
    return res.redirect(`http://localhost:3000/tecBioq/`)
  };

}




const  postMuestra=async(req,res)=>{
  try {
    console.log('------------------------------------------------ POST MUESTRAA');
    const{nombre}= req.body;
    
    const muestra=await Muestra.create({nombre})
    return res.redirect(`http://localhost:3000/tecBioq/muestras?inputSearch=${nombre}`)

  } catch (error) {
    console.error(error);
    if(error.parent.code=="ER_DUP_ENTRY")
      return res.render(`tecBioq/clickAddMuestra`,{error:"Error: La muestra ya está registrada."} )
    return res.render(`tecBioq/clickAddMuestra`,{error:"Error: registro no agregado."} )
      
  };

}







const postVr=async(req,res)=>{
  const transaction = await sequelize.transaction();
  try {
    console.log('------------------------------------------------ POST VR'); //TODO
    
    const{id}=req.body;
    const{determinacion,valoresRef}=req.body

    const arr=['Femenino','Masculino','Ambos'];
    for(let sexo of arr){
      if(req.body[`nota${sexo}`]){
        for(let i=0;i<req.body[`nota${sexo}`].length;i++){

             await DeterminacionValorReferencia.create({ DeterminacionId: id,
                                                         unidadMin:req.body[`unidadMin${sexo}`][i],
                                                         unidadMax:req.body[`unidadMax${sexo}`][i],                                                         
                                                         edadMin: req.body[`edadMin${sexo}2`][i]
                                                         ,
                                                         edadMax:req.body[`edadMax${sexo}2`][i],
                                                         sexo:sexo[0],
                                                         valorMin: req.body[`valorMin${sexo}2`][i],
                                                         valorMax:req.body[`valorMax${sexo}2`][i],
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
    return res.redirect(`http://localhost:3000/tecBioq/`)
  };

}



 module.exports={
  deleteCategoria,
  deleteCategDet,
  deleteCategParam,
  deleteDeterminacion,
  getAddCategDet,
  getAddDeterminacion,
  getAddMuestra,
  getDeterminacion,
  getExamen,
  getInicio,
  getInicioDeterminaciones,
  getInicioMuestras,
  getFormExamen,
  getMuestra,
  postCategDet,
  postDet,
  postVr,
  postDetCateg,
  postParamCateg,
  postExamen,
  postMuestra,
  putDet,
  putvr,
  putExamen,
  putCateg,
 }