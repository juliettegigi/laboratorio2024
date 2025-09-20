'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Determinacion extends Model {
    static associate(models) {
      Determinacion.belongsTo(models.Parametro, { foreignKey: 'parametroId', as: 'Parametro4' })

    }



  }
  Determinacion.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        codigo:DataTypes.STRING,
        tags:DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'Determinacion',
    tableName:'determinaciones',
    paranoid:true
  });
  return Determinacion;
};