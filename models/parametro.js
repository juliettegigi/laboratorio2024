'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parametro extends Model {
    
    static associate(models) {
      Parametro.hasMany(models.ExCategParametro)
      Parametro.hasMany(models.ParametroValorReferencia)
      Parametro.hasMany(models.ParametroUnidad)
      Parametro.hasMany(models.ParametroResultado)
      
      Parametro.belongsToMany(models.Unidad,{through:'ParametroUnidad'})
      
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