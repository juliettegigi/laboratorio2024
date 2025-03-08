var express = require('express');
const { check } = require('express-validator');


const {getInicio, getForm,crearBioquimico, 
        getBusqueda,getBioquimico,putBioquimico,getRegistrarTecnico} = require('../controllers/admin2');
const {tieneRole, isCampoUnicoUsuario, existeUsuario} = require('../controllers/validaciones');
const { validarCampos } = require('../middlewares');
var router = express.Router();


router.get('/',[ 
        //tieneRole("recepcionista","administrativo")
               ],
            getBusqueda);
router.get('/busqueda',[ 
        //tieneRole("recepcionista","administrativo")
                       ], 
            getBusqueda);

router.get('/form', [ 
    //tieneRole("recepcionista","administrativo")
                ],
        getForm);
router.get('/bioquimico/:UsuarioId',[ 
        //tieneRole("recepcionista","administrativo")
                                   ], 
            getBioquimico);
router.get('http://localhost:3000/tecBioq/addDet',[ 
        //tieneRole("recepcionista","administrativo")
                                   ], 
            getRegistrarTecnico);



router.post('/bioquimico',[ 
        //tieneRole("recepcionista","administrativo"),
        check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
        check('titulo').notEmpty().withMessage('El título es obligatorio'),
        check('matricula').notEmpty().withMessage('La matrícula es obligatoria'),
        check('documento').notEmpty().withMessage('El documento es obligatorio')
                          .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req)),
        check('email').notEmpty().withMessage('El email es obligatorio')
                      .isEmail().withMessage('El email no es válido')
                      .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req)),

        (req, res, next) => {
                req.renderizar = async (errors) => {
                 console.log(" ERRORES------------------------------------------------------------------------")
                 console.log(errors)
                 const {email,nombre,apellido,documento,
                        matricula,titulo,
                        telefono}=req.body
                 return res.render(`administrador2/form`,{oculto:false,editarBioquimico:false,errors,email,nombre,apellido,documento,matricula,titulo,telefono}) }
                next();
              },
              validarCampos
                        ],
            crearBioquimico);


router.put('/bioquimico/:UsuarioId',[ 
        //tieneRole("recepcionista","administrativo")
        check('UsuarioId').custom(existeUsuario),
        check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
        check('titulo').notEmpty().withMessage('El título es obligatorio'),
        check('matricula').notEmpty().withMessage('La matrícula es obligatoria'),
        check('documento').notEmpty().withMessage('El documento es obligatorio')
                          .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req,'true')).withMessage(`documento ya está registrado`),
        check('email').notEmpty().withMessage('El email es obligatorio')
                      .isEmail().withMessage('El email no es válido')
                      .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req,'true')).withMessage(`email ya está registrado`),
        (req, res, next) => {
                req.renderizar = async (errors) => {
                console.log(" ERRORES------------------------------------------------------------------------")
                console.log(errors)
                const {email,nombre,apellido,documento,
                       matricula,titulo,
                       telefono}=req.body
                return res.render(`administrador2/form`,{oculto:false,usuario:{id:req.params.UsuarioId},editarBioquimico:true,errors,email,nombre,apellido,documento,matricula,titulo,telefono}) }
                next();
                },
        validarCampos
        ],
        putBioquimico);

module.exports = router;