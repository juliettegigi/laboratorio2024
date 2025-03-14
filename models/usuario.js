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
      Usuario.hasOne(models.Bioquimico, { foreignKey: 'UsuarioId', as: 'Bioquimico' });
      Usuario.hasOne(models.Tecnico, { foreignKey: 'UsuarioId', as: 'Tecnico' });
      Usuario.hasMany(models.Telefono)
    }
    

    static getUsuariosByEmailOdniOnombre = async (termino, limit = 5, offset = 0, modelos = [], roles = []) => {
      try {
        let where = {};
        console.log("termino ---> ", termino);
        console.log("roles ---> ", roles);
    
        // Filtros para el término de búsqueda
        if (termino !== "") {
          where = {
            [Op.or]: [
              { documento: { [Op.regexp]: termino } },
              { email: { [Op.regexp]: termino } },
              { apellido: { [Op.regexp]: termino } },
              { nombre: { [Op.regexp]: termino } },
            ],
          };
        }
    
        let includes = [{ model: sequelize.models.Telefono }];
        // Incluir modelos adicionales en la consulta
       if(modelos.length>0){ 
            
                // Incluir los modelos relacionados si los parámetros lo indican
                if (modelos.includes("paciente")) {
                  includes.push({ model: sequelize.models.Paciente, as: 'Paciente', required: true });
                }
                if (modelos.includes("bioquimico")) {
                  includes.push({ model: sequelize.models.Bioquimico, as: 'Bioquimico', required: true });
                }
                if (modelos.includes("tecnico")) {
                  includes.push({ model: sequelize.models.Tecnico, as: 'Tecnico', required: true });
                }
        }else{
          
            includes.push({ model: sequelize.models.Rol});
          
        }
    
        // Incluir los roles y filtrar por los roles proporcionados
        if (roles.length > 0) {
          includes.push({
            model: sequelize.models.Rol, // Ajusta el nombre de tu modelo Rol si es diferente
            where: {
              nombre: { [Op.in]: roles } // Filtrar por los roles pasados como parámetro
            },
            required: true, // Esto hace un inner join, solo se incluirán los usuarios con los roles especificados
          });
        }
    
        // Realizar la consulta con las condiciones de búsqueda
        const usuarios = await Usuario.findAndCountAll({
          include: includes,
          where,
          attributes: { exclude: ['pass'] },
          order: [
            ['apellido', 'ASC'],
            ['nombre', 'ASC'],
          ],
          limit,
          offset,
        });
    
        console.log("count  ", usuarios.count);
        console.log("count ******************************************** ", usuarios.count);
        console.log("count  ", usuarios.rows);
        
        console.log("cojones ******************************************** ", usuarios.count);
        console.log("count  ", usuarios.rows[0].Rols);
    
        return usuarios; // Retorna los usuarios con los roles filtrados
      } catch (error) {
        console.log('models==>usuario');
        throw error;
      }
    };


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