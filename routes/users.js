var express = require('express');
const {getUsuarios}=require('../controllers/user')

var router = express.Router();

/* GET users listing. */
router.get('/', getUsuarios);

module.exports = router;
