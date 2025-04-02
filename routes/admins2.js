var express = require('express');
const { check } = require('express-validator');

const {Rol} = require('../models');
const { 
        patchBioquimico,
        patchPaciente,
        patchTecnico,
        patchUsuario,
        getBusqueda,
        getForm,
        getOrdenes,
        getOrden,
        getRegistrarUsuario,
        getUsuario,
        postBioquimico, 
        postTecnico, 
        putBioquimico,
        putOrden,
        putTecnico,
        putUsuario,
        putPaciente,
        postUsuario,
        postPaciente

        
} = require('../controllers/admin2');
const {tieneRole, isCampoUnicoUsuario, existeUsuario} = require('../controllers/validaciones');
const { validarCampos } = require('../middlewares');
var router = express.Router();


router.get('/',[ 
        //tieneRole("recepcionista","administrativo")
               ],
            getBusqueda);
router.get('/ordenes',[ 
        //tieneRole("recepcionista","administrativo")
               ],
            getOrdenes);
router.get('/orden/:id',[ 
        //tieneRole("recepcionista","administrativo")
               ],
            getOrden);

router.get('/form', [ 
    //tieneRole("recepcionista","administrativo")
                ],
        getForm);


router.get(`/registrarUsuario`,[ 
        //tieneRole("recepcionista","administrativo")
                                   ], 
            getRegistrarUsuario);


router.get(`/:UsuarioId`,[ 
        //tieneRole("recepcionista","administrativo")
                                   ], 
            getUsuario);






router.post(`/usuario`,[ 
        //tieneRole("recepcionista","administrativo"),
        check('roles').notEmpty().withMessage('Debe seleccionar un rol.'),
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
                 const roles=await Rol.findAll();     
                 const obj={errors,email,nombre,apellido,documento,telefono,
                        rolesArray:[],roles};
                if(req.href){obj.href=req.href}
                 return res.render(`administrador2/clickRegistrarUsuario`,obj) }
                next();
              },
              validarCampos
                        ],
            postUsuario);

 router.post(`/paciente`,[ 
                            //tieneRole("recepcionista","administrativo"),
                                            ],
                                postPaciente);
router.post(`/${encodeURIComponent('técnico')}/:UsuarioId`,[ 
                //tieneRole("recepcionista","administrativo"),
               
        
                (req, res, next) => {
                        req.renderizar = async (errors) => {
                         console.log(" ERRORES------------------------------------------------------------------------")
                         console.log(errors)
                         const {UsuarioId}=req.params
                         return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)}
                         next();
                      },
                      validarCampos
                                ],
                    postTecnico);

                    
router.post(`/${encodeURIComponent('bioquímico')}`,[ 
                //tieneRole("recepcionista","administrativo"),
               
                                ],
                    postBioquimico);
                    


router.put(`/${encodeURIComponent('bioquímico')}/:UsuarioId`,[ 
        //tieneRole("recepcionista","administrativo")
        check('titulo').notEmpty().withMessage('El título es obligatorio'),
        check('matricula').notEmpty().withMessage('La matrícula es obligatoria'),
       (req, res, next) => {
                req.renderizar = async (errors) => {
                const {UsuarioId}=req.params;        
                console.log(" ERRORES------------------------------------------------------------------------")
                console.log(errors)
                const { matricula,titulo}=req.body
                return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
        }
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
router.put(`/orden/:id`,[ 
                //tieneRole("recepcionista","administrativo")
                ],
                putOrden);        
router.patch(`/:id/usuario`,[ 
                //tieneRole("recepcionista","administrativo")
                ],
                patchUsuario);        
router.patch(`/:id/paciente`,[ 
                //tieneRole("recepcionista","administrativo")
                ],
                patchPaciente);        
router.patch(`/:id/tecnico`,[ 
                //tieneRole("recepcionista","administrativo")
                ],
                patchTecnico);        
router.patch(`/:id/bioquimico`,[ 
                //tieneRole("recepcionista","administrativo")
                ],
                patchBioquimico);        

module.exports = router;