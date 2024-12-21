'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdenConjuntoDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      OrdenConjuntoDet.belongsTo(models.Orden)
      OrdenConjuntoDet.belongsTo(models.ConjuntoDet)
    }
  }
  OrdenConjuntoDet.init({
  }, {
    sequelize,
    modelName: 'OrdenConjuntoDet',
    tableName:'OrdenConjuntoDets'
  });
  return OrdenConjuntoDet;
};