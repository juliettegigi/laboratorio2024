'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParametroUnidad extends Model {
    
    static associate(models) {
      ParametroUnidad.belongsTo(models.Parametro, { foreignKey: 'parametroId', as: 'Parametro1' })
      ParametroUnidad.belongsTo(models.Unidad)
    }
  }
  ParametroUnidad.init({
  }, {
    sequelize,
    modelName: 'ParametroUnidad',
    tableName: 'ParametroUnidades',
    timestamps: false
  });
  return ParametroUnidad;
};