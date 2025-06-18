'use strict';
const {
  Model,Op
} = require('sequelize');
const usuario = require('./usuario');
module.exports = (sequelize, DataTypes) => {
  class Paciente extends Model {
    static associate(models) {
      Paciente.hasMany(models.Orden)
      Paciente.belongsTo(models.Usuario, { foreignKey: 'UsuarioId', as: 'Usuario' })
    }
    
   static findPacienteByEmailODocumento = async (email,documento) => {
      const paciente = await Paciente.findOne({
        include: {
          model:sequelize.models.Usuario,
          as: 'Usuario',
          where: {
            [Op.or]: [
              { email },
              { documento }
            ]
          }
        }
      });
    
      return paciente;
    };

  }
  Paciente.init({
    nacimiento: DataTypes.DATEONLY,
    embarazada: DataTypes.BOOLEAN,
    provincia: DataTypes.STRING,
    localidad: DataTypes.STRING,
    direccion: DataTypes.STRING,
    edad:DataTypes.INTEGER,
    sexo: DataTypes.ENUM(['Masculino', 'Femenino', 'Otro','Prefiero no decirlo'])

  }, {
    sequelize,
    modelName: 'Paciente',
    tableName:'Pacientes',
    timestamps:true,
    paranoid:true
  });



  

  Paciente.afterCreate(async (paciente, options) => {
    if (!options.transaction) {
      console.error("❌ Error: La transacción no fue pasada correctamente.");
      return;
    }
    
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'Registrar a usuario como paciente',
      registroId: paciente.UsuarioId,
      usuarioId: options.userId || null,
      fecha: new Date()
    }, { transaction: options.transaction });
  });

  Paciente.beforeUpdate(async (paciente, options) => {
    if (!options.transaction) {
      throw new Error("❌ beforeUpdate debe ejecutarse dentro de una transacción.");
    }
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'UPDATE paciente',
      registroId: paciente.UsuarioId,
      usuarioId: options.userId, 
      fecha: new Date()
    }, { transaction: options.transaction });
  });

  Paciente.beforeDestroy(async (paciente, options) => {
    const transaction = options.transaction || null;
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'DELETE paciente',
      registroId: paciente.UsuarioId,
      usuarioId: options.userId || null
    }, { transaction });
  });


  Paciente.afterRestore(async (paciente, options) => {
    await sequelize.models.UsuarioAuditoria.create({
      operacion: "RESTORE paciente",
      registroId: paciente.UsuarioId,
      usuarioId: options.userId || null, // Quién hizo la restauración
      fecha: new Date()
    });


  });
  return Paciente;
};