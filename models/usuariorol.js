'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioRol extends Model {
    static associate(models) {
      UsuarioRol.belongsTo(models.Usuario);
      UsuarioRol.belongsTo(models.Rol);
    }
  }
  UsuarioRol.init({
  }, {
    sequelize,
    modelName: 'UsuarioRol',
    tableName:"usuarioroles",
    paranoid:true
  });
  return UsuarioRol;
};