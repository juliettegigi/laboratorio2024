'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdenAuditoria extends Model {
    static associate(models) {
        OrdenAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        OrdenAuditoria.belongsTo(models.Orden, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  OrdenAuditoria.init({
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
    modelName: 'OrdenAuditoria',
    tableName: 'ordenAuditorias',
    timestamps: false
  });

  return OrdenAuditoria;
};