var express = require('express');
const {deleteOrden,getInicio, getForm,crearPaciente, getBusqueda,getPaciente,putPaciente,getFormOrden,crearOrden,putOrden} = require('../controllers/admin');
var router = express.Router();

/* GET home page. */
router.get('/', getInicio);
router.get('/busqueda', getBusqueda);
router.get('/form', getForm);
router.get('/formOrden', getFormOrden);
router.post('/orden', crearOrden);
router.put('/orden', putOrden);
router.delete('/orden', deleteOrden);
router.get('/paciente/:usuarioId', getPaciente);
router.post('/paciente',crearPaciente);
router.put('/paciente/:UsuarioId',putPaciente);
// form(action=editarOrden?`/admins/orden?_method=put`:`/admins/orden/` method="post" class="formOrden")
module.exports = router;