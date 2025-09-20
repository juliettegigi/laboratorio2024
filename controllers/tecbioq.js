const { Op, Sequelize} = require('sequelize');

const ESTADO=require('../constantes/estados')
const {
  Categoria,
  Determinacion,ParametroPadre,ParametroUnidad,ParametroValorReferencia,ParametroResultado,
  Examen,ExCategParametro,ExamenCategoria,ExamenParametro,Orden,OrdenExamen,
  Parametro,Paciente,
  Muestra,MuestraRequerida,Usuario,
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
      
      if (inputSearch !== "") {
        where = {
          [Op.or]: [
            Sequelize.where(
              Sequelize.fn('levenshtein', Sequelize.col('nombre'), inputSearch),
              { [Op.lte]: 6 }
            ),
            Sequelize.where(
              Sequelize.fn('levenshtein', Sequelize.col('codigo'), inputSearch),
              { [Op.lte]: 6 }
            ),
            Sequelize.where(
              Sequelize.fn('levenshtein', Sequelize.col('tags'), inputSearch),
              { [Op.lte]: 6 }
            ),
            { nombre: { [Op.like]: `%${inputSearch}%` }},
            { codigo: { [Op.like]: `%${inputSearch}%` }},
            { tags: { [Op.like]: `%${inputSearch}%` }}
          ]
        };
      }
      
      const exactMatchFirst = Sequelize.literal(`
            CASE
              WHEN LOWER(nombre) = LOWER('${inputSearch}') THEN 0
              ELSE 1
            END
          `);
      const orderByDistance = Sequelize.literal(`levenshtein(nombre, '${inputSearch}')`);

      const { count, rows } = await Examen.findAndCountAll({
        where,
        limit,
        offset,
        order: [   [exactMatchFirst, 'ASC'],
                   [orderByDistance, 'ASC'],
                   ['nombre', 'ASC']
                ],
      });
       const roles=req.session.roles;
      return res.render('tecBioq/index',{inputSearch,
                                       examenes:rows,
                                       limit,
                                       totalRegistros:count,
                                       page,
                                       PAGES_CANTIDADxGRUPO:3,
                                       group,
                                       isTecnico:req.session.isTecnico,
                                       isBioquimico:req.session.isBioquimico,
                                       roles
                                      })
}catch(error){  console.log(error)
                return res.render('tecBioq/index',{
                  isTecnico:req.session.isTecnico,
                                      isBioquimico:req.session.isBioquimico
                })
  } 
   
 }






 const  getEditarDet=async(req,res)=>{

  try{  
    const {DeterminacionId}=req.params
    console.log("EN GET EDITAR DETERMINCACION  ")
    console.log(DeterminacionId)

     const determinacion = await Determinacion.findByPk(DeterminacionId, {
      include: [
        {
          model: Parametro,
          include: [
            Unidad,
            ParametroValorReferencia,
            {
              association: "hijos", // relación muchos-a-muchos (parametroPadres)
              include: [
                {
                  model: Determinacion, // 👈 para obtener la determinación de cada hijo
                  attributes: ["id", "codigo", "tags"], 
                },
                {
                  model: Unidad,
                  attributes: ["id", "unidad"], // opcional
                },
                {
                  model: ParametroValorReferencia,
                  attributes: ["id", "sexo", "edadMin", "edadMax", "valorMin", "valorMax"], // opcional
                },
              ],
            },
          ],
        },
      ],
      order: [
        [
          sequelize.literal(
            "FIELD(`Parametro->ParametroValorReferencia`.`sexo`, 'F','M','A')"
          ),
          "ASC",
        ],
        [Parametro, ParametroValorReferencia, "edadMin", "ASC"],
        [Parametro, ParametroValorReferencia, "valorMin", "ASC"],
      ],
      paranoid: false,
    });

 // 👇 ahora podés acceder a los hijos
    const hijos = determinacion.Parametro.hijos.map((hijo) => {
      return {
        parametroId: hijo.id,
        nombre: hijo.nombre,
        determinacionId: hijo.Determinacions?.[0]?.id || null,
        codigo: hijo.Determinacions?.[0]?.codigo || null,
      };
    });

    console.log("HIJOS >>>", hijos);

     const unidades= await Unidad.findAll({ order: [['unidad', 'ASC']]}); 
     const vrUnidades= await determinacion.Parametro.Unidads; 
      console.log("Unidades de la determinacion")
      console.log(vrUnidades)
     return res.render('tecBioq/clickEditarDet',{determinacion,unidades,vrUnidades,hijos})
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
                                      group,
                                      isTecnico:req.session.isTecnico,
                                      isBioquimico:req.session.isBioquimico})
}catch(error){  console.log(error)
               return res.render('tecBioq/index')
 } 
  
}



 const  getInicioOrdenes=async(req,res)=>{

  try{  
     let{page=1,inputSearch="",group=1}=req.query;
     const limit=5;
     page=parseInt(page)
     group=parseInt(group)
     let offset=page*limit-limit;
     
     let whereCondition = {};
    if (inputSearch !== "") {
      const numericValue = Number(inputSearch);
      console.log("paso")
      if (!isNaN(numericValue)) {
        whereCondition = {
         // EstadoId:ESTADO.analitica.id,
          [Op.or]: [
            { id: numericValue },
            { '$Paciente.Usuario.id$': numericValue }
          ]
        };
      } else {
        whereCondition = {
         // EstadoId:ESTADO.analitica.id,
          [Op.or]: [
            { '$Paciente.Usuario.nombre$': {  [Op.like]: `%${inputSearch}%`} },
            { '$Paciente.Usuario.apellido$': {  [Op.like]: `%${inputSearch}%` } },
            { '$Paciente.Usuario.email$': {  [Op.like]: `%${inputSearch}%` } },
            { '$Paciente.Usuario.documento$': {  [Op.like]: `%${inputSearch}%` } },
            Sequelize.where(
              Sequelize.fn('levenshtein', Sequelize.col('Paciente.Usuario.nombre'), inputSearch),
              { [Op.lte]: 6 }
            ),
            Sequelize.where(
              Sequelize.fn('levenshtein', Sequelize.col('Paciente.Usuario.apellido'), inputSearch),
              { [Op.lte]: 6 }
            ),
          ]
        };
      }
    }
    /* else{
      whereCondition = {
        EstadoId:ESTADO.analitica.id}
    } */


       
        const exactMatchFirst = Sequelize.literal(`
          CASE
            WHEN LOWER(\`Paciente->Usuario\`.\`nombre\`) = LOWER('${inputSearch}') THEN 0
            WHEN LOWER(\`Paciente->Usuario\`.\`apellido\`) = LOWER('${inputSearch}') THEN 0
            WHEN LOWER(\`Paciente->Usuario\`.\`email\`) = LOWER('${inputSearch}') THEN 0
            WHEN LOWER(\`Paciente->Usuario\`.\`documento\`) = LOWER('${inputSearch}') THEN 0
            ELSE 1
          END
        `);
        const orderByLikeMatch = Sequelize.literal(`
          CASE
            WHEN \`Paciente->Usuario\`.\`nombre\` LIKE '%${inputSearch}%' THEN 0
            WHEN \`Paciente->Usuario\`.\`apellido\` LIKE '%${inputSearch}%' THEN 0
            WHEN \`Paciente->Usuario\`.\`email\` LIKE '%${inputSearch}%' THEN 0
            WHEN \`Paciente->Usuario\`.\`documento\` LIKE '%${inputSearch}%' THEN 0
            ELSE 1
          END
        `);            
        const orderByDistance = Sequelize.literal(`
          LEAST(
            levenshtein(LOWER(\`Paciente->Usuario\`.\`nombre\`), LOWER('${inputSearch}')),
            levenshtein(LOWER(\`Paciente->Usuario\`.\`apellido\`), LOWER('${inputSearch}')),
            levenshtein(LOWER(\`Paciente->Usuario\`.\`email\`), LOWER('${inputSearch}')),
            levenshtein(LOWER(\`Paciente->Usuario\`.\`documento\`), LOWER('${inputSearch}'))
          )
        `);


    const { count, rows } = await Orden.findAndCountAll({
      
      where: {
        ...whereCondition,
        [Op.or]: [
          { EstadoId: ESTADO.analitica.id },
          { EstadoId: ESTADO.paraValidar.id }
        ]
      },
      include: [
        {
          model: Paciente,
          as: 'Paciente',
          include: [
            {
              model: Usuario,
              as: 'Usuario'
            }
          ]
        },
        {
          model: Examen,
          as: 'Examens',
          required: true,
          include: [
            {
              model: Muestra,
              as: 'Muestra1',
              required: true
            }
          ],
          where: sequelize.Sequelize.literal(`
            \`Examens\`.\`muestraId\` IN (
              SELECT mr.muestraId 
              FROM muestraRequeridas mr 
              WHERE mr.ordenId = \`Orden\`.id AND mr.isPresentada = 1
            )
          `),
          through: { attributes: ['UsuarioId'] } // <-- Trae el campo UsuarioId de la tabla intermedia
        }
      ],
      limit,
      offset,
      order: [
        [exactMatchFirst, 'ASC'],
        [orderByLikeMatch, 'ASC'],
        [orderByDistance, 'ASC'],
        ['id', 'ASC']
      ],
      subQuery: false // Evita que se generen subconsultas que rompan los alias
    });
    console.log("------------------------------------------------");
    console.log(rows)
     return res.render('tecBioq/indexOrden',{inputSearch,
                                      ordenes:rows,
                                      limit,
                                      totalRegistros:count,
                                      page,
                                      PAGES_CANTIDADxGRUPO:3,
                                      group,
                                      isTecnico:req.session.isTecnico,
                                      isBioquimico:req.session.isBioquimico})
}catch(error){  console.log(error)
               return res.render('tecBioq/index')
 } 
  
}


