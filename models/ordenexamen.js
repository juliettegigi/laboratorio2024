'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrdenExamen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //OrdenExamen.hasMany(models.Resultado)

      OrdenExamen.belongsTo(models.Orden)
      OrdenExamen.belongsTo(models.Examen)
    }
  }
  OrdenExamen.init({
  }, {
    sequelize,
    modelName: 'OrdenExamen',
    tableName:'ordenExamenes'
  });
  return OrdenExamen;
};