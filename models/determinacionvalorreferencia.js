'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeterminacionValorReferencia extends Model {
    static associate(models) {
      DeterminacionValorReferencia.belongsTo(models.Determinacion)
    }
  }
  DeterminacionValorReferencia.init({
    edadMin: DataTypes.INTEGER,
    unidadMin: DataTypes.ENUM('Días', 'Meses', 'Años','-'),
    edadMax: DataTypes.INTEGER, 
    unidadMax: DataTypes.ENUM('Días', 'Meses', 'Años','-'), 
    sexo:DataTypes.ENUM('M','F','A'),
    valorMin:DataTypes.DECIMAL(10,2),
    valorMax:DataTypes.DECIMAL(10,2),
    nota:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'DeterminacionValorReferencia',
    tableName: 'DeterminacionValorReferencias',
    timestamps: true,
    paranoid:true
  });
  return DeterminacionValorReferencia;
};