'use strict';
const {
  Model,Op,
  BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orden extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Orden.belongsTo(models.Paciente);
      Orden.belongsTo(models.Medico);
      Orden.belongsTo(models.Diagnostico);
      Orden.belongsTo(models.Estado);     

     
      Orden.hasMany(models.OrdenEliminada);
      Orden.hasMany(models.OrdenExamen);
      Orden.hasMany(models.MuestraRequerida);
      Orden.hasMany(models.OrdenAuditoria, { foreignKey: 'RegistroId' });
     
      Orden.belongsToMany(models.Muestra,{through:'MuestraRequerida'});
      Orden.belongsToMany(models.Examen,{through:'OrdenExamen'});
      
      
     
    }

static getOrdenById = async (termino, limit = 5, offset = 0,{estados}, paranoid=true) => {
      try {
        let where = {};
      
    
        // Filtros para el término de búsqueda
        if (termino !== "") {
          where = {
            [Op.or]: [
              { id: { [Op.regexp]: termino } },
              { PacienteId: { [Op.regexp]: termino } }
            ],
          };
        }
    
       
        let includes = [{ model: sequelize.models.Paciente , include: [{ model: sequelize.models.Usuario , as: 'Usuario'}]}];
        // Incluir tablas adicionales en la consulta
        if(estados){ 
          includes.push(  {
            model: sequelize.models.Estado,
            where: {
              nombre: {
                [Op.in]: estados, // Filtra por nombres de estados que estén en el array
              },
            },
            required: true 
          },);
      
        }
        else{
          includes.push(  {
            model: sequelize.models.Estado,
        });
        }
       
        // Realizar la consulta con las condiciones de búsqueda
        const ordenes = await Orden.findAndCountAll({
          include:includes,
          where,
          limit,
          offset,
          paranoid
        });
    
        return ordenes; // Retorna los usuarios con los roles filtrados
      } catch (error) {
        console.log('models==>usuario');
        throw error;
      }
    };


  }
  Orden.init({
    isPresuntivo:DataTypes.BOOLEAN,
    fecha:DataTypes.DATE,
    fechaEntrega:DataTypes.DATE,
    tiempoDeProcesamiento: DataTypes.INTEGER,
    isUrgente:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Orden',
    tableName:'ordenes',
    paranoid:true
  });


  return Orden;
};