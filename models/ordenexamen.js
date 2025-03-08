'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdenExamen extends Model {
    
    static associate(models) { 
      OrdenExamen.belongsTo(models.Orden)
      OrdenExamen.belongsTo(models.Examen)
    }
  }
  OrdenExamen.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tieneResultado:DataTypes.BOOLEAN,
    isValidado:DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'OrdenExamen',
    tableName:'ordenExamenes'
  });
  return OrdenExamen;
};