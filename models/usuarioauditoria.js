'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioAuditoria extends Model {
    static associate(models) {
        UsuarioAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        UsuarioAuditoria.belongsTo(models.Usuario, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  UsuarioAuditoria.init({
    operacion: DataTypes.STRING,   // Tipo de operación (CREATE, UPDATE, DELETE)
    registroId: DataTypes.INTEGER, // ID del registro afectado
    usuarioId: DataTypes.INTEGER,  // ID del usuario que hizo la operación
    datosAntiguos: DataTypes.JSON, // Datos anteriores (solo para UPDATE)
    datosNuevos: DataTypes.JSON,   // Datos nuevos (solo para UPDATE)
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'UsuarioAuditoria',
    tableName: 'usuarioAuditorias',
    timestamps: false
  });

  return UsuarioAuditoria;
};