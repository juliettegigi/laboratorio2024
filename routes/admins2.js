var express = require('express');
const { check } = require('express-validator');

const {Usuario,Paciente} = require('../models');
const  errores= require('../check-errors/admins2');
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
       // putTecnico,
        putUsuario,
        putPaciente,
        postUsuario,
        postPaciente

        
} = require('../controllers/admin2');
const {tieneRole, isCampoUnicoUsuario, existeId} = require('../controllers/validaciones');
const { validarCampos } = require('../middlewares');
var router = express.Router();


router.get('/',[ 
        tieneRole("Recepcionista","Administrativo")
               ],
            getBusqueda);
router.get('/ordenes',[ 
        tieneRole("Recepcionista","Administrativo")
               ],
            getOrdenes);
router.get('/orden/:id',[ 
        tieneRole("Recepcionista","Administrativo")
               ],
            getOrden);

router.get('/form', [ 
    tieneRole("Recepcionista","Administrativo")
                ],
        getForm);


router.get(`/registrarUsuario`,[ 
        //tieneRole("Recepcionista","Administrativo")
                                   ], 
            getRegistrarUsuario);


router.get(`/:UsuarioId`,[ 
        //tieneRole("Recepcionista","Administrativo"),
        check('UsuarioId').custom(existeId(Usuario)),
        errores.getUsuario,
        validarCampos                           
        ], 
        getUsuario);








router.post(`/usuario`,
           [  // tieneRole("Recepcionista","Administrativo"),
                check('roles').notEmpty().withMessage('Debe seleccionar un rol.'),
                check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
                check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
                check('documento').notEmpty().withMessage('El documento es obligatorio')
                                  .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req)),
                check('email').notEmpty().withMessage('El email es obligatorio')
                              .isEmail().withMessage('El email no es válido')
                              .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req)),
                errores.postUsuario,
                validarCampos],
           postUsuario);

 router.post(`/paciente`,[ 
                            tieneRole("Recepcionista","Administrativo"),
                                            ],
                                postPaciente);

router.post(`/${encodeURIComponent('técnico')}/:UsuarioId`,
            [   tieneRole("Recepcionista","Administrativo"),
                errores.postTecnico,
                validarCampos],
            postTecnico);

                    
router.post(`/${encodeURIComponent('bioquímico')}`,
            [ tieneRole("Recepcionista","Administrativo"),],
            postBioquimico);
                    


router.put(`/${encodeURIComponent('bioquímico')}/:BioquimicoId`,
           [   tieneRole("Recepcionista","Administrativo"),
               check('titulo').notEmpty().withMessage('El título es obligatorio'),
               check('matricula').notEmpty().withMessage('La matrícula es obligatoria'),
               errores.putBioquimico,
               validarCampos],
           putBioquimico);


router.put(`/usuario/:UsuarioId`,
           [  //tieneRole("Recepcionista","Administrativo"),
               check('UsuarioId').custom(existeId(Usuario)),
               check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
               check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
               check('documento').notEmpty().withMessage('El documento es obligatorio')
                                 .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req,'true')).withMessage(`documento ya está registrado`),
               check('email').notEmpty().withMessage('El email es obligatorio')
                             .isEmail().withMessage('El email no es válido')
                             .custom((valor,{req,path})=>isCampoUnicoUsuario(path,valor,req,'true')).withMessage(`email ya está registrado`),
               errores.putUsuario,
               validarCampos],
           putUsuario);

        
/* router.put(`/${encodeURIComponent('técnico')}/:TecnicoId`,
           putTecnico);     */    


router.put(`/paciente/:PacienteId`,[ 
                tieneRole("Recepcionista","Administrativo"),
                check('PacienteId').custom(existeId(Paciente)),
                errores.putPaciente,
                validarCampos
                ],
                putPaciente);  

router.put(`/orden/:id`,[ 
                tieneRole("Recepcionista","Administrativo")
                ],
                putOrden);        
router.patch(`/:id/usuario`,[ 
                tieneRole("Recepcionista","Administrativo")
                ],
                patchUsuario);        
router.patch(`/:id/paciente`,[ 
                tieneRole("Recepcionista","Administrativo")
                ],
                patchPaciente);        
router.patch(`/:id/tecnico`,[ 
                tieneRole("Recepcionista","Administrativo")
                ],
                patchTecnico);        
router.patch(`/:id/bioquimico`,[ 
                tieneRole("Recepcionista","Administrativo")
                ],
                patchBioquimico);        

module.exports = router;