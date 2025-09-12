var express = require('express');
const { check } = require('express-validator');

const {
    deleteCategoria,
    deleteCategDet,
    deleteCategParam,
    deleteDeterminacion,
    getAddCategDet,
    getDeterminacion,
    getExamen,
    getInicio,
    getInicioDeterminaciones,
    getInicioMuestras,
    getInicioOrdenes,
    getInicioValidar,
    getFormExamen,
    getAddDeterminacion,  
    getAddMuestra,
    getMuestra,
    getOrdenExamen,
    getOrdenExamenes,
    postCategDet, 
    postDet,
    postVr,
    postDetCateg,
    postParamCateg,
    postExamen,
    postMuestra,
    postResultados,
    putDet,
    putvr,
    putEstadoOrden,
    putOrdenExamenIsValidado,
    putExamen,
    putCateg,
    putResultados
    } = require('../controllers/tecbioq');
    const{bodyPostVr, seSolapaPostVr,validarCampos, valoresMayorMenor}=require('../middlewares')
const {
    Determinacion,Muestra,Unidad
     } = require('../models');
const { isAuth,tieneRole, isCampoUnicoExamen } = require('../controllers/validaciones');
  
var router = express.Router();

/* GET home page. */
router.get('/',[
    isAuth,
    tieneRole("Bioquímico","Técnico")
], getInicio);
router.get('/muestras', getInicioMuestras);
router.get('/categ/:examenId/:id',deleteCategoria)
router.get('/categDetDelete/:DeterminacionId/:ExamenCategoriaId/:examenId/',deleteCategDet)
router.get('/categParamDelete/:ParametroId/:ExamenCategoriaId/:examenId/',deleteCategParam)
router.get('/determinaciones/',getInicioDeterminaciones)
router.get('/determinacion/:id', getDeterminacion);
router.get('/detDelete/:id', deleteDeterminacion);
router.get('/examen/:id', getExamen);
router.get('/examen/:id/addCategDet', getAddCategDet);
router.get('/addExamen', getFormExamen);
router.get('/addDet', getAddDeterminacion);
router.get('/addMuestra', getAddMuestra);
router.get('/muestra/:id', getMuestra);
router.get('/ordenes/',[
    //isAuth,
    //tieneRole("Técnico")
] ,getInicioOrdenes);
router.get('/ordenesV/',[
    isAuth,
    tieneRole("Bioquímico")
], getInicioValidar);

