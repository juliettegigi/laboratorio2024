'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParametroUnidad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ParametroUnidad.belongsTo(models.Parametro)
      ParametroUnidad.belongsTo(models.Unidad)
    }
  }
  ParametroUnidad.init({
  }, {
    sequelize,
    modelName: 'ParametroUnidad',
    tableName: 'ParametroUnidads',
    timestamps: false
  });
  return ParametroUnidad;
};