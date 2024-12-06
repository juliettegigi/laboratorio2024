'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Diagnostico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Diagnostico.hasMany(models.Orden)
    }
  }
  Diagnostico.init({
    diagnostico: DataTypes.STRING,
    codigo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Diagnostico',
    tableName:'diagnosticos',
    timestamps:false
  });
  return Diagnostico;
};