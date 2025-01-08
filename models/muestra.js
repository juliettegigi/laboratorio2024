'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Muestra extends Model {

    static associate(models) {
      Muestra.hasMany(models.Examen)
      Muestra.hasMany(models.MuestraRequerida);
    }

    
  }
  Muestra.init({
    
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Muestra',
    tableName:'Muestras'
  });
  return Muestra;
};