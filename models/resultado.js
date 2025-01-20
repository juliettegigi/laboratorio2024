'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Resultado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Resultado.belongsTo(models.OrdenExamen);
      Resultado.belongsTo(models.Unidad);

      Resultado.belongsToMany(models.Unidad,{through:'ResultadoUnidad'})
    }
  }
  Resultado.init({
    resultado: DataTypes.DECIMAL(10,2),
    paranoid:true
  }, {
    sequelize,
    modelName: 'Resultado',
    tableName: 'Resultados'
  });
  return Resultado;
};