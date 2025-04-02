'use strict';
const {
  Model,Op
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsToMany(models.Rol, {through:"UsuarioRol"})
      Usuario.hasMany(models.UsuarioRol);
     
      Usuario.hasOne(models.Paciente, { foreignKey: 'UsuarioId', as: 'Paciente' });
      Usuario.hasOne(models.Bioquimico, { foreignKey: 'UsuarioId', as: 'Bioquimico' });
      Usuario.hasOne(models.Tecnico, { foreignKey: 'UsuarioId', as: 'Tecnico' });
      Usuario.hasMany(models.Telefono, { foreignKey: 'UsuarioId' });
      Usuario.hasMany(models.UsuarioAuditoria, { foreignKey: 'UsuarioId' });
    }
    

    static getUsuariosByEmailOdniOnombre = async (termino, limit = 5, offset = 0, {tablas, roles},paranoid=true) => {
      try {
        let where = {};
    
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
        // Incluir tablas adicionales en la consulta
       if(tablas){ 
            
                // Incluir los tablas relacionados si los parámetros lo indican
                if (tablas.includes("paciente")) {
                  includes.push({ model: sequelize.models.Paciente, as: 'Paciente', required: true });
                }
                if (tablas.includes("bioquimico")) {
                  includes.push({ model: sequelize.models.Bioquimico, as: 'Bioquimico', required: true });
                }
                if (tablas.includes("tecnico")) {
                  includes.push({ model: sequelize.models.Tecnico, as: 'Tecnico', required: true });
                }
        }else{
          
            includes.push({ model: sequelize.models.Rol});
          
        }
    
        // Incluir los roles y filtrar por los roles proporcionados
        if (roles) {
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
          paranoid
        });
    
      
    
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


  

  Usuario.afterCreate(async (usuario, options) => {
    if (!options.transaction) {
      console.error("❌ Error: La transacción no fue pasada correctamente.");
      return;
    }
    
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'CREATE',
      registroId: usuario.id,
      usuarioId: options.userId || null,
      datosNuevos: JSON.stringify(usuario.toJSON()),
      fecha: new Date()
    }, { transaction: options.transaction });
  });

  Usuario.beforeUpdate(async (usuario, options) => {

    console.log("✅ beforeUpdate ejecutado para Usuario ID:", usuario.id);
    if (!options.transaction) {
      throw new Error("❌ beforeUpdate debe ejecutarse dentro de una transacción.");
    }
  
    // ⚠️ Verificar que options.userId esté definido
    if (!options.userId) {
      console.warn("⚠️ options.userId no está definido en beforeUpdate");
      return;
    }
  
    // 1️⃣ Obtener los datos antiguos antes de actualizar
    const usuarioAnterior = await Usuario.findOne({
      where: { id: usuario.id },
      transaction: options.transaction,
      raw: true
    });
  
    if (!usuarioAnterior) return;
  
    // 2️⃣ Registrar auditoría
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'UPDATE',
      registroId: usuario.id,
      usuarioId: options.userId, // ⚠️ Ahora debería existir
      datosAntiguos: JSON.stringify(usuarioAnterior),
      datosNuevos: JSON.stringify(usuario.dataValues),
      fecha: new Date()
    }, { transaction: options.transaction });
  });

  Usuario.beforeDestroy(async (usuario, options) => {
    const transaction = options.transaction || null;
  
    // Marcar los registros relacionados como eliminados (soft delete)
    await sequelize.models.Paciente.update(
      { deletedAt: new Date() },
      { where: { UsuarioId: usuario.id }, transaction }
    );
    await sequelize.models.Bioquimico.update(
      { deletedAt: new Date() },
      { where: { UsuarioId: usuario.id }, transaction }
    );
    await sequelize.models.Tecnico.update(
      { deletedAt: new Date() },
      { where: { UsuarioId: usuario.id }, transaction }
    );
  
    // Registrar la auditoría de la eliminación
    await sequelize.models.UsuarioAuditoria.create({
      operacion: 'DELETE',
      registroId: usuario.id,
      usuarioId: options.userId || null
    }, { transaction });
  });


  Usuario.afterRestore(async (usuario, options) => {
    await sequelize.models.Paciente.restore({
      where: { UsuarioId: usuario.id }
    });
    await sequelize.models.Bioquimico.restore({
      where: { UsuarioId: usuario.id }
    });
    await sequelize.models.Tecnico.restore({
      where: { UsuarioId: usuario.id }
    });


    await sequelize.models.UsuarioAuditoria.create({
      operacion: "RESTORE",
      registroId: usuario.id,
      usuarioId: options.userId || null, // Quién hizo la restauración
      fecha: new Date()
    });


  });

  return Usuario;
};