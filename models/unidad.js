'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unidad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Unidad.hasMany(models.ParametroUnidad);
      Unidad.hasMany(models.ParametroResultado);
      
      
    }

    static getUnidades = async () => {
      let unidades = await Unidad.findAll({ order: [ [sequelize.col('unidad'), 'ASC']],raw: true});
      return unidades;
    }
  }
  Unidad.init({
    unidad: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Unidad',
    tableName:'unidades'
  });
  return Unidad;
};