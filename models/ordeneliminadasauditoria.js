'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdenEliminadasAuditoria extends Model {
    static associate(models) {
        OrdenEliminadasAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        OrdenEliminadasAuditoria.belongsTo(models.OrdenEliminada, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  OrdenEliminadasAuditoria.init({
    operacion: DataTypes.STRING,   // Tipo de operación (CREATE, UPDATE, DELETE)
    registroId: DataTypes.INTEGER, // ID del registro afectado
    usuarioId: DataTypes.INTEGER,  // ID del usuario que hizo la operación
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'OrdenEliminadasAuditoria',
    tableName: 'OrdenEliminadasAuditorias',
    timestamps: false
  });

  return OrdenEliminadasAuditoria;
};