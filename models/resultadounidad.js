'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResultadoUnidad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     ResultadoUnidad.belongsTo(models.Unidad);
     ResultadoUnidad.belongsTo(models.Resultado);
    }
  }
  ResultadoUnidad.init({
  }, {
    sequelize,
    modelName: 'ResultadoUnidad',
    tableName:'resultadoUnidades'
  });
  return ResultadoUnidad;
};