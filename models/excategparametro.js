'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExCategParametro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        ExCategParametro.belongsTo(models.ExamenCategoria, { foreignKey: 'ExamenCategoriaId' })
        ExCategParametro.belongsTo(models.Parametro)
    }
  }
  ExCategParametro.init({
  }, {
    sequelize,
    modelName: 'ExCategParametro',
    tableName: 'ExCategParametros',
    timestamps: false
  });
  return ExCategParametro;
};