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
      ExCategDeterminacion.belongsTo(models.ExamenCategoria)
      ExCategDeterminacion.belongsTo(models.Determinacion)
    }
  }
  ExCategDeterminacion.init({
    ExamenCategoriaId:DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'ExCategDeterminacion',
    tableName: 'ExCategDeterminaciones',
    timestamps: false
  });
  return ExCategDeterminacion;
};