const  getInicioValidar=async(req,res)=>{

  try{  
     let{page=1,inputSearch="",group=1}=req.query;
     const limit=5;
     page=parseInt(page)
     group=parseInt(group)
     let offset=page*limit-limit;
     
     let whereCondition = {
       EstadoId: ESTADO.paraValidar.id
     };
    if (inputSearch !== "") {
      const numericValue = Number(inputSearch);
      if (!isNaN(numericValue)) {
        whereCondition = {
          EstadoId: ESTADO.paraValidar.id,
          [Op.or]: [
            { id: numericValue },
            { '$Paciente.Usuario.id$': numericValue }
          ]
        };
      } else {
        whereCondition = {
          EstadoId: ESTADO.paraValidar.id,
          [Op.or]: [
            { '$Paciente.Usuario.nombre$': {  [Op.like]: `%${inputSearch}%`} },
            { '$Paciente.Usuario.apellido$': {  [Op.like]: `%${inputSearch}%` } },
            { '$Paciente.Usuario.email$': {  [Op.like]: `%${inputSearch}%` } },
            { '$Paciente.Usuario.documento$': {  [Op.like]: `%${inputSearch}%` } },
            Sequelize.where(
              Sequelize.fn('levenshtein', Sequelize.col('Paciente.Usuario.nombre'), inputSearch),
              { [Op.lte]: 6 }
            ),
            Sequelize.where(
              Sequelize.fn('levenshtein', Sequelize.col('Paciente.Usuario.apellido'), inputSearch),
              { [Op.lte]: 6 }
            ),
          ]
        };
      }
    } 



    const exactMatchFirst = Sequelize.literal(`
      CASE
        WHEN LOWER(\`Paciente->Usuario\`.\`nombre\`) = LOWER('${inputSearch}') THEN 0
        WHEN LOWER(\`Paciente->Usuario\`.\`apellido\`) = LOWER('${inputSearch}') THEN 0
        WHEN LOWER(\`Paciente->Usuario\`.\`email\`) = LOWER('${inputSearch}') THEN 0
        WHEN LOWER(\`Paciente->Usuario\`.\`documento\`) = LOWER('${inputSearch}') THEN 0
        ELSE 1
      END
    `);
    const orderByLikeMatch = Sequelize.literal(`
      CASE
        WHEN \`Paciente->Usuario\`.\`nombre\` LIKE '%${inputSearch}%' THEN 0
        WHEN \`Paciente->Usuario\`.\`apellido\` LIKE '%${inputSearch}%' THEN 0
        WHEN \`Paciente->Usuario\`.\`email\` LIKE '%${inputSearch}%' THEN 0
        WHEN \`Paciente->Usuario\`.\`documento\` LIKE '%${inputSearch}%' THEN 0
        ELSE 1
      END
    `);            
    const orderByDistance = Sequelize.literal(`
      LEAST(
        levenshtein(LOWER(\`Paciente->Usuario\`.\`nombre\`), LOWER('${inputSearch}')),
        levenshtein(LOWER(\`Paciente->Usuario\`.\`apellido\`), LOWER('${inputSearch}')),
        levenshtein(LOWER(\`Paciente->Usuario\`.\`email\`), LOWER('${inputSearch}')),
        levenshtein(LOWER(\`Paciente->Usuario\`.\`documento\`), LOWER('${inputSearch}'))
      )
    `);


    const { count, rows } = await Orden.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: Paciente,
          as: 'Paciente',
          include: [
            {
              model: Usuario,
              as: 'Usuario'
            }
          ]
        },
        {
          model: Examen,
          as: 'Examens',
          required: true, // Solo se incluirán exámenes si cumplen la condición
          include: [
            {
              model: Muestra,
              as: 'Muestra1',
              required: true
            }
          ],
        }
      ],
      limit,
      offset,
      order: [
        [exactMatchFirst, 'ASC'],
        [orderByLikeMatch, 'ASC'],
        [orderByDistance, 'ASC'],
        ['id', 'ASC']
      ],
      subQuery: false // Evita que se generen subconsultas que rompan los alias
    });
    

      
     return res.render('tecBioq/indexOrden',{inputSearch,
                                      ordenes:rows,
                                      limit,
                                      totalRegistros:count,
                                      page,
                                      PAGES_CANTIDADxGRUPO:3,
                                      group,
                                      validar:true,
                                      isTecnico:req.session.isTecnico,
                                      isBioquimico:req.session.isBioquimico})
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
        where = {
        [Op.or]: [
          // búsqueda aproximada en código y tags
          Sequelize.where(
            Sequelize.fn("levenshtein", Sequelize.col("Determinacion.codigo"), inputSearch),
            { [Op.lte]: 6 }
          ),
          Sequelize.where(
            Sequelize.fn("levenshtein", Sequelize.col("Determinacion.tags"), inputSearch),
            { [Op.lte]: 6 }
          ),
          { codigo: { [Op.like]: `%${inputSearch}%` } },
          { tags: { [Op.like]: `%${inputSearch}%` } },
           Sequelize.where(
            Sequelize.fn("levenshtein", Sequelize.col("Parametro.nombre"), inputSearch),
            { [Op.lte]: 6 }
          ),
          { "$Parametro.nombre$": { [Op.like]: `%${inputSearch}%` } },
        ],
      };
    }

    // Exact match y ordenamiento por nombre del parámetro
    const exactMatchFirst = Sequelize.literal(`
      CASE
        WHEN LOWER(\`Parametro\`.\`nombre\`) = LOWER('${inputSearch}') THEN 0
        ELSE 1
      END
    `);

    const orderByDistance = Sequelize.literal(
      `levenshtein(\`Parametro\`.\`nombre\`, '${inputSearch}')`
    );

    const { count, rows } = await Determinacion.findAndCountAll({
      where,
      attributes: ["id", "codigo", "tags", "createdAt", "updatedAt", "deletedAt"], // columnas reales de determinaciones
      include: [
        {
          model: Parametro,
          attributes: ["id", "nombre"], // traemos nombre desde Parametro
          required: false, // importante, así no descarta nada si no matchea
        },
      ],
      limit,
      offset,
      order: [
        [exactMatchFirst, "ASC"],
        [orderByDistance, "ASC"],
        ["codigo", "ASC"],
      ],
    });

     return res.render('tecBioq/indexDeterminacion',{inputSearch,
                                      determinaciones:rows,
                                      limit,
                                      totalRegistros:count,
                                      page,
                                      PAGES_CANTIDADxGRUPO:3,
                                      group,
                                      isTecnico:req.session.isTecnico,
                                      isBioquimico:req.session.isBioquimico})
}catch(error){  console.log(error)
               return res.redirect('http://localhost:3000/tecBioq')
 } 
  
}







