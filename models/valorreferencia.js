'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ValorReferencia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ValorReferencia.belongsTo(models.Determinacion)
    }


   static borradoLogico(arrayOstring){         
         if(Array.isArray(arrayOstring)){
            for(let id of arrayOstring){
              ValorReferencia.destroy({ where:{id} })
            }
         }
   }

   // pongo en null al campo deleted_At
   static activar(arrayOstring){         
    if(Array.isArray(arrayOstring)){
       for(let id of arrayOstring){
         ValorReferencia.restore({ where:{id} })
       }
    }
}


// get valores de ref por determinaciobId
static async getValoresRefByDeterminacion(determinacionId){
  const ordenUnidad = sequelize.fn('FIELD', 'unidadMin', 'Días', 'Semanas', 'Meses', 'Años');

  return await ValorReferencia.findAll({
    where: {determinacionId},
    order: [
      ['sexo', 'ASC'],  
      ordenUnidad,
      ['edadMin', 'ASC'] 
    ]    
});

}


// get Valores Ref By Determinacion y Sexo(req.body.determinacionId[0],c);
static async getValoresRefByDeterminacionSexo(determinacionId,sexo){
  const ordenUnidad = sequelize.fn('FIELD', 'unidadMin', 'Días', 'Semanas', 'Meses', 'Años');

  return await ValorReferencia.findAll({
    where: {determinacionId,sexo},
    order: [
      ['sexo', 'ASC'],  
      ordenUnidad,
      ['edadMin', 'ASC'] 
    ]    
});
}


// Actualizar
static async actualizar(arrayDeId){

  for(let id of arrayDeId){
          await ValorReferencia.update({
            nombre: 'nuevo nombre',
            descripcion: 'nueva descripción'
            }, {
            where: {
            id: idDelRegistro
            }
            });
  }
}




  

  }
  ValorReferencia.init({
    edadMin: DataTypes.INTEGER,
    unidadMin:DataTypes.ENUM('Días','Semanas', 'Meses', 'Años'),
    edadMax: DataTypes.INTEGER, 
    unidadMax:DataTypes.ENUM('Días','Semanas', 'Meses', 'Años'),
    sexo:DataTypes.ENUM('M','F','A'),
    valorMin:DataTypes.DECIMAL(10,2),
    valorMax:DataTypes.DECIMAL(10,2),
    nota:DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ValorReferencia',
    tableName:'valorreferencias',
    paranoid:true
  });
  return ValorReferencia;
};