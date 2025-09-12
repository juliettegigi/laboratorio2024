'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExamenCategoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        ExamenCategoria.hasMany(models.ExCategDeterminacion, { foreignKey: 'ExamenCategoriaId' });
        ExamenCategoria.hasMany(models.ExCategParametro, { foreignKey: 'ExamenCategoriaId' });
        
        ExamenCategoria.belongsTo(models.Examen,    { foreignKey: 'ExamenId',    as: 'Examen' });
        ExamenCategoria.belongsTo(models.Categoria, { foreignKey: 'CategoriaId', as: 'Categoria' });
    }
  }
  ExamenCategoria.init({
  }, {
    sequelize,
    modelName: 'ExamenCategoria',
    tableName: 'ExamenCategorias',
    timestamps: false
  });
  return ExamenCategoria;
};