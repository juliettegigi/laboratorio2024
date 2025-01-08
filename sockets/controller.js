const {Medico,Diagnostico,Examen,sequelize}=require('../models');
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

  
 
 }
 
     
 
 module.exports = {
     socketController
 }
 

