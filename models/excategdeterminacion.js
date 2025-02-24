'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExCategDeterminacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExCategDeterminacion.belongsTo(models.Determinacion,{ foreignKey: 'ExamenCategoriaId' })
      ExCategDeterminacion.belongsTo(models.ExamenCategoria)
    }
  }
  ExCategDeterminacion.init({
  }, {
    sequelize,
    modelName: 'ExCategDeterminacion',
    tableName:"exCategDeterminaciones"
  });
  return ExCategDeterminacion;
};