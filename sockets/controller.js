const {Usuario,UsuarioRol,Rol,Hombre,Mujer,Otro,Determinacion,Muestra,Unidad,ConjuntoDet,ValorReferencia,Sinonimo}=require('../models');
const { Op, literal } = require('sequelize');
const socketController = (client) => {
  
    client.on('buscarPaciente',async(termino,cb)=>{
        try {      
            const pacientes = await Usuario.findAll({
      
              include: [ { model: Rol, through: UsuarioRol, where: { nombre: 'Paciente' }},{model: Hombre},{ model: Mujer},{ model: Otro}],
              where: {
                [Op.or]: [{ documento: { [Op.regexp]: termino } },
                { email: { [Op.regexp]: termino } },
                { apellido: { [Op.regexp]: termino } }]
              },
              attributes: { exclude: ['pass'] }
             
            });
            
            cb(pacientes);
        }
        catch(err){
            console.log(err)
        }
        

    });

  
 
 }
 
     
 
 module.exports = {
     socketController
 }
 

