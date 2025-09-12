const { Op, Sequelize} = require('sequelize');

const{Usuario,Orden,Examen,Muestra,sequelize}=require('../models');
const ESTADO=require('../constantes/estados')

const getInicio=async(req,res)=>{  
       
  try{  
     let{page=1,inputSearch="",group=1}=req.query;
     const limit=5;
     page=parseInt(page)
     group=parseInt(group)
     let offset=page*limit-limit;
     
    // 🔹 condición base: todas las órdenes del paciente logueado
    let whereCondition = {pacienteId: req.session.pacienteId};

    if (inputSearch !== "") {
      const numericValue = Number(inputSearch);
      if (!isNaN(numericValue)) {
        // Buscar por id de orden
        whereCondition = {
          ...whereCondition,
          id: numericValue
        };
      } else {
        // Buscar por nombre de examen
        whereCondition = {
          ...whereCondition,
          [Op.or]: [
            { '$Examens.nombre$': {  [Op.like]: `%${inputSearch}%`} },
            Sequelize.where(
              Sequelize.fn('levenshtein', Sequelize.col('Examens.nombre'), inputSearch),
              { [Op.lte]: 6 }
            ),
          ]
        };
      }
    }
    /* else{
      whereCondition = {
        EstadoId:ESTADO.analitica.id}
    } */


       
        const exactMatchFirst = Sequelize.literal(`
          CASE
            WHEN LOWER(\`Examens\`.\`nombre\`) = LOWER('${inputSearch}') THEN 0
            ELSE 1
          END
        `);

        const orderByLikeMatch = Sequelize.literal(`
          CASE
            WHEN \`Examens\`.\`nombre\` LIKE '%${inputSearch}%' THEN 0
            ELSE 1
          END
        `);            
        const orderByDistance = Sequelize.literal(`
  levenshtein(LOWER(\`Examens\`.\`nombre\`), LOWER('${inputSearch}'))
`);


    const { count, rows } = await Orden.findAndCountAll({      
      where: {
        ...whereCondition,
        [Op.or]: [
          { EstadoId: ESTADO.informada.id },
        ]
      },
      include: [
        {
          model: Examen,
          as: 'Examens',
          required: true,
          include: [
            {
              model: Muestra,
              as: 'Muestra',
              required: true
            }
          ],
          where: sequelize.Sequelize.literal(`
            \`Examens\`.\`muestraId\` IN (
              SELECT mr.muestraId 
              FROM muestraRequeridas mr 
              WHERE mr.ordenId = \`Orden\`.id AND mr.isPresentada = 1
            )
          `),
          through: { attributes: ['UsuarioId'] } // <-- Trae el campo UsuarioId de la tabla intermedia
        }
      ],
      limit,
      offset,
      order: [
        [exactMatchFirst, 'ASC'],
        [orderByLikeMatch, 'ASC'],
        [orderByDistance, 'ASC'],
        ['id', 'ASC']
      ],
      subQuery: false // Evita que se generen subconsultas que rompan los alias
    });
    console.log("------------------------------------------------");
    console.log(rows)
     return res.render('portal/inicio' ,{inputSearch,
                                      ordenes:rows,
                                      limit,
                                      totalRegistros:count,
                                      page,
                                      PAGES_CANTIDADxGRUPO:3,
                                      group,
                                      isTecnico:req.session.isTecnico,
                                      isBioquimico:req.session.isBioquimico})
}catch(error){  console.log(error)
               return res.render('tecBioq/index')
 } 
  
      
    
}



module.exports={
    getInicio
}