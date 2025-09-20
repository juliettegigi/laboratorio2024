const {
    Determinacion,
    DeterminacionValorReferencia,
    Diagnostico,
    Examen,
    Medico,
    Parametro,
    Unidad,
    sequelize
}=require('../models');
const { Op,Sequelize } = require('sequelize');
const socketController = (socket) => {



    socket.on('buscarMedico',async(termino,limit=5,offset=0,cb)=>{
        try {  const { rows: medicos, count: total } 
               = await Medico.findAndCountAll(
                { where: {  [Op.or]: [{ nombre: { [Op.like]: `%${termino}%` } },
                                                { email: { [Op.like]: `%${termino}%` } }
                                     ]
                         },
                  limit: limit,
                  offset: offset
                });
              cb(medicos,total);
           }
        catch(err){
            console.log(err)
        }       
  
    });


    socket.on('buscarDiagnostico',async(termino,limit=5,offset=0,cb)=>{
        try {  const { rows: diagnosticos, count: total } 
               = await Diagnostico.findAndCountAll(
                { where: {  [Op.or]: [{ codigo: { [Op.like]: `%${termino}%` } },
                                      { diagnostico: { [Op.like]: `%${termino}%` } }
                               ]
                         },
                  limit: limit,
                  offset: offset
                });
            cb(diagnosticos,total);
        }
        catch(err){
            console.log(err)
        }       
  
    });


    socket.on('buscarExamen',async(termino,limit=5,offset=0,cb)=>{
        try { 
            const { rows: examenes, count: total }
            = await Examen.findAndCountAll(
                { where: { [Op.or]: [{ codigo: { [Op.like]: `%${termino}%` } },
                                     { nombre: { [Op.like]: `%${termino}%` } },
                                     { tags: { [Op.like]: `%${termino}%` } }
                                   ]
                         },
                limit: limit,
                offset: offset
                });
            cb(examenes,total);
        }
        catch(err){
            console.log(err)
        }       
  
    });


    socket.on('buscarDeterminacion',async(termino,limit=5,offset=0,cb)=>{
        try {  
            
            
             const exactMatchFirst = Sequelize.literal(`
                                  CASE
                                    WHEN LOWER(\`Parametro4\`.\`nombre\`) = LOWER('${termino}') THEN 0
                                    WHEN LOWER(\`determinacion\`.\`codigo\`) = LOWER('${termino}') THEN 0
                                    WHEN LOWER(\`determinacion\`.\`tags\`) = LOWER('${termino}') THEN 0
                                    ELSE 1
                                  END
                                `);
                    const orderByLikeMatch = Sequelize.literal(`
                                  CASE
                                    WHEN  \`Parametro4\`.\`nombre\` LIKE '%${termino}%' THEN 0
                                    WHEN \`determinacion\`.\`codigo\` LIKE '%${termino}%' THEN 0
                                    WHEN \`determinacion\`.\`tags\` LIKE '%${termino}%' THEN 0
                                    ELSE 1
                                  END
                                `);            
                  const orderByDistance = Sequelize.literal(`
                            LEAST(
                              levenshtein(LOWER(\`Parametro4\`.\`nombre\`), LOWER('${termino}')),
                              levenshtein(LOWER(\`determinacion\`.\`codigo\`), LOWER('${termino}')),
                              levenshtein(LOWER(\`determinacion\`.\`tags\`), LOWER('${termino}'))
                            )
                          `);
            
            const { rows: determinaciones, count: total } 
               = await Determinacion.findAndCountAll({
                include: [
                      {
                        model: Parametro, // nombre del modelo asociado
                        as: 'Parametro4',
                        where: { [Op.or]: [ 
                         { nombre: { [Op.like]: `%${termino}%` }},
                          Sequelize.where(  Sequelize.fn('levenshtein', Sequelize.col('nombre'), termino),
                                                                    { [Op.lte]: 6 }
                                                                  )
                        ]
                        },
                      }
                    ],
                 where: { [Op.or]: [{ codigo: { [Op.like]: `%${termino}%` } },
                                    { tags: { [Op.like]: `%${termino}%` } },
                                     Sequelize.where(  Sequelize.fn('levenshtein', Sequelize.col('codigo'), termino),
                                                                              { [Op.lte]: 6 }
                                                                           ),
                                     Sequelize.where(  Sequelize.fn('levenshtein', Sequelize.col('tags'), termino),
                                                                              { [Op.lte]: 6 }
                                                                           )
                                   ]
                         },
                order: [
                   [exactMatchFirst, 'ASC'],
                   [orderByLikeMatch, 'ASC'],
                   [orderByDistance, 'ASC'],
                   [Sequelize.col('Parametro4.nombre'), 'ASC'],
                   ['codigo', 'ASC'],
                   ['tags', 'ASC'],
                 ],
                limit: limit,
                offset: offset
                });
                console.log("---------------------*********************************")
                console.log(determinaciones)
              cb(determinaciones,total);
           }
        catch(err){
            console.log(err)
        }       
    
    });


    socket.on('buscarParametro',async(termino,limit=5,offset=0,cb)=>{
        try {  const { rows: parametros, count: total } 
               = await Parametro.findAndCountAll(
                { where: { [Op.or]: [,
                                     { nombre: { [Op.like]: `%${termino}%` } },
                                   ]
                         },
                limit: limit,
                offset: offset
                });
              cb(parametros,total);
           }
        catch(err){
            console.log(err)
        }       
    
    });

  

    socket.on('addUnidad',async(unidad,cb)=>{
        try {  
            
            const [unidadRetornada, created] = await Unidad.findOrCreate({
                where: { unidad },   // Buscar si ya existe
                defaults: { unidad} // Si no existe, crearla
            });
    
            if (created) {
                console.log("Unidad creada:", unidadRetornada);
            } else {
                console.log("Unidad ya existe:", unidad);
            }
            
            cb(unidadRetornada); // Devolver la unidad encontrada o creada
           }
        catch(err){
            console.log(err)
        }       
  
    });



    socket.on('deleteVr',async(id,cb)=>{
        try {  
            console.log("delete vr")
            await DeterminacionValorReferencia.destroy({
                where: { id }});
    
            
            
            cb(); // Devolver la unidad encontrada o creada
           }
        catch(err){
            console.log(err)
        }       
  
    });

 
 }
 
    
 
 
 
 module.exports = {
     socketController
 }
 

