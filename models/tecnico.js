'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tecnico extends Model {
    static associate(models) {
      Tecnico.belongsTo(models.Usuario, { foreignKey: 'UsuarioId', as: 'Usuario' })
          
    }
  }
  Tecnico.init({
  }, {
    sequelize,
    modelName: 'Tecnico',
    tableName:'Tecnicos',
    timestamps:true,
    paranoid:true
  });
  return Tecnico;
};