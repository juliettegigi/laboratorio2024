'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MuestraRequerida extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MuestraRequerida.belongsTo(models.Orden);
      MuestraRequerida.belongsTo(models.Muestra)
    }
  }
  MuestraRequerida.init({
    isPresentada:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'MuestraRequerida',
    tableName:'muestraRequeridas',
    paranoid:true
  });
  return MuestraRequerida;
};