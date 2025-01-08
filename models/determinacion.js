'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Determinacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Determinacion.hasMany(models.ExamenDeterminacion)
      Determinacion.hasMany(models.Determinacion)
      Determinacion.hasMany(models.DeterminacionValorReferencia)
      Determinacion.hasMany(models.DeterminacionUnidad)
      Determinacion.hasMany(models.ExCategDeterminacion)

      
    }



  }
  Determinacion.init({
    codigo: DataTypes.STRING,
    nombre: DataTypes.STRING,    
    tags: DataTypes.STRING,    

  }, {
    sequelize,
    modelName: 'Determinacion',
    tableName:'determinaciones',
    paranoid:true
  });
  return Determinacion;
};