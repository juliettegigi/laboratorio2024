var express = require('express');
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
    getFormExamen,
    getAddDeterminacion,  
    postCategDet, 
    postDet,
    postDetCateg,
    postParamCateg,
    postExamen,
    putDet,
    putvr,
    putExamen,
    putCateg,
    } = require('../controllers/tecbioq');
var router = express.Router();

/* GET home page. */
router.get('/', getInicio);
router.get('/det', getInicioDeterminaciones);
router.get('/categ/:examenId/:id',deleteCategoria)
router.get('/categDetDelete/:DeterminacionId/:ExamenCategoriaId/:examenId/',deleteCategDet)
router.get('/categParamDelete/:ParametroId/:ExamenCategoriaId/:examenId/',deleteCategParam)
router.get('/determinaciones/',getInicioDeterminaciones)
router.get('/determinacion/:id', getDeterminacion);
router.get('/detDelete/:id', deleteDeterminacion);
router.get('/examen/:id', getExamen);
router.get('/examen/:id/addCategDet', getAddCategDet);
router.get('/getFormExamen', getFormExamen);
router.get('/addDet', getAddDeterminacion);
router.put('/', putExamen);
router.put('/categ/:id/:examenId', putCateg);
router.put('/det', putDet)
router.put('/vr', putvr)
router.post('', postExamen)
router.post('/addDet', postDet);
router.post('/examen/:id/addCategDet', postCategDet)
router.post('/examen/:ExamenCategoriaId/:ExamenId/addDetCateg', postDetCateg)
router.post('/examen/:ExamenCategoriaId/:ExamenId/addParamCateg', postParamCateg)

module.exports = router;