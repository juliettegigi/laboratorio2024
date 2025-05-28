'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdenExamen extends Model {
    
    static associate(models) { 
      OrdenExamen.belongsTo(models.Orden)
      OrdenExamen.belongsTo(models.Examen)
    }
  }
  OrdenExamen.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tieneResultado:DataTypes.BOOLEAN,
    isValidado:DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'OrdenExamen',
    tableName:'ordenExamenes'
  });
 
  

  OrdenExamen.afterCreate(async (ordenExamen, options) => {
    if (!options.transaction) {
      console.error("❌ Error: La transacción no fue pasada correctamente.");
      return;
    }
    
    await sequelize.models.OrdenExamenesAuditoria.create({
      operacion: 'CREATE',
      registroId: ordenExamen.id,
      usuarioId: options.userId || null,
      fecha: new Date()
    }, { transaction: options.transaction });
  });

  OrdenExamen.beforeUpdate(async (ordenExamen, options) => {

    if (options.skipAudit) return;
    if (!options.transaction) throw new Error("❌ beforeUpdate debe ejecutarse dentro de una transacción.");
    
  
    // ⚠️ Verificar que options.userId esté definido
    if (!options.userId) {
      console.warn("⚠️ options.userId no está definido en beforeUpdate");
      return;
    }
  

  
    // 2️⃣ Registrar auditoría
    await sequelize.models.OrdenAuditoria.create({
      operacion: 'UPDATE',
      registroId: orden.id,
      usuarioId: options.userId, 
      fecha: new Date()
    }, { transaction: options.transaction });
  });



  OrdenExamen.beforeDestroy(async (orden, options) => {
    const transaction = options.transaction || null;
  
    // Registrar la auditoría de la eliminación
    await sequelize.models.OrdenAuditoria.create({
      operacion: 'DELETE',
      registroId: orden.id,
      usuarioId: options.userId || null
    }, { transaction });
  });


  OrdenExamen.afterRestore(async (orden, options) => {


    await sequelize.models.OrdenAuditoria.create({
      operacion: "RESTORE",
      registroId: orden.id,
      usuarioId: options.userId || null, // Quién hizo la restauración
      fecha: new Date()
    });


  });

  return OrdenExamen;
};