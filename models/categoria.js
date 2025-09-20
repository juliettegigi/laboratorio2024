'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
        Categoria.hasMany(models.ExamenCategoria, { foreignKey: 'CategoriaId', as: 'ExamenCategoria2' });
       Categoria.belongsToMany(models.Examen, { through: models.ExamenCategoria, foreignKey: 'CategoriaId', otherKey: 'ExamenId', as: 'Examenes' });
      }
  }
  Categoria.init({
     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName:'categorias',
    timestamps:false
  });
  return Categoria;
};