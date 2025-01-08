'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paciente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Paciente.hasMany(models.Orden)
      Paciente.belongsTo(models.Usuario)
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