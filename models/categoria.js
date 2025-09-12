'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
        Categoria.hasMany(models.ExamenCategoria, { foreignKey: 'CategoriaId', as: 'ExamenCategoria' });
    }
  }
  Categoria.init({
    nombre: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName:'categorias',
    timestamps:false
  });
  return Categoria;
};