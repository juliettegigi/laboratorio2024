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
      Unidad.hasMany(models.DeterminacionUnidad);
      Unidad.hasMany(models.ParametroUnidad);
      Unidad.hasMany(models.Resultado);
     // Unidad.belongsToMany(models.Muestra,{through:'Determinacion'})
     Unidad.belongsToMany(models.Resultado,{through:'ResultadoUnidad'})
      
      
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