'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MuestraPresentada extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MuestraPresentada.belongsTo(models.Orden);
      MuestraPresentada.belongsTo(models.Muestra)
    }
  }
  MuestraPresentada.init({
  }, {
    sequelize,
    modelName: 'MuestraPresentada',
    tableName:'muestrapresentadas',
    paranoid:true
  });
  return MuestraPresentada;
};