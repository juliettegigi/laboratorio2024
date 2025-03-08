'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParametroResultado extends Model {
    
    static associate(models) {
      ParametroResultado.belongsTo(models.OrdenExamen);
      ParametroResultado.belongsTo(models.Unidad)
      ParametroResultado.belongsTo(models.Parametro)
    }
  }
  ParametroResultado.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
    resultado:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ParametroResultado',
    tableName:'parametroResultados',
    paranoid:true
  });
  return ParametroResultado;
};