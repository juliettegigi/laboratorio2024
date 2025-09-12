var express = require('express');
const { check,param } = require('express-validator');
const {deleteOrden,getInicio, getForm,crearPaciente, getBusqueda,getPaciente,putPaciente,putMuestrasRequeridas,getFormOrden,postOrden,putOrden, getPDF} = require('../controllers/admin');
const {tieneRole, isCampoUnicoUsuario, existeId} = require('../controllers/validaciones');
const { validarCampos, userExisteCheckTablasHijas } = require('../middlewares');
const {Usuario} = require('../models');

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
        param('UsuarioId').custom(existeId(Usuario)),
        (req, res, next) => {
                req.renderizar = async (errors) => {
                console.log(" ERRORES------------------------------------------------------------------------")
                console.log(errors)    
                req.flash('rta', {
                        origen: 'getPaciente',
                        alertType: 'error',
                        alertMessage: `El usuario con ID ${req.params.UsuarioId} no existe.`
                      });    
                return res.redirect('http://localhost:3000/admins') }
                next();
              },
        validarCampos                           
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
        check('edad').optional({ checkFalsy: true })
                     .isNumeric().withMessage('La edad debe ser un número'),
        check('documento').notEmpty().withMessage('El documento es obligatorio')
                                  .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req)),
         check('email').optional({ checkFalsy: true })
                       .isEmail().withMessage('El email no es válido')
                       .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req,false,"http://localhost:3000/admins/paciente/")),
        check('nacimiento').optional({ checkFalsy: true })
                           .isDate().withMessage('La fecha de nacimiento no es válida'),
        (req, res, next) => {
          req.renderizar = async (errors) => {
           console.log(" ERRORES------------------------------------------------------------------------")
           console.log(req.body)
           console.log(errors)
           const {email,nombre,apellido,documento,edad,nacimiento,
                  telefono,sexo,
                localidad,direccion,provincia,}=req.body   
           const obj={editarPaciente:false,UsuarioId:req.UsuarioId,errors,email,nombre,apellido,documento,telefono,edad,nacimiento,localidad,direccion,provincia,sexo};
           if(req.href){obj.href=req.href}
           return res.render(`administrador/form`,obj) }
          next();
        },
        userExisteCheckTablasHijas,
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
        param('UsuarioId').custom(existeId(Usuario)),
        check('email').notEmpty().withMessage('El email es obligatorio')
                      .isEmail().withMessage('El email no es válido')
                      .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req,'true')).withMessage(`email ya está registrado`),
        (req, res, next) => {
          req.renderizar = async (errors) => {
           console.log(" ERRORES------------------------------------------------------------------------")
           console.log(req.body)
           console.log(errors)
           const {email,nombre,apellido,documento,edad,nacimiento,
                  telefono,sexo,UsuarioId,
                localidad,direccion,provincia,}=req.body   
           const obj={usuario:{id:UsuarioId},editarPaciente:true,errors,email,nombre,apellido,documento,telefono,edad,nacimiento,localidad,direccion,provincia,sexo};
           if(req.href){obj.href=req.href}
           return res.render(`administrador/form`,obj) }
          next();
        },              
        validarCampos              
                      ],
            putPaciente);

module.exports = router;