const getFormExamen=async(req,res)=>{
    const muestras= await Muestra.findAll();
    return res.render('tecBioq/addExamen',{muestras,
                                           isTecnico:req.session.isTecnico,
                                           isBioquimico:req.session.isBioquimico}) 
 
 }



 const postExamen=async(req,res)=>{
   
   console.log("------------------------------------------------POST EXAMEN")
   console.log(req.body)
   const transaction = await sequelize.transaction();
   try {
      
      const {nombre,codigo,tags,tiempoProcesamiento,laboratorioQueLoRealiza,MuestraId}=req.body
      // inserto en la tabla examenes
      const nuevoExamen = await Examen.create({MuestraId,codigo,nombre,tags,tiempoProcesamiento,laboratorioQueLoRealiza},
         { transaction }); 
      await transaction.commit();
      return res.redirect(`http://localhost:3000/tecBioq/examen/${nuevoExamen.id}`);
     }catch (error) {
           await transaction.rollback()
           
           console.log(error)
           return res.render('tecBioq/index');
    };


}

const putDet=async(req,res)=>{
  
  const transaction = await sequelize.transaction();
  try {

    console.log("En put det -------------------------")
    console.log(req.body)
      const {nombre,codigo,tags,id,unidad}=req.body
      const unidadesId=req.body.unidadesId?(Array.isArray(req.body.unidadesId)? req.body.unidadesId
                                                                        : [req.body.unidadesId])
                                        :[];
      const detsId= req.body.DeterminacionesId?( Array.isArray(req.body.DeterminacionesId)?  req.body.DeterminacionesId
                                                                 : [req.body.DeterminacionesId])
                                 :[];              
             
      

      // ACTUALIZO LA DETERMINACIÓN , el nombre, código, tags
      await Determinacion.update( 
        {codigo,tags},
        { where: { id }, transaction }
      )
      const determinacion = await Determinacion.findByPk(id, { transaction });


      for( let unidad of unidadesId){
         const u=await Unidad.findOrCreate({where:{id:unidad},transaction})
         await ParametroUnidad.create({ ParametroId: determinacion.ParametroId, UnidadId: u[0].id },
                                                  {transaction}
                                                );                          
      }

      await Parametro.update(
        { nombre },
        { where: { id: determinacion.ParametroId }, transaction }
      );

      // SI TIENE HIJOS, TENGO QUE ACTUALIZARLOS

      // borro todos los hijos actuales
      await ParametroPadre.destroy({
        where: { padreId: determinacion.ParametroId  },
        transaction
      });

      // inserto los nuevos hijos
      const determinaciones = await Determinacion.findAll({
          where: { id: detsId },
          attributes: ['id', 'ParametroId']  
        });

      const nuevasRelaciones = determinaciones.map(det => ({
          padreId: determinacion.ParametroId, 
          hijoId: det.ParametroId                  
        }));

      await ParametroPadre.bulkCreate(nuevasRelaciones, { transaction });

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
                                          {include: [{model: Muestra,as:'Muestra1'},]},
                                         );
    const muestras= await Muestra.findAll();                                     
    if(examen){
      return res.render('tecBioq/clickExamen',{ muestras,
                                                examen,
                                                isTecnico:req.session.isTecnico,
                                                isBioquimico:req.session.isBioquimico     })
    }
  } catch (error) {
    console.error(error);
    return res.render('tecBioq/clickExamen')
  };



  
}

