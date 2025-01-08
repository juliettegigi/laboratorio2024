'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parametro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Parametro.hasMany(models.ExCategParametro)
      Parametro.hasMany(models.ParametroValorReferencia)
      Parametro.hasMany(models.ParametroUnidad)
    }
  }
  Parametro.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Parametro',
    tableName: 'Parametros',
    timestamps: false
  });
  return Parametro;
};