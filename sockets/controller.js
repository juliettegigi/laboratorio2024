const {
    Determinacion,
    Diagnostico,
    Examen,
    Medico,
    Parametro,
    Unidad,
    sequelize
}=require('../models');
const { Op } = require('sequelize');
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
        try {  const { rows: determinaciones, count: total } 
               = await Determinacion.findAndCountAll(
                { where: { [Op.or]: [{ codigo: { [Op.like]: `%${termino}%` } },
                                     { nombre: { [Op.like]: `%${termino}%` } },
                                     { tags: { [Op.like]: `%${termino}%` } }
                                   ]
                         },
                limit: limit,
                offset: offset
                });
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
            console.log("eeeeeentriiiieee")
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


 
 }
 
    
 
 
 
 module.exports = {
     socketController
 }
 

