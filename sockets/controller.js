const {Medico,Diagnostico,Determinacion,Sinonimo,sequelize}=require('../models');
const { Op, literal } = require('sequelize');
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
            const query=`select  d.id as id,codigo,nombre,
                                 'determinaciones' AS origen
                         from determinaciones as d
                         left join sinonimos as s on s.determinacionId=d.id
                         where codigo LIKE :termino OR nombre LIKE :termino OR sinonimo LIKE :termino
                            UNION
                         select cj.id as idCj,codigo,nombre,
                                'conjuntoDets' AS origen
                         from conjuntoDets as cj
                         left join conjsinonimos as cjs on cjs.conjuntoDetId=cjs.id
                         where codigo LIKE :termino OR nombre LIKE :termino  OR sinonimo LIKE :termino
                         limit :limit
                         offset :offset;`
            const totalQuery=`
                        select count(*) as total 
                        from(  
                          select codigo,nombre 
                          from determinaciones as d
                          left join sinonimos as s on s.determinacionId=d.id
                          where codigo LIKE :termino OR nombre LIKE :termino OR sinonimo LIKE :termino
                             UNION
                          select codigo,nombre 
                          from conjuntoDets as cj
                          left join conjsinonimos as cjs on cjs.conjuntoDetId=cj.id
                          where codigo LIKE :termino OR nombre LIKE :termino  OR sinonimo LIKE :termino) as unionQuery;             
                                                 `
            const replacements = {
                            termino: `%${termino}%`,
                            limit,
                            offset,
                          };
            const [examenes] = await sequelize.query(query, { replacements });             
            const [result] = await sequelize.query(query, { replacements });             
            console.log('------------------------------------------------');
            console.log(examenes)
            const total= result[0].total ;
            cb(examenes,total);
        }
        catch(err){
            console.log(err)
        }       
  
    });

  
 
 }
 
     
 
 module.exports = {
     socketController
 }
 

