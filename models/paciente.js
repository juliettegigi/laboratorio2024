'use strict';
const {
  Model,Op
} = require('sequelize');
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
  return Paciente;
};