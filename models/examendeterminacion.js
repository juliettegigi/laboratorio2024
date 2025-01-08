'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExamenDeterminacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ExamenDeterminacion.belongsTo(models.Examen)
      ExamenDeterminacion.belongsTo(models.Determinacion)
    }
  }
  ExamenDeterminacion.init({
  }, {
    sequelize,
    modelName: 'ExamenDeterminacion',
    tableName: 'ExamenDeterminaciones',
    timestamps: false
  });
  return ExamenDeterminacion;
};