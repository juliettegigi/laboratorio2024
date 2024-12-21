'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConjuntoDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ConjuntoDet.hasMany(models.DeterminacionDet);
      ConjuntoDet.hasMany(models. OrdenConjuntoDet);

      ConjuntoDet.belongsToMany(models.Determinacion,{through:'DeterminacionDet'})
      
     
    }
  }
  ConjuntoDet.init({
    codigo:DataTypes.STRING,
    nombre: DataTypes.STRING,
    tiempoProcesamiento:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ConjuntoDet',
    tableName: 'conjuntodets',
    paranoid: true
  });
  return ConjuntoDet;
};