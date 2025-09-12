'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeterminacionResultadoAuditoria extends Model {
    static associate(models) {
        DeterminacionResultadoAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        DeterminacionResultadoAuditoria.belongsTo(models.DeterminacionResultado, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  DeterminacionResultadoAuditoria.init({
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
    modelName: 'DeterminacionResultadoAuditoria',
    tableName: 'determinacionResultadoAuditorias',
    timestamps: false
  });

  return DeterminacionResultadoAuditoria;
};