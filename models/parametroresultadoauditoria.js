'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParametroResultadoAuditoria extends Model {
    static associate(models) {
        ParametroResultadoAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        ParametroResultadoAuditoria.belongsTo(models.ParametroResultado, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  ParametroResultadoAuditoria.init({
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
    modelName: 'ParametroResultadoAuditoria',
    tableName: 'parametroResultadoAuditorias',
    timestamps: false
  });

  return ParametroResultadoAuditoria;
};