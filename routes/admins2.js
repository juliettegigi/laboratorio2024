var express = require('express');
const { check } = require('express-validator');


const { 
        postBioquimico, 
        postTecnico, 
        getBusqueda,
        getBioquimico,
        getForm,
        getTecnico,
        putBioquimico,
        putTecnico
        
} = require('../controllers/admin2');
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
router.get('/tecnico/:UsuarioId',[ 
        //tieneRole("recepcionista","administrativo")
                                   ], 
            getTecnico);




router.post('/tecnico',[ 
        //tieneRole("recepcionista","administrativo"),
        check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
       
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
                        telefono}=req.body
                 return res.render(`administrador2/form`,{oculto:false,editarBioquimico:false,errors,email,nombre,apellido,documento,telefono}) }
                next();
              },
              validarCampos
                        ],
            postTecnico);


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
                    postBioquimico);

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
router.put('/tecnico/:UsuarioId',[ 
                //tieneRole("recepcionista","administrativo")
                check('UsuarioId').custom(existeUsuario),
                check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
                check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
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
                               telefono}=req.body
                        return res.render(`administrador2/form`,{oculto:false,usuario:{id:req.params.UsuarioId},editarBioquimico:true,errors,email,nombre,apellido,documento,telefono}) }
                        next();
                        },
                validarCampos
                ],
                putTecnico);        

module.exports = router;