const getDeterminacion=async(req,res)=>{
  try {
    const {id}=req.params;

   const determinacion = await Determinacion.findByPk(id, {
               include: [{
                 model: Parametro,
                 include: [ParametroValorReferencia, Unidad]
               }],
               order: [
                 [sequelize.literal("FIELD(`Parametro->ParametroValorReferencia`.`sexo`, 'F','M','A')"), 'ASC'],
                 [Parametro, ParametroValorReferencia, 'edadMin', 'ASC'],
                 [Parametro, ParametroValorReferencia, 'valorMin', 'ASC']
               ],
               paranoid: false
             });
    const parametroHijos= await determinacion.Parametro.getHijos();    
    const vrUnidades= await determinacion.Parametro.Unidads;   
     console.log("Unidades de la determinacion")
      console.log(vrUnidades)
    //const unidades= await Unidad.findAll({ order: [['unidad', 'ASC']]});   
    const valoresRef = determinacion.Parametro.ParametroValorReferencias;

    const vrF=[];
    const vrM=[];
    const vrA=[];
   if(valoresRef)
    { for(let vr of valoresRef){
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
}


    if(determinacion){
      
      return res.render('tecBioq/clickDeterminacion',{ 
                                                determinacion,
                                                parametroHijos,
                                                valoresRef:{Femenino:vrF,
                                                            Masculino:vrM,
                                                            Ambos:vrA},
                                                vrUnidades,
                                                //unidades,
                                                isTecnico:req.session.isTecnico,
                                                isBioquimico:req.session.isBioquimico
                                                      })
    }
    else{
      return res.render('tecBioq/clickDeterminacion',{ 
        msg:"Determinacion no encontrada",
        isTecnico:req.session.isTecnico,
        isBioquimico:req.session.isBioquimico
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
                                                muestra,
                                                isTecnico:req.session.isTecnico,
                                                isBioquimico:req.session.isBioquimico
                                                      })
    }
    else{
      return res.render('tecBioq/clickMuestras',{ 
        msg:"Determinacion no encontrada",
        isTecnico:req.session.isTecnico,
        isBioquimico:req.session.isBioquimico
              })
    }
  } catch (error) {
    console.error(error);
    return res.render('tecBioq/clickMuestras')
  };



  
}


const getOrdenExamenes=async(req,res)=>{
  try {
    const {OrdenId}=req.params;
    const {validar=0}=req.query
    console.log(OrdenId)
    
    const ordenExamenes = await OrdenExamen.findAll({
      where: { OrdenId},
      include: [
        {
          model: Examen,
          include: [
            {
              model: ExamenCategoria, as: 'ExamenCategoria', include: [
                {
                  model: ExCategDeterminacion, include: [
                    {
                      model: Determinacion , include: [   { model: Unidad },{ model: DeterminacionResultado }]
                    }
                  ]
                },
                {
                  model: ExCategParametro, include: [
                    {
                      model: Parametro , include: [   { model: Unidad },{ model: ParametroResultado }]}
                  ]
                }
              ]
            }
          ]
        }
      ]
    });
      return res.render(`tecBioq/resultados`,{ordenExamenes,validar,isTecnico:req.session.isTecnico,
                                              isBioquimico:req.session.isBioquimico})
    
  } catch (error) {
    console.error(error);
    return res.render('tecBioq/clickMuestras')
  };



  
}
const getOrdenExamen=async(req,res)=>{
  try {
    const {OrdenId,ExamenId}=req.params;
    const {validar}=req.query;
    const rta = req.flash('rta')[0];

  const ordenExamen = await OrdenExamen.findOne({
    where: { OrdenId, ExamenId }
  });


 
   const examen = await Examen.findOne({
    where: { id: ExamenId },
    include: [
      {
        model: ExamenCategoria,
        as: 'ExamenCategoria', // Especificamos el alias correcto
        include: [
          {
            model: ExCategDeterminacion,
            include: [
              {
                model: Determinacion,
                include: [
                  { model: Unidad },
                  { 
                    model: DeterminacionResultado, 
                    where: { OrdenExamenId: ordenExamen.id },
                    required: false 
                  }     
                ]
              },
            ]
          },
          {
            model: ExCategParametro,
            include: [
              {
                model: Parametro,
                include: [
                  { model: Unidad },
                  { 
                    model: ParametroResultado, 
                    where: { OrdenExamenId: ordenExamen.id },
                    required: false
                  }
                ]
              },
            ]
          }
        ]
      }
    ]
  });
      return res.render(`tecBioq/clickOrden`,{examen,
                                              rta,
                                              validar,
                                              ordenExamen,
                                              isTecnico:req.session.isTecnico,
                                              isBioquimico:req.session.isBioquimico})
    
  } catch (error) {
    console.error(error);
    return res.render('tecBioq/clickMuestras',{isTecnico:req.session.isTecnico,
      isBioquimico:req.session.isBioquimico})
  };



  
}





const getAddCategDet=async(req,res)=>{
   try {
     const { id } = req.params;

const examen = await Examen.findByPk(id);
const exCategs = await ExamenCategoria.findAll({
  where: { ExamenId: examen.id },
   attributes: ['id', 'CategoriaId', 'ExamenId'], 
  include: [
    {
      model: Categoria,
      as: 'Categoria'
    },
    {
      model: Parametro,
      as: 'Parametro4',
      include: [{ model: Determinacion,as: 'Determinacion1' },
  ]
    }
  ]
});


/* 
for (const ex of exCategs) {
  const params = ex.Parametro4 || [];

  // separar y además mapear a objetos "plain" para no mandar instancias Sequelize a la vista
  const sinDet = params
    .filter(p => !p.Determinacion1 || p.Determinacion1.length === 0)
    .map(p => (typeof p.get === 'function' ? p.get({ plain: true }) : p));

  const conDet = params
    .filter(p => p.Determinacion1 && p.Determinacion1.length > 0)
    .map(p => (typeof p.get === 'function' ? p.get({ plain: true }) : p));

  ex.setDataValue('Parametros', Array.isArray(sinDet) ? sinDet : []);
  ex.setDataValue('Determinaciones', Array.isArray(conDet) ? conDet : []);
}


const exCategsPlain = exCategs.map(e => e.get({ plain: true })); */

return res.render("tecBioq/addCategDet", {
  examen,
  exCategs,
  isTecnico:req.session.isTecnico,
         isBioquimico:req.session.isBioquimico
});
     
     
   } catch (error) {
     console.error(error);
     return res.render('tecBioq/clickExamen',{isTecnico:req.session.isTecnico,
      isBioquimico:req.session.isBioquimico})
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

const putEstadoOrden=async(req,res)=>{
  const{OrdenId}=req.params;
   try {
    console.log("Cambio el estado de la orden")
    console.log(OrdenId)
     await Orden.update( {EstadoId:ESTADO.informada.id},
                          { where: { id:OrdenId} }
                        )
     return res.redirect(`http://localhost:3000/tecBioq/ordenesV`)

   } catch (error) {
     console.error(error);
     return res.redirect(`http://localhost:3000/tecBioq/ordenesV`)
 
 
   }
   
 }
 
const putOrdenExamenIsValidado=async(req,res)=>{
  const{OrdenExamenId}=req.params;
  console.log("seeeeeeeeeeee  --> ",OrdenExamenId)
   try {
     await OrdenExamen.update( {UsuarioId:req.session.usuario.id},
                          { where: { id:OrdenExamenId }}
                        )
     return res.redirect(`http://localhost:3000/tecBioq/ordenesV`)

   } catch (error) {
     console.error(error);
     return res.redirect(`http://localhost:3000/tecBioq/ordenesV`)
 
 
   }
   
 }
 

 const postCategDet=async(req,res)=>{
  const transaction = await sequelize.transaction();
  console.log("-----------------------------POST")
  console.log(req.body)
  const {ExamenId}=req.params;
   try {

     const categorias=req.body.categorias  ? Array.isArray(req.body.categorias)?  req.body.categorias
                                                        :  [req.body.categorias]
                                                        : [];
    let i=0;
    for(let nombre of categorias){

      
      
      const [categoria, created] = await Categoria.findOrCreate({
        where: { nombre },
        defaults: { nombre },
        transaction
      });

      // No está del todo bien, porque falta asociar el ExamenId. 
      // Debería ser algo así:
      const exCateg = await ExamenCategoria.create({CategoriaId: categoria.id,ExamenId}, { transaction });
      
      const detId=req.body[`det-${i}Id`]?Array.isArray(req.body[`det-${i}Id`]) ? req.body[`det-${i}Id`]
                                                 : [req.body[`det-${i}Id`]]
                                  : []          
      const paramId= req.body[`param-${i}Id`]? Array.isArray(req.body[`param-${i}Id`]) ? req.body[`param-${i}Id`]
                                                                                  : [req.body[`param-${i}Id`]]
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
     return res.redirect(`http://localhost:3000/tecBioq/examen/${ExamenId}/addCategDet`)

   } catch (error) {
     console.error(error);
     await transaction.rollback();
     return res.redirect(`http://localhost:3000/tecBioq/examen/${ExamenId}/addCategDet`)
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
    console.log('------------------------------------------------ BODY PUT');
    console.log(req.body)
    const{ExamenCategoriaId,ExamenId}=req.params;
    console.log("id: ",ExamenCategoriaId)
    const paramId=req.body.paramId ? Array.isArray(req.body.paramId)? req.body.paramId
                                                                    : [req.body.paramId]
                                   : [];
    const detId=req.body.detId ? Array.isArray(req.body.detId)? req.body.detId
                                                              : [req.body.detId]
                               : [];                               
    await ExamenCategoria.update( {nombre:req.body.nombre},
                                  { where: { id:ExamenCategoriaId}})

     for(let id of paramId){
      await ExCategParametro.findOrCreate({
        where: { ParametroId: id,ExamenCategoriaId },
        defaults: { ExamenCategoriaId, ParametroId: id }
      });
    }                              

    for(let id of detId){
      await ExCategDeterminacion.findOrCreate({
        where: { DeterminacionId: id,ExamenCategoriaId },
        defaults: { ExamenCategoriaId, DeterminacionId: id }
      });
    }     

    return res.redirect(`http://localhost:3000/tecBioq/examen/${ExamenId}/addCategDet`)

  } catch (error) {
    console.error(error);
    return res.redirect(`http://localhost:3000/tecBioq/examen/${ExamenId}`)
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
         await ParametroValorReferencia.create({ ParametroId: id,
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
                    await ParametroValorReferencia.update({   ParametroId: id,
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
                  await ParametroValorReferencia.destroy({
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
    return res.render(`tecBioq/clickAddDeterminacion`,{unidades,isTecnico:req.session.isTecnico,
      isBioquimico:req.session.isBioquimico})

  } catch (error) {
    console.error(error);
    return res.redirect(`http://localhost:3000/tecBioq/`)
  };

}


const getAddMuestra=async(req,res)=>{
  try {
    return res.render(`tecBioq/clickAddMuestra`,{isTecnico:req.session.isTecnico,
      isBioquimico:req.session.isBioquimico})

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
    const unidadesId=req.body.unidadesId?  
                       Array.isArray(req.body.unidadesId) ? req.body.unidadesId : [req.body.unidadesId]
                   : [];    
    const detId=req.body.determinacionesId?  
                   Array.isArray(req.body.deteId) ? req.body.detId : [req.body.determinacionesId]
               : [];    

    //const unidades= await Unidad.findAll({ order: [['unidad', 'ASC']]});
    
    const parametro=await Parametro.create({nombre},{transaction})
    const determinacion=await Determinacion.create({codigo,tags,ParametroId:parametro.id},{transaction})
    
    for(let unidad of unidadesId){
        const u=await Unidad.findOne( { where: { id:unidad},transaction })
        if(u) await ParametroUnidad.create({ParametroId:parametro.id,UnidadId:u.id},{transaction})
    }

    for(let id of detId){
      await ParametroPadre.create({padreId:parametro.id,hijoId:id},{transaction})
  }





    await transaction.commit();
    return res.redirect(`http://localhost:3000/tecBioq/determinacion/${determinacion.id}` )

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
      return res.render(`tecBioq/clickAddMuestra`,{error:"Error: La muestra ya está registrada.",isTecnico:req.session.isTecnico,
        isBioquimico:req.session.isBioquimico} )
    return res.render(`tecBioq/clickAddMuestra`,{error:"Error: registro no agregado.",isTecnico:req.session.isTecnico,
      isBioquimico:req.session.isBioquimico} )
      
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

const estanTodosLosResultados=async(ordenExamen)=>{
       const count1 = await OrdenExamen.count({ where: { OrdenId: ordenExamen.id } });
       const count2 = await OrdenExamen.count({ where: { OrdenId: ordenExamen.id, tieneResultado: 1 } });
     
       return count1 === count2;
      }

const postResultados=async(req,res)=>{
  const transaction = await sequelize.transaction();
  const{OrdenExamenId}=req.params
  let ordenExamen;
  try {
    console.log('------------------------------------------------ POST resultados');
    console.log(req.body)
    for(let propiedad in req.body){
    req.body[`${propiedad}`]=Array.isArray(req.body[`${propiedad}`])
             ?req.body[`${propiedad}`]
             :[req.body[`${propiedad}`]];
    }
    ordenExamen=await OrdenExamen.findByPk(OrdenExamenId)


    //si estan todos los resultados
  

    
    const{determinacionResultado,parametroResultado,parametroId,determinacionId,detUnidadId,parametroUnidadId}=req.body;
    if(determinacionId){
       for(let i=0;i<determinacionId.length;i++ ){
         const dr=await DeterminacionResultado.create({OrdenExamenId,
                                              DeterminacionId:determinacionId[i],
                                              resultado:parseFloat(determinacionResultado[i]),
                                              UnidadId:detUnidadId[i]},
                                             {transaction})

         await DeterminacionResultadoAuditoria.create({
          operacion: 'CREATE',
          registroId: dr.id,
          usuarioId: req.session.usuario.id || null,
          fecha: new Date()
        }, { transaction });
       }
    }
    if(parametroId){
       for(let i=0;i<parametroId.length;i++ ){
         const pr=await ParametroResultado.create({OrdenExamenId,
                                              ParametroId:parametroId[i],
                                              resultado:parametroResultado[i],
                                              UnidadId:parametroUnidadId[i]},
                                             {transaction})
        await ParametroResultadoAuditoria.create({
          operacion: 'CREATE',
          registroId: pr.id,
          usuarioId: req.session.usuario.id || null,
          fecha: new Date()
        }, { transaction });
       }
    }

    
    //si estan todos los resultados
    if(await estanTodosLosResultados(ordenExamen)){
        const  orden=await Orden.findByPk(ordenExamen.OrdenId);
        orden.EstadoId=ESTADO.paraValidar.id
        await orden.save({ transaction })
      }
      
      ordenExamen.tieneResultado=true;
      await ordenExamen.save({ transaction });
      await transaction.commit();
    req.flash('rta',{msg: "Resultados registrados", tipo:"success"});
    return res.redirect(`http://localhost:3000/tecBioq/ordenExamen/${ordenExamen.OrdenId}/${ordenExamen.ExamenId}`)

  } catch (error) {
   
    console.error(error);
    await transaction.rollback()
    req.flash('rta', {msg:"Error al registrar", tipo:"danger"});
    return res.redirect(`http://localhost:3000/tecBioq/ordenExamenes/${ordenExamen.OrdenId}/${ordenExamen.ExamenId}`)
  };

}



const putResultados=async(req,res)=>{
  const transaction = await sequelize.transaction();
  const{OrdenExamenId}=req.params
  let ordenExamen;
  try {
    console.log('------------------------------------------------ PUUUtT resultados');
    console.log(req.body)
    for(let propiedad in req.body){
    req.body[`${propiedad}`]=Array.isArray(req.body[`${propiedad}`])
             ?req.body[`${propiedad}`]
             :[req.body[`${propiedad}`]];
    }

    ordenExamen=await OrdenExamen.findByPk(OrdenExamenId)
    const{determinacionResultado,determinacionId,detUnidadId,
          parametroResultado,    parametroId,    parametroUnidadId}=req.body;

    if(determinacionId){
       for(let i=0;i<determinacionId.length;i++ ){
            await DeterminacionResultado.upsert(
              {
                OrdenExamenId,
                DeterminacionId: determinacionId[i],
                resultado: parseFloat(determinacionResultado[i]),
                UnidadId: detUnidadId[i]
              },
              { transaction }
            );
       }
    }
    // parametroId es el arreglo con los id de los parámetros del formulario, hayan sido editados o no
    if (parametroId) {
      for (let i = 0; i < parametroId.length; i++) {
        const parametroI = parametroId[i];
    
        // Traigo el registro actual
        const registro = await ParametroResultado.findOne({
          where: {
            OrdenExamenId,
            ParametroId: parametroI,
          }
        });
        const datosAntiguos=registro.toJSON()
    
        // Valores nuevos que recibió la API
        const nuevoResultado = parametroResultado[i];
        const nuevaUnidadId  = parametroUnidadId[i];
    
        // Verifico si realmente hay algún cambio
        console.log("A VERRRRRRRRRRR")
        console.log(registro.resultado)
        console.log(nuevoResultado)
        console.log(registro.UnidadId)
        console.log(nuevaUnidadId)
        const hayCambio =
          registro.resultado != nuevoResultado ||
          registro.UnidadId  != nuevaUnidadId;
    
        if (hayCambio) {
          // Hacemos el update
          registro.resultado= nuevoResultado,
          registro.UnidadId=nuevaUnidadId,
          await registro.save({ transaction })
          
          // Registramos en auditoría
          await ParametroResultadoAuditoria.create({
            operacion: 'UPDATE',
            registroId: registro.id,
            usuarioId: req.session.usuario.id,
            datosAntiguos,
            datosNuevos:registro,
            fecha: new Date(),
          }, { transaction });
        }
      }
    }

    ordenExamen.UsuarioId=null;
    await ordenExamen.save({ transaction });
   
    const orden = await Orden.findByPk(ordenExamen.OrdenId, { transaction });
    orden.EstadoId=ESTADO.paraValidar.id
    await orden.save({ transaction });

    await transaction.commit();
    req.flash('rta', {msg:"Resultados actualizados", tipo:"success"});
    return res.redirect(`http://localhost:3000/tecBioq/ordenExamen/${ordenExamen.OrdenId}/${ordenExamen.ExamenId}`)

  } catch (error) {
   
    console.error(error);
    await transaction.rollback()
    req.flash('rta', {msg:"Error al actualizar", tipo:"danger"});
    return res.redirect(`http://localhost:3000/tecBioq/ordenExamenes/${ordenExamen.OrdenId}/${ordenExamen.ExamenId}`)
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
  getEditarDet,
  getExamen,
  getInicio,
  getInicioDeterminaciones,
  getInicioMuestras,
  getInicioOrdenes,
  getInicioValidar,
  getFormExamen,
  getMuestra,
  getOrdenExamen,
  getOrdenExamenes,
  postCategDet,
  postDet,
  postVr,
  postDetCateg,
  postParamCateg,
  postExamen,
  postResultados,
  postMuestra,
  putDet,
  putvr,
  putEstadoOrden,
  putOrdenExamenIsValidado,
  putExamen,
  putCateg,
  putResultados
 }