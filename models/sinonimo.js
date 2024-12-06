'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sinonimo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sinonimo.belongsTo(models.Determinacion)
    }
  }
  Sinonimo.init({
    sinonimo:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Sinonimo',
    tableName:"sinonimos",
    timestamps:false
  });
  return Sinonimo;
};