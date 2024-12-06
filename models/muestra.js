'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Muestra extends Model {

    static associate(models) {
      Muestra.hasMany(models.Determinacion)
      Muestra.hasMany(models.MuestraPresentada);
      
      Muestra.belongsToMany(models.Orden,{through:'MuestraPresentada'})
      //Muestra.belongsToMany(models.Unidad,{through:'Determinacion'})
    }

    static getMuestras = async () => {
      let muestras = await Muestra.findAll();
      return muestras;
    }
    
  }
  Muestra.init({
    
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Muestra',
    tableName:'muestras'
  });
  return Muestra;
};