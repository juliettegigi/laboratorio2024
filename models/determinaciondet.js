'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeterminacionDet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DeterminacionDet.belongsTo(models.Determinacion)
      DeterminacionDet.belongsTo(models.ConjuntoDet)
      
    }
  }
  DeterminacionDet.init({
    ConjuntoDetId: DataTypes.INTEGER,
    DeterminacionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DeterminacionDet',
    tableName:'DeterminacionDets'
  });
  return DeterminacionDet;
};