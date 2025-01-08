'use strict';
const {
  Model,
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

     
      Orden.belongsToMany(models.Muestra,{through:'MuestraRequerida'});
      Orden.belongsToMany(models.Examen,{through:'OrdenExamen'});
      
      
     
    }
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