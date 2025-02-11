'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeterminacionPadre extends Model {
    
    static associate(models) {
      DeterminacionPadre.belongsTo(models.Determinacion, {
        foreignKey: 'padreId',as: 'parent'
      });
      DeterminacionPadre.belongsTo(models.Determinacion, {
        foreignKey: 'determinacionId',as: 'child'
      });

    }



  }
  DeterminacionPadre.init({

  }, {
    sequelize,
    modelName: 'DeterminacionPadre',
    tableName:'determinacionPadres',
    paranoid:true
  });
  return DeterminacionPadre;
};