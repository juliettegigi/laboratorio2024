var express = require('express');
const { check,param } = require('express-validator');
const {getInicio} = require('../controllers/paciente');
const {tieneRole, isCampoUnicoUsuario, existeId} = require('../controllers/validaciones');
const { validarCampos, userExisteCheckTablasHijas } = require('../middlewares');
const {Usuario} = require('../models');

var router = express.Router();

router.get('/',[ 
        //tieneRole("recepcionista","administrativo")
               ],
            getInicio);


module.exports = router;            