'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeterminacionUnidad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DeterminacionUnidad.belongsTo(models.Determinacion)
      DeterminacionUnidad.belongsTo(models.Unidad)
      
    }

   



  }
  DeterminacionUnidad.init({

  }, {
    sequelize,
    modelName: 'DeterminacionUnidad',
    tableName:'determinacionUnidades',
    paranoid:true
  });
  return DeterminacionUnidad;
};