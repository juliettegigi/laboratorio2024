'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParametroValorReferencia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ParametroValorReferencia.belongsTo(models.Parametro, { foreignKey: 'parametroId', as: 'Parametro2' })
    }
  }
  ParametroValorReferencia.init({
    edadMin: DataTypes.INTEGER,
    edadMax: DataTypes.INTEGER, 
    sexo:DataTypes.ENUM('M','F','A'),
    valorMin:DataTypes.DECIMAL(10,2),
    valorMax:DataTypes.DECIMAL(10,2),
    nota:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ParametroValorReferencia',
    tableName: 'ParametroValorReferencias',
    timestamps: false
  });
  return ParametroValorReferencia;
};