'use strict';
const {
  Model,Op,
  BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orden extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Orden.belongsTo(models.Paciente);
      Orden.belongsTo(models.Medico);
      Orden.belongsTo(models.Diagnostico);
      Orden.belongsTo(models.Estado);     

     
      Orden.hasMany(models.OrdenEliminada);
      Orden.hasMany(models.OrdenExamen);
      Orden.hasMany(models.MuestraRequerida);
      Orden.hasMany(models.OrdenAuditoria, { foreignKey: 'RegistroId' });
     
      Orden.belongsToMany(models.Muestra,{through:'MuestraRequerida'});
      Orden.belongsToMany(models.Examen,{through:'OrdenExamen'});
      
      
     
    }

static getOrdenById = async (termino, limit = 5, offset = 0,{estados}, paranoid=true) => {
      try {
        let where = {};
      
    
        // Filtros para el término de búsqueda
        if (termino !== "") {
          where = {
            [Op.or]: [
              { id: { [Op.regexp]: termino } },
              { PacienteId: { [Op.regexp]: termino } }
            ],
          };
        }
    
       
        let includes = [{ model: sequelize.models.Paciente , include: [{ model: sequelize.models.Usuario , as: 'Usuario'}]}];
        // Incluir tablas adicionales en la consulta
        if(estados){ 
          includes.push(  {
            model: sequelize.models.Estado,
            where: {
              nombre: {
                [Op.in]: estados, // Filtra por nombres de estados que estén en el array
              },
            },
            required: true 
          },);
      
        }
        else{
          includes.push(  {
            model: sequelize.models.Estado,
        });
        }
       
        // Realizar la consulta con las condiciones de búsqueda
        const ordenes = await Orden.findAndCountAll({
          include:includes,
          where,
          limit,
          offset,
          paranoid
        });
    
        return ordenes; // Retorna los usuarios con los roles filtrados
      } catch (error) {
        console.log('models==>usuario');
        throw error;
      }
    };


  }
  Orden.init({
    isPresuntivo:DataTypes.BOOLEAN,
    fecha:DataTypes.DATE,
    fechaEntrega:DataTypes.DATE,
    tiempoDeProcesamiento: DataTypes.INTEGER,
    isUrgente:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Orden',
    tableName:'ordenes',
    paranoid:true
  });

  Orden.afterCreate(async (orden, options) => {
    if (!options.transaction) {
      console.error("❌ Error: La transacción no fue pasada correctamente.");
      return;
    }
    
    await sequelize.models.OrdenAuditoria.create({
      operacion: 'CREATE',
      registroId: orden.id,
      usuarioId: options.userId || null,
      datosNuevos: JSON.stringify(orden.toJSON()),
      fecha: new Date()
    }, { transaction: options.transaction });
  });

  Orden.beforeUpdate(async (orden, options) => {

    if (options.skipAudit) return;
    if (!options.transaction) throw new Error("❌ beforeUpdate debe ejecutarse dentro de una transacción.");
    
  
    // ⚠️ Verificar que options.userId esté definido
    if (!options.userId) {
      console.warn("⚠️ options.userId no está definido en beforeUpdate");
      return;
    }
  
    // 1️⃣ Obtener los datos antiguos antes de actualizar
    const ordenAnterior = await Orden.findOne({
      where: { id: orden.id },
      include: [
        { model: sequelize.models.OrdenExamen },
        { model: sequelize.models.MuestraRequerida }
      ],
      transaction: options.transaction
    });
  
    if (!ordenAnterior) return;
  
    // 2️⃣ Registrar auditoría
    await sequelize.models.OrdenAuditoria.create({
      operacion: 'UPDATE',
      registroId: orden.id,
      usuarioId: options.userId, // ⚠️ Ahora debería existir
      datosAntiguos: JSON.stringify(ordenAnterior.toJSON()),
      datosNuevos: JSON.stringify(orden.toJSON()),
      fecha: new Date()
    }, { transaction: options.transaction });
  });



  Orden.beforeDestroy(async (orden, options) => {
    const transaction = options.transaction || null;
  
    // Registrar la auditoría de la eliminación
    await sequelize.models.OrdenAuditoria.create({
      operacion: 'DELETE',
      registroId: orden.id,
      usuarioId: options.userId || null
    }, { transaction });
  });


  Orden.afterRestore(async (orden, options) => {


    await sequelize.models.OrdenAuditoria.create({
      operacion: "RESTORE",
      registroId: orden.id,
      usuarioId: options.userId || null, // Quién hizo la restauración
      fecha: new Date()
    });


  });

  return Orden;
};