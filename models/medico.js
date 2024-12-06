'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Medico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Medico.hasMany(models.Orden)
    }
  }
  Medico.init({
    nombre: DataTypes.STRING,
    email:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Medico',
    tableName:'medicos',
    timestamps:false
  });
  return Medico;
};