'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bioquimico extends Model {
    static associate(models) {
      Bioquimico.belongsTo(models.Usuario, { foreignKey: 'UsuarioId', as: 'Usuario' })
          
    }
  }
  Bioquimico.init({
   matricula: DataTypes.STRING,
   titulo:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bioquimico',
    tableName:'Bioquimicos',
    timestamps:true,
    paranoid:true
  });
  return Bioquimico;
};