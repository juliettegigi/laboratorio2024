var express = require('express');
const { check } = require('express-validator');

const {Rol} = require('../models');
const { 
        postBioquimico, 
        postTecnico, 
        getBusqueda,
        getForm,
        getUsuario,
        putBioquimico,
        putTecnico,
        putUsuario,
        putPaciente,
        postUsuario
        
} = require('../controllers/admin2');
const {tieneRole, isCampoUnicoUsuario, existeUsuario} = require('../controllers/validaciones');
const { validarCampos } = require('../middlewares');
var router = express.Router();


router.get('/',[ 
        //tieneRole("recepcionista","administrativo")
               ],
            getBusqueda);

router.get('/form', [ 
    //tieneRole("recepcionista","administrativo")
                ],
        getForm);
router.get(`/:UsuarioId`,[ 
        //tieneRole("recepcionista","administrativo")
                                   ], 
            getUsuario);






router.post(`/${encodeURIComponent('técnico')}`,[ 
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
            postUsuario);

            router.post(`/${encodeURIComponent('técnico')}`,[ 
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
                    postUsuario);

                    
router.post(`/${encodeURIComponent('bioquímico')}`,[ 
                //tieneRole("recepcionista","administrativo"),
               
                                ],
                    postBioquimico);

router.put(`/${encodeURIComponent('bioquímico')}/:UsuarioId`,[ 
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
router.put(`/usuario/:UsuarioId`,[ 
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
                       matricula,titulo,
                       telefono}=req.body
                return res.render(`administrador2/form`,{oculto:false,usuario:{id:req.params.UsuarioId},editarBioquimico:true,errors,email,nombre,apellido,documento,matricula,titulo,telefono}) }
                next();
                },
        validarCampos
        ],
        putUsuario);
router.put(`/${encodeURIComponent('técnico')}/:UsuarioId`,[ 
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
router.put(`/paciente/:id`,[ 
                //tieneRole("recepcionista","administrativo")
                ],
                putPaciente);        

module.exports = router;