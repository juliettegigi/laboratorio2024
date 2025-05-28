'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdenExamenesAuditoria extends Model {
    static associate(models) {
        OrdenExamenesAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        OrdenExamenesAuditoria.belongsTo(models.OrdenExamen, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  OrdenExamenesAuditoria.init({
    operacion: DataTypes.STRING,   // Tipo de operación (CREATE, UPDATE, DELETE)
    registroId: DataTypes.INTEGER, // ID del registro afectado
    usuarioId: DataTypes.INTEGER,  // ID del usuario que hizo la operación
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'OrdenExamenesAuditoria',
    tableName: 'OrdenExamenesAuditorias',
    timestamps: false
  });

  return OrdenExamenesAuditoria;
};