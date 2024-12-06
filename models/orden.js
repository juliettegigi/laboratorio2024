'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orden extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Orden.belongsTo(models.Usuario);
      Orden.belongsTo(models.Medico);
      Orden.belongsTo(models.Diagnostico);
      Orden.belongsTo(models.Estado);     

     
      Orden.hasMany(models.OrdenEliminada);
      Orden.hasMany(models.MuestraPresentada);
      Orden.hasMany(models.Resultado);

     
      Orden.belongsToMany(models.Muestra,{through:'MuestraPresentada'});
      Orden.belongsToMany(models.Determinacion,{through:'Resultado'})
      
      
     
    }
  }
  Orden.init({
    usuarioId: DataTypes.INTEGER,
    medicoId:DataTypes.INTEGER,
    diagnosticoId:DataTypes.INTEGER,
    estadoId:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Orden',
    tableName:'ordenes',
    paranoid:true
  });
  return Orden;
};