'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdenEliminada extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     OrdenEliminada.belongsTo(models.Orden);
    }
  }
  OrdenEliminada.init({
    ordenId: DataTypes.INTEGER,
    motivo: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'OrdenEliminada',
    tableName:'OrdenEliminadas',
    timestamps:false
  });
  return OrdenEliminada;
};