router.get('/ordenExamen/:OrdenId/:ExamenId', getOrdenExamen);
router.get('/ordenExamenes/:OrdenId', getOrdenExamenes);
//router.get('/orden/:id', getMuestra);
router.put('/', putExamen);
router.put('/categ/:ExamenCategoriaId/:ExamenId', putCateg);//id de examenCategoría
router.put('/det', putDet)
router.put('/estadoOrden/:OrdenId', putEstadoOrden)
router.put('/ordenExamenIsValidado/:OrdenExamenId', putOrdenExamenIsValidado)
router.put('/vr',[    
    bodyPostVr,
    check('edadMinAmbos').optional().custom((valor, { req }) => seSolapaPostVr(valor,req,'Ambos')),
    check('edadMinFemenino').optional().custom((valor, { req }) => seSolapaPostVr(valor,req,'Femenino')),
    check('edadMinMasculino').optional().custom((valor, { req }) => seSolapaPostVr(valor,req,'Masculino')),
    check('valorMinMasculino').optional().custom((valor, { req }) => valoresMayorMenor(valor,req,'Masculino')),
    check('valorMinFemenino').optional().custom((valor, { req }) => valoresMayorMenor(valor,req,'Femenino')),
    check('valorMinAmbos').optional().custom((valor, { req }) => valoresMayorMenor(valor,req,'Ambos')),
    (req, res, next) => {
        req.renderizar = async (errors) => {
         console.log("HAY ERRORES----------------$$---------------------------------------------------------")
         
         const{sex,id}=req.body;
         console.log('------------------------------------------------ BODYDYDYYDY');
         console.log(req.body)
         console.log('------------------------------------------------ SEXXXXXX');
         console.log(sex)
         const valoresRef={  Femenino:[],
                             Masculino:[],
                             Ambos:[],
                             desactivar:req.body[`desactivar`]
                            };

         sex.forEach((sexo,index)=>{
                          const vr={  id:req.body[`idsVrForm`][index],
                                      nota:req.body[`nota`][index],
                                      edadMin:req.body[`edadMin`][index],
                                      valorMin:req.body[`valorMin`][index],
                                      edadMax:req.body[`edadMax`][index],
                                      valorMax:req.body[`valorMax`][index],
                                      unidadMin:req.body[`unidadMin`][index],
                                      unidadMax:req.body[`unidadMax`][index],
                                    }
                          valoresRef[`${sexo}`].push(vr)
         })

         console.log(valoresRef)
         const determinacion = await Determinacion.findByPk(id, { paranoid: false });
         const determinacionPadre= await determinacion.getParents();  
         const vrUnidades= await determinacion.getUnidads();   
         const unidades= await Unidad.findAll({ order: [['unidad', 'ASC']]});   
         return res.render(`tecBioq/clickDeterminacion`,{determinacion:await Determinacion.findByPk(req.body.id) ,
                                                         valoresRef,
                                                         errors,
                                                        unidades,
                                                        determinacionPadre,
                                                    vrUnidades})
        }
        next();
      },
    validarCampos
],putvr);
router.put('/results/:OrdenExamenId', putResultados)
router.post('/results/:OrdenExamenId', postResultados)
router.post('',[
    check('tiempoProcesamiento').optional()
                                .isInt()
                                .withMessage('El tiempo de procesamiento debe ser un número entero'),
    check('nombre').optional()
                   .custom((valor,{req,path})=>isCampoUnicoExamen(path,valor,req))
                   .withMessage(`Este nombre ya está registrado`),
                                          
    (req, res, next) => {
        req.renderizar = async (errors) => {
         console.log("HAY ERRORES---------------------$$----------------------------------------------------")
         console.log(errors)
         const{nombre,codigo,id,tags,MuestraId,tiempoProcesamiento,laboratorioQueLoRealiza}=req.body
         const muestras= await Muestra.findAll();
         return res.render('tecBioq/addExamen',{muestras,
                                           isTecnico:req.session.isTecnico,
                                           isBioquimico:req.session.isBioquimico,
                                           nombre,codigo,id,tags,MuestraId,tiempoProcesamiento,laboratorioQueLoRealiza,
                                           errors}) 
        }
        next();
      },
    validarCampos
    ],
    postExamen)
router.post('/addDet',           
    postDet);
router.post('/addVr', [
    bodyPostVr,
    check('edadMinAmbos').optional().custom((valor, { req }) => seSolapaPostVr(valor,req,'Ambos')),
    check('edadMinFemenino').optional().custom((valor, { req }) => seSolapaPostVr(valor,req,'Femenino')),
    check('edadMinMasculino').optional().custom((valor, { req }) => seSolapaPostVr(valor,req,'Masculino')),
    check('valorMinMasculino').optional().custom((valor, { req }) => valoresMayorMenor(valor,req,'Masculino')),
    check('valorMinFemenino').optional().custom((valor, { req }) => valoresMayorMenor(valor,req,'Femenino')),
    check('valorMinAmbos').optional().custom((valor, { req }) => valoresMayorMenor(valor,req,'Ambos')),
    (req, res, next) => {
        req.renderizar = async (errors) => {
         console.log("HAY ERRORES---------------------$$----------------------------------------------------")
         console.log(errors)
         const{valoresRef}=req.body
         return res.render(`tecBioq/addVr`,{determinacion:await Determinacion.findByPk(req.body.id) ,valoresRef,errors})
        }
        next();
      },
    validarCampos
], postVr);
router.post('/examen/:ExamenId/addCategDet', postCategDet)
router.post('/examen/:ExamenCategoriaId/:ExamenId/addDetCateg', postDetCateg)
router.post('/examen/:ExamenCategoriaId/:ExamenId/addParamCateg', postParamCateg)
router.post('/addMuestra', postMuestra)
router.post('/results/:OrdenExamenId', postResultados)

module.exports = router;