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
        ExCategParametro.belongsTo(models.ExamenCategoria, { foreignKey: 'ExamenCategoriaId' , as:'ExamenCategoria'})
        ExCategParametro.belongsTo(models.Parametro, { foreignKey: 'ParametroId' , as:'Parametro5'})
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