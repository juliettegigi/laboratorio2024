'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bioquimico extends Model {
    static associate(models) {
      Bioquimico.belongsTo(models.Usuario, { foreignKey: 'UsuarioId', as: 'Usuario' })
      
    }
  }
  Bioquimico.init({
   matricula: DataTypes.STRING,
   titulo:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bioquimico',
    tableName:'Bioquimicos',
    timestamps:true,
    paranoid:true

  });



   

  Bioquimico.afterCreate(async (bioquimico, options) => {
    if (!options.transaction) {
      console.error("❌ Error: La transacción no fue pasada correctamente.");
      return;
    }
    
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'Registrar a usuario como bioquímico',
      registroId: bioquimico.UsuarioId,
      usuarioId: options.userId || null,
      fecha: new Date()
    }, { transaction: options.transaction });
  });

  Bioquimico.beforeUpdate(async (bioquimico, options) => {
    if (!options.transaction) {
      throw new Error("❌ beforeUpdate debe ejecutarse dentro de una transacción.");
    }
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'UPDATE bioquimico',
      registroId: bioquimico.UsuarioId,
      usuarioId: options.userId, 
      fecha: new Date()
    }, { transaction: options.transaction });
  });

  Bioquimico.beforeDestroy(async (bioquimico, options) => {
    const transaction = options.transaction || null;
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'DELETE bioquimico',
      registroId: bioquimico.UsuarioId,
      usuarioId: options.userId || null
    }, { transaction });
  });


  Bioquimico.beforeRestore(async (bioquimico, options) => {
    console.log("Restaurando bioquímico:", bioquimico.UsuarioId);
    await sequelize.models.UsuarioAuditoria.create({
      operacion: "RESTORE bioquimico",
      registroId: bioquimico.UsuarioId,
      usuarioId: options.userId || null, // Quién hizo la restauración
    });


  });
  return Bioquimico;
};