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
        tieneRole("recepcionista","administrativo")
               ],
            getBusqueda);
router.get('/ordenes',[ 
        tieneRole("recepcionista","administrativo")
               ],
            getOrdenes);
router.get('/orden/:id',[ 
        tieneRole("recepcionista","administrativo")
               ],
            getOrden);

router.get('/form', [ 
    tieneRole("recepcionista","administrativo")
                ],
        getForm);


router.get(`/registrarUsuario`,[ 
        //tieneRole("recepcionista","administrativo")
                                   ], 
            getRegistrarUsuario);


router.get(`/:UsuarioId`,[ 
        //tieneRole("recepcionista","administrativo"),
        check('UsuarioId').custom(existeId(Usuario)),
        errores.getUsuario,
        validarCampos                           
        ], 
        getUsuario);








router.post(`/usuario`,
           [  // tieneRole("recepcionista","administrativo"),
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
                            tieneRole("recepcionista","administrativo"),
                                            ],
                                postPaciente);

router.post(`/${encodeURIComponent('técnico')}/:UsuarioId`,
            [   tieneRole("recepcionista","administrativo"),
                errores.postTecnico,
                validarCampos],
            postTecnico);

                    
router.post(`/${encodeURIComponent('bioquímico')}`,
            [ tieneRole("recepcionista","administrativo"),],
            postBioquimico);
                    


router.put(`/${encodeURIComponent('bioquímico')}/:BioquimicoId`,
           [   tieneRole("recepcionista","administrativo"),
               check('titulo').notEmpty().withMessage('El título es obligatorio'),
               check('matricula').notEmpty().withMessage('La matrícula es obligatoria'),
               errores.putBioquimico,
               validarCampos],
           putBioquimico);


router.put(`/usuario/:UsuarioId`,
           [  //tieneRole("recepcionista","administrativo"),
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
                tieneRole("recepcionista","administrativo"),
                check('PacienteId').custom(existeId(Paciente)),
                errores.putPaciente,
                validarCampos
                ],
                putPaciente);  

router.put(`/orden/:id`,[ 
                tieneRole("recepcionista","administrativo")
                ],
                putOrden);        
router.patch(`/:id/usuario`,[ 
                tieneRole("recepcionista","administrativo")
                ],
                patchUsuario);        
router.patch(`/:id/paciente`,[ 
                tieneRole("recepcionista","administrativo")
                ],
                patchPaciente);        
router.patch(`/:id/tecnico`,[ 
                tieneRole("recepcionista","administrativo")
                ],
                patchTecnico);        
router.patch(`/:id/bioquimico`,[ 
                tieneRole("recepcionista","administrativo")
                ],
                patchBioquimico);        

module.exports = router;