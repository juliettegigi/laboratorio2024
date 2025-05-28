'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MuestraRequeridasAuditoria extends Model {
    static associate(models) {
        MuestraRequeridasAuditoria.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'Usuario' });        
        MuestraRequeridasAuditoria.belongsTo(models.MuestraRequerida, { foreignKey: 'registroId', as: 'Registro' });
        }

  
  }

  MuestraRequeridasAuditoria.init({
    operacion: DataTypes.STRING,   // Tipo de operación (CREATE, UPDATE, DELETE)
    registroId: DataTypes.INTEGER, // ID del registro afectado
    usuarioId: DataTypes.INTEGER,  // ID del usuario que hizo la operación
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'MuestraRequeridasAuditoria',
    tableName: 'MuestraRequeridasAuditorias',
    timestamps: false
  });

  return MuestraRequeridasAuditoria;
};