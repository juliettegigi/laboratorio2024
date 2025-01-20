var express = require('express');
const {
    getExamen,
    getInicio,
    getFormExamen, 
    postExamen
    } = require('../controllers/tecbioq');
var router = express.Router();

/* GET home page. */
router.get('/', getInicio);
router.get('/examen/:id', getExamen);
router.get('/getFormExamen', getFormExamen);
router.post('', postExamen)

module.exports = router;