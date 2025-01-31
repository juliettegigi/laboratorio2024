var express = require('express');
const {
    deleteCategoria,
    getExamen,
    getInicio,
    getFormExamen,
    postCategDet, 
    postExamen,
    putExamen,
    getAddCategDet
    } = require('../controllers/tecbioq');
var router = express.Router();

/* GET home page. */
router.get('/', getInicio);
router.get('/categ/:examenId/:id',deleteCategoria)
router.get('/examen/:id', getExamen);
router.get('/examen/:id/addCategDet', getAddCategDet);
router.get('/getFormExamen', getFormExamen);
router.put('/', putExamen);
router.post('', postExamen)
router.post('/examen/:id/addCategDet', postCategDet)

module.exports = router;