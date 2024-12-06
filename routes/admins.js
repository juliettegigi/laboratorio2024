var express = require('express');
const {getInicio, getForm,crearPaciente, getBusqueda,getPaciente,editarPaciente} = require('../controllers/admin');
var router = express.Router();

/* GET home page. */
router.get('/', getInicio);
router.get('/busqueda', getBusqueda);
router.get('/form', getForm);
router.get('/paciente/:usuarioId', getPaciente);
router.post('/paciente',crearPaciente);
router.put('/paciente/:usuarioId',editarPaciente);

module.exports = router;