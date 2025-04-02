'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paciente extends Model {
    static associate(models) {
      Paciente.hasMany(models.Orden)
      Paciente.belongsTo(models.Usuario, { foreignKey: 'UsuarioId', as: 'Usuario' })
    }
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