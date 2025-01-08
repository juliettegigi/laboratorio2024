'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Examen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Examen.hasMany(models.OrdenExamen)
      Examen.hasMany(models.LaboratorioExamen)
      Examen.hasMany(models.ExamenDeterminacion)
      Examen.hasMany(models.ExamenCategoria)

      Examen.belongsTo(models.Muestra)

    }
  }
  Examen.init({
    codigo: DataTypes.STRING,
    nombre: DataTypes.STRING,
    tags: DataTypes.STRING,
    tiempoProcesamiento: DataTypes.INTEGER,
    laboratorioQueLoRealiza: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Examen',
    tableName: 'Examenes',
    timestamps: false
  });
  return Examen;
};