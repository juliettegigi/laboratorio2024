var express = require('express');
const {
    deleteCategoria,
    deleteCategDet,
    deleteCategParam,
    getAddCategDet,
    getAddCategParam,
    getExamen,
    getInicio,
    getFormExamen,
    postCategDet, 
    postDetCateg,
    postExamen,
    putExamen,
    putCateg,
    } = require('../controllers/tecbioq');
var router = express.Router();

/* GET home page. */
router.get('/', getInicio);
router.get('/categ/:examenId/:id',deleteCategoria)
router.get('/categDetDelete/:DeterminacionId/:ExamenCategoriaId/:examenId/',deleteCategDet)
router.get('/categParamDelete/:ParametroId/:ExamenCategoriaId/:examenId/',deleteCategParam)
router.get('/examen/:id', getExamen);
router.get('/examen/:id/addCategDet', getAddCategDet);
router.get('/examen/:id/addCategParam', getAddCategParam);
router.get('/getFormExamen', getFormExamen);
router.put('/', putExamen);
router.put('/categ/:id/:examenId', putCateg);
router.post('', postExamen)
router.post('/examen/:id/addCategDet', postCategDet)
router.post('/examen/:ExamenCategoriaId/:ExamenId/addDetCateg', postDetCateg)

module.exports = router;