'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Determinacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Determinacion.belongsTo(models.Muestra)
      Determinacion.belongsTo(models.Unidad)
      
      Determinacion.hasMany(models.ValorReferencia)
      Determinacion.hasMany(models.Sinonimo)
      Determinacion.hasMany(models.DeterminacionDet)
      Determinacion.hasMany(models.LaboratorioExamen)
      Determinacion.hasMany(models.OrdenExamen)

      Determinacion.belongsToMany(models.Orden,{through:'Resultado'})
      Determinacion.belongsToMany(models.ConjuntoDet,{through:'DeterminacionDet'})
     
    }

    static getDeterminaciones = async () => {
      let determinaciones = await Determinacion.findAll({
        include: [
          { model: sequelize.models.Muestra },
          {model:sequelize.models.Sinonimo},
          {model:sequelize.models.Unidad},
          {model:sequelize.models.ValorReferencia},
        ],
      }
    
      )
      
      return determinaciones;
    }



  }
  Determinacion.init({
    codigo: DataTypes.STRING,
    nombre: DataTypes.STRING,    
    tiempoProcesamiento: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'Determinacion',
    tableName:'determinaciones',
    paranoid:true
  });
  return Determinacion;
};