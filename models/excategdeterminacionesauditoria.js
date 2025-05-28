'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExCategDeterminacionesAuditoria extends Model {
    static associate(models) {
        ExCategDeterminacionesAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        ExCategDeterminacionesAuditoria.belongsTo(models.ExCategDeterminacion, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  ExCategDeterminacionesAuditoria.init({
    operacion: DataTypes.STRING,   // Tipo de operación (CREATE, UPDATE, DELETE)
    registroId: DataTypes.INTEGER, // ID del registro afectado
    usuarioId: DataTypes.INTEGER,  // ID del usuario que hizo la operación
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'ExCategDeterminacionesAuditoria',
    tableName: 'ExCategDeterminacionesAuditorias',
    timestamps: false
  });

  return ExCategDeterminacionesAuditoria;
};