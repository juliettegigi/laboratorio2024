var express = require('express');
const { login, registro, salir } = require('../controllers/login');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res)=> {
  let{registro}=req.query;
  if(registro)
     res.render('login/index',{registro,ruta:'/?_method=put',title:"Registro"});
  else  
  res.render('login/index',{title:"Iniciar sesión"});
});

router.post('/', login);
router.put('/', registro);
router.get('/salir',salir)





module.exports = router;
