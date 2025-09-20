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
        ExamenCategoria.hasMany(models.ExCategParametro, { foreignKey: 'examenCategoriaId' ,as: 'ExCategParametro3'});
        
        ExamenCategoria.belongsTo(models.Examen,    { foreignKey: 'ExamenId',    as: 'Examen' });
        ExamenCategoria.belongsTo(models.Categoria, { foreignKey: 'CategoriaId', as: 'Categoria' });

        ExamenCategoria.belongsToMany(models.Parametro, { through: models.ExCategParametro, foreignKey: 'examenCategoriaId', otherKey: 'parametroId', as: 'Parametro4' , sourceKey: 'id'});

    }
  }
  ExamenCategoria.init({id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  }, {
    sequelize,
    modelName: 'ExamenCategoria',
    tableName: 'ExamenCategorias',
    timestamps: false
  });
  return ExamenCategoria;
};

