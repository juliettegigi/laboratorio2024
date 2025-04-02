var express = require('express');
const { check } = require('express-validator');
const {deleteOrden,getInicio, getForm,crearPaciente, getBusqueda,getPaciente,putPaciente,putMuestrasRequeridas,getFormOrden,postOrden,putOrden, getPDF} = require('../controllers/admin');
const {tieneRole, isCampoUnicoUsuario, existeUsuario} = require('../controllers/validaciones');
const { validarCampos } = require('../middlewares');

var router = express.Router();


router.get('/',[ 
        //tieneRole("recepcionista","administrativo")
               ],
            getInicio);
router.get('/busqueda',[ 
        //tieneRole("recepcionista","administrativo")
                       ], 
            getBusqueda);
router.get('/form', [ 
        //tieneRole("recepcionista","administrativo")
                    ],
            getForm);
router.get('/formOrden',[ 
        //tieneRole("recepcionista","administrativo")
                        ], 
            getFormOrden);
router.get('/paciente/:UsuarioId',[ 
        //tieneRole("recepcionista","administrativo")
                                   ], 
            getPaciente);
router.get('/pdf/',[ 
        //tieneRole("recepcionista","administrativo")
                  ],
            getPDF)
router.delete('/orden',[ 
        //tieneRole("recepcionista","administrativo")
                       ],
             deleteOrden);
router.post('/orden', [ 
        //tieneRole("recepcionista","administrativo")
                      ],
            postOrden);
router.post('/paciente',[ 
        tieneRole("recepcionista","administrativo"),
        check('edad').isNumeric().withMessage('La edad debe ser un número'),
        check('documento').notEmpty().withMessage('El documento es obligatorio')
                                  .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req)),
         check('email').notEmpty().withMessage('El email es obligatorio')
                              .isEmail().withMessage('El email no es válido')
                              .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req,false,"http://localhost:3000/admins/paciente/")),
        check('nacimiento').isDate().withMessage('La fecha de nacimiento no es válida'),
        (req, res, next) => {
          req.renderizar = async (errors) => {
           console.log(" ERRORES------------------------------------------------------------------------")
           console.log(errors)
           const {email,nombre,apellido,documento,
                  telefono}=req.body
          // const roles=await Rol.findAll();     
           const obj={errors,email,nombre,apellido,documento,telefono};
           if(req.href){obj.href=req.href}
           return res.render(`administrador/form`,obj) }
          next();
        },
        validarCampos                      
                        ],
            crearPaciente);
router.put('/muestra',[ 
        //tieneRole("recepcionista","administrativo")
                      ],
            putMuestrasRequeridas)
router.put('/orden',[ 
        //tieneRole("recepcionista","administrativo")
                    ], 
            putOrden);
router.put('/paciente/:UsuarioId',[ 
        tieneRole("recepcionista","administrativo"),
        check('email').notEmpty().withMessage('El email es obligatorio')
                      .isEmail().withMessage('El email no es válido')
                      .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req,'true')).withMessage(`email ya está registrado`),
                      ],
            putPaciente);

module.exports = router;