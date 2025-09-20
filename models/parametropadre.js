'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParametroPadre extends Model {
    
    static associate(models) {
      ParametroPadre.belongsTo(models.Parametro, {
        foreignKey: 'padreId',as: 'padre'
      });
      ParametroPadre.belongsTo(models.Parametro, {
        foreignKey: 'hijoId',as: 'hijo'
      });

    }



  }
  ParametroPadre.init({

  }, {
    sequelize,
    modelName: 'ParametroPadre',
    tableName:'parametroPadres',
    paranoid:true
  });
  return ParametroPadre;
};