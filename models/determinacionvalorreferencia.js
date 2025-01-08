'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeterminacionValorReferencia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DeterminacionValorReferencia.belongsTo(models.Determinacion)
    }
  }
  DeterminacionValorReferencia.init({
    edadMin: DataTypes.INTEGER,
    edadMax: DataTypes.INTEGER, 
    sexo:DataTypes.ENUM('M','F','A'),
    valorMin:DataTypes.DECIMAL(10,2),
    valorMax:DataTypes.DECIMAL(10,2),
    nota:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'DeterminacionValorReferencia',
    tableName: 'DeterminacionValorReferencias',
    timestamps: false
  });
  return DeterminacionValorReferencia;
};