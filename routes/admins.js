var express = require('express');
const {deleteOrden,getInicio, getForm,crearPaciente, getBusqueda,getPaciente,putPaciente,putMuestrasRequeridas,getFormOrden,postOrden,putOrden, getPDF} = require('../controllers/admin');
const {tieneRole} = require('../controllers/validaciones');
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
router.get('/paciente/:pacienteId',[ 
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
        //tieneRole("recepcionista","administrativo")
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
router.put('/paciente/:PacienteId',[ 
        //tieneRole("recepcionista","administrativo")
                                    ],
            putPaciente);

module.exports = router;