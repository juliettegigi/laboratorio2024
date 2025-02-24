'use strict';
const {
  Model,Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.belongsToMany(models.Rol, {through:"UsuarioRol"})
      Usuario.hasMany(models.UsuarioRol);
     
      Usuario.hasOne(models.Paciente, { foreignKey: 'UsuarioId', as: 'Paciente' });
      Usuario.hasMany(models.Telefono)
    }
    


    static getUsuariosByEmailOdniOnombre=async(termino,limit=5,offset=0)=>{
      try{
        const pacientes= await Usuario.findAndCountAll({ include: [ { model: sequelize.models.Rol, through: sequelize.models.UsuarioRol, 
                                                                       where: { nombre: 'Paciente' }},
                                                                    {model: sequelize.models.Telefono}
                                                                      
                                                                      ],
                                                        where: { [Op.or]: [{ documento: { [Op.regexp]: termino } },
                                                                           { email: { [Op.regexp]: termino } },
                                                                           { apellido: { [Op.regexp]: termino } }]},
                                                        attributes: { exclude: ['pass'] },
                                                        order: [
                                                          ['apellido', 'ASC'],  
                                                          ['nombre', 'ASC']     
                                                        ],
                                                        limit,
                                                        offset
                                                      });
        
        return pacientes; //retorna objeto.count() y objeto.rows(este es el arreglo de pacientes)
      }catch(error){
        console.log('models==>usuario');
        throw error;
      }
    }




  }
  Usuario.init({
    nombre: DataTypes.STRING,
    apellido:DataTypes.STRING,
    email:DataTypes.STRING,
    pass:DataTypes.STRING,
    documento:DataTypes.STRING,
    nickName:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName:'usuarios',
    paranoid:true
  });
  return Usuario;
};