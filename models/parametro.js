'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parametro extends Model {
    
    static associate(models) {
      Parametro.hasMany(models.Determinacion,{foreignKey:'parametroId',as:'Determinacion1'})
      Parametro.hasMany(models.ExCategParametro)
      Parametro.hasMany(models.ParametroValorReferencia)
      Parametro.hasMany(models.ParametroUnidad)
      Parametro.hasMany(models.ParametroResultado)
      Parametro.hasMany(models.ParametroPadre,{foreignKey:'padreId',as:'misHijos'})
      Parametro.hasMany(models.ParametroPadre,{foreignKey:'hijoId',as:'misPadres'})
      
      Parametro.belongsToMany(models.Unidad,{through:'ParametroUnidad'})
      Parametro.belongsToMany(Parametro, {
             through: 'ParametroPadre',
             as: 'hijos',
             foreignKey: 'padreId',
             otherKey: 'hijoId'
           });
           
      Parametro.belongsToMany(Parametro, {
             through: 'ParametroPadre',
             as: 'padres',
             foreignKey: 'hijoId',
             otherKey: 'padreId'
           });


     Parametro.belongsToMany(models.ExamenCategoria, {
                through: models.ExCategParametro, 
                foreignKey: 'parametroId', 
                otherKey: 'examenCategoriaId', 
                as: 'ExamenCategoria3',sourceKey: 'id' });
       
      
    }
  }
  Parametro.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Parametro',
    tableName: 'Parametros',
    timestamps: false
  });
  return Parametro;
};