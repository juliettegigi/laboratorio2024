'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tecnico extends Model {
    static associate(models) {
      Tecnico.belongsTo(models.Usuario, { foreignKey: 'UsuarioId', as: 'Usuario' })
          
    }
  }
  Tecnico.init({
  }, {
    sequelize,
    modelName: 'Tecnico',
    tableName:'Tecnicos',
    timestamps:true,
    paranoid:true
  });



  

  Tecnico.afterCreate(async (tecnico, options) => {
    if (!options.transaction) {
      console.error("❌ Error: La transacción no fue pasada correctamente.");
      return;
    }
    
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'Registrar a usuario como técnico',
      registroId: tecnico.UsuarioId,
      usuarioId: options.userId || null,
      fecha: new Date()
    }, { transaction: options.transaction });
  });

  Tecnico.beforeUpdate(async (tecnico, options) => {
    if (!options.transaction) {
      throw new Error("❌ beforeUpdate debe ejecutarse dentro de una transacción.");
    }
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'UPDATE técnico',
      registroId: tecnico.UsuarioId,
      usuarioId: options.userId, 
      fecha: new Date()
    }, { transaction: options.transaction });
  });

  Tecnico.beforeDestroy(async (tecnico, options) => {
    const transaction = options.transaction || null;
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'DELETE técnico',
      registroId: tecnico.UsuarioId,
      usuarioId: options.userId || null
    }, { transaction });
  });


  Tecnico.afterRestore(async (tecnico, options) => {
    await sequelize.models.UsuarioAuditoria.create({
      operacion: "RESTORE técnico",
      registroId: tecnico.UsuarioId,
      usuarioId: options.userId || null, // Quién hizo la restauración
      fecha: new Date()
    });


  });
  return Tecnico;
};