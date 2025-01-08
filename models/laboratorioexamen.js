'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LaboratorioExamen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LaboratorioExamen.belongsTo(models.Examen);
    }
  }
  LaboratorioExamen.init({
  }, {
    sequelize,
    modelName: 'LaboratorioExamen',
    tableName:'LaboratorioExamenes'
  });
  return LaboratorioExamen;
};