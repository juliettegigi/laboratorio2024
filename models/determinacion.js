'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Determinacion extends Model {
    static associate(models) {
      Determinacion.hasMany(models.ExamenDeterminacion)
      Determinacion.hasMany(models.DeterminacionValorReferencia, { as: 'valoresReferencia' });
      Determinacion.hasMany(models.DeterminacionUnidad)
      Determinacion.hasMany(models.ExCategDeterminacion)

      Determinacion.belongsToMany(models.Determinacion, {
        through: models.DeterminacionPadre,
        as: 'parents',            // Alias para obtener los padres
        foreignKey: 'determinacionId', // En la tabla intermedia, el id de la determinación hija
        otherKey: 'padreId'       // En la tabla intermedia, el id del padre
      });

      Determinacion.belongsToMany(models.Determinacion, {
        through: models.DeterminacionPadre,
        as: 'children',           // Alias para obtener los hijos
        foreignKey: 'padreId',    // En la tabla intermedia, el id del padre
        otherKey: 'determinacionId' // En la tabla intermedia, el id de la determinación hija
      });

      Determinacion.belongsToMany(models.Unidad,{through:'DeterminacionUnidad'})
      

    }



  }
  Determinacion.init({
    codigo: DataTypes.STRING,
    nombre: DataTypes.STRING,    
    tags: DataTypes.STRING,    

  }, {
    sequelize,
    modelName: 'Determinacion',
    tableName:'determinaciones',
    paranoid:true
  });
  return Determinacion;
};