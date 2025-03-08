'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeterminacionResultado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DeterminacionResultado.belongsTo(models.OrdenExamen);
      DeterminacionResultado.belongsTo(models.Unidad)
      DeterminacionResultado.belongsTo(models.Determinacion)
    }
  }
  DeterminacionResultado.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
    resultado:DataTypes.DECIMAL(10,2),
  }, {
    sequelize,
    modelName: 'DeterminacionResultado',
    tableName:'determinacionResultados',
    paranoid:true
  });
  return DeterminacionResultado;
};