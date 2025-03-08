'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Examen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Examen.hasMany(models.OrdenExamen)
      Examen.hasMany(models.LaboratorioExamen)
      Examen.hasMany(models.ExamenCategoria)

      Examen.belongsTo(models.Muestra)

    }



    static getExamenesByNombreOcodigo=async(termino,limit=5,offset=0)=>{
      try{
        const pacientes= await Usuario.findAndCountAll({ include: [ { model: sequelize.models.Rol, through: sequelize.models.UsuarioRol, 
                                                                       where: { nombre: 'Paciente' }},
                                                                    {model: sequelize.models.Telefono}
                                                                      
                                                                      ],
                                                        where: { [Op.or]: [{ documento: { [Op.regexp]: termino } },
                                                                           { email: { [Op.regexp]: termino } },
                                                                           { apellido: { [Op.regexp]: termino } }]},
                                                        attributes: { exclude: ['pass'] },
                                                        order: [
                                                          ['apellido', 'ASC'],  
                                                          ['nombre', 'ASC']     
                                                        ],
                                                        limit,
                                                        offset
                                                      });
        
        return pacientes; //retorna objeto.count() y objeto.rows(este es el arreglo de pacientes)
      }catch(error){
        console.log('models==>usuario');
        throw error;
      }
    }

  }
  Examen.init({
    codigo: DataTypes.STRING,
    nombre: DataTypes.STRING,
    tags: DataTypes.STRING,
    tiempoProcesamiento: DataTypes.INTEGER,
    laboratorioQueLoRealiza: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Examen',
    tableName: 'Examenes',
    timestamps: false,
    paranoid:true
  });
  return Examen;
};