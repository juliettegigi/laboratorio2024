var express = require('express');
const {deleteOrden,getInicio, getForm,crearPaciente, getBusqueda,getPaciente,putPaciente,putMuestrasRequeridas,getFormOrden,postOrden,putOrden, getPDF} = require('../controllers/admin');
var router = express.Router();

/* GET home page. */
router.get('/', getInicio);
router.get('/busqueda', getBusqueda);
router.get('/form', getForm);
router.get('/formOrden', getFormOrden);
router.post('/orden', postOrden);
router.put('/orden', putOrden);
router.delete('/orden', deleteOrden);
router.get('/paciente/:usuarioId', getPaciente);
router.post('/paciente',crearPaciente);
router.put('/paciente/:UsuarioId',putPaciente);
router.put('/muestra',putMuestrasRequeridas)
router.get('/pdf/',getPDF)
// form(action=editarOrden?`/admins/orden?_method=put`:`/admins/orden/` method="post" class="formOrden")
module.exports = router;