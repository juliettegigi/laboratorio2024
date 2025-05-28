'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExCategParametrosAuditoria extends Model {
    static associate(models) {
        ExCategParametrosAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        ExCategParametrosAuditoria.belongsTo(models.ExCategParametro, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  ExCategParametrosAuditoria.init({
    operacion: DataTypes.STRING,   // Tipo de operación (CREATE, UPDATE, DELETE)
    registroId: DataTypes.INTEGER, // ID del registro afectado
    usuarioId: DataTypes.INTEGER,  // ID del usuario que hizo la operación
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'ExCategParametrosAuditoria',
    tableName: 'ExCategParametrosAuditorias',
    timestamps: false
  });

  return ExCategParametrosAuditoria;
};