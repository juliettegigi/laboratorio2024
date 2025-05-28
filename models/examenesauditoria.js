'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExamenesAuditoria extends Model {
    static associate(models) {
        ExamenesAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        ExamenesAuditoria.belongsTo(models.Examen, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  ExamenesAuditoria.init({
    operacion: DataTypes.STRING,   // Tipo de operación (CREATE, UPDATE, DELETE)
    registroId: DataTypes.INTEGER, // ID del registro afectado
    usuarioId: DataTypes.INTEGER,  // ID del usuario que hizo la operación
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'ExamenesAuditoria',
    tableName: 'examenesAuditorias',
    timestamps: false
  });

  return ExamenesAuditoria;
};