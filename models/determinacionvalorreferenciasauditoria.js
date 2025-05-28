'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeterminacionValorReferenciasAuditoria extends Model {
    static associate(models) {
        DeterminacionValorReferenciasAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        DeterminacionValorReferenciasAuditoria.belongsTo(models.DeterminacionValorReferencia, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  DeterminacionValorReferenciasAuditoria.init({
    operacion: DataTypes.STRING,   // Tipo de operación (CREATE, UPDATE, DELETE)
    registroId: DataTypes.INTEGER, // ID del registro afectado
    usuarioId: DataTypes.INTEGER,  // ID del usuario que hizo la operación
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'DeterminacionValorReferenciasAuditoria',
    tableName: 'DeterminacionValorReferenciasAuditorias',
    timestamps: false
  });

  return DeterminacionValorReferenciasAuditoria;
};