import {flipCard,closeModal,resetToInitialState,formOrden, showModal }from './funciones.js';



formOrden();

const addCruz=(li,funcionCruz)=>{
                    const cruz = document.createElement('button');
                    cruz.type="button"
                    cruz.classList.add('btn', 'btn-close', 'danger', 'btn-sm');
                    cruz.addEventListener('click',funcionCruz) 
                    li.appendChild(cruz);
                }
                document.addEventListener('click', function () {
                        const alerta = document.getElementById('alert');
                        if (alerta) {
                          alerta.style.display = 'none';
                        }
                      });
                const rtaCargarOrden=document.getElementById('rtaCargarOrden')
                const btnEditar=document.getElementById('btnEditar');
                const btnInicio=document.getElementById('btnInicio');
                const btnCargarOrden=document.getElementById('btnCargarOrden');
                const btnOrdenesNoInformadas=document.getElementById('btnOrdenesNoInformadas');
                const divLista=document.getElementById('divLista');
                const divFormOrden=document.getElementById('divFormOrden1');
                const divFormOrden2=document.getElementById('divFormOrden2');
                const divOrdenesNoInformadas=document.getElementById('divOrdenesNoInformadas');
                const divEliminarOrden=document.getElementById('divEliminarOrden');
                
                let active=divLista;
                const activar=(div)=>{
                    if(rtaCargarOrden)
                      rtaCargarOrden.remove();
                    active.classList.add("oculto")
                    if(active.id==='divOrdenesNoInformadas'){                      
                        active.style.display='none';
                    }
                    active=div
                    active.classList.remove('oculto');
                    if(active.id==='divOrdenesNoInformadas'){                      
                        active.style.display='flex';
                    }
                }
                const rta = window.rta || {};
                console.log("RESPUESTA ORIGEN")
                console.log(rta.origen)
                if(rta){  
                     switch(rta.origen){
                         case'postOrden':
                             activar(divOrdenesNoInformadas)
                             break;
                         case'putOrden':
                            activar(divOrdenesNoInformadas)
                              break;
                         case'deleteOrden':
                           activar(divOrdenesNoInformadas)
                           break;
                         case'putPaciente':
                           activar(divForm)
                           break;
                         default: 
                             active=divLista 
                     }
                    }
                
                
                        //const form=document.getElementById('form')
                if(btnEditar)
                btnEditar.addEventListener('click',(event)=>{
                   const divForm=document.getElementById('divForm');
                    activar(divForm)
                })
                if(btnInicio)
                btnInicio.addEventListener('click',(event)=>{
                    const divForm=document.getElementById('divForm');
                    activar(divLista)
                })
                if(btnCargarOrden)
                 btnCargarOrden.addEventListener('click',(event)=>{
                    
                    activar(divFormOrden)
                }) 
                if(btnOrdenesNoInformadas)   
                 btnOrdenesNoInformadas.addEventListener('click',(event)=>{
                    
                    activar(divOrdenesNoInformadas)
                })
                let currentCard;    
                
                  // Cerrar el modal si se hace clic fuera de él
                  window.onclick = function (event) {
                    const modal = document.getElementById("divEliminarOrden");
                    if (event.target === modal) {
                      closeModal();
                    }
                  };
const initialContent = document.querySelector('#divOrdenesNoInformadas').innerHTML;
                 

window.flipCard = flipCard;                          
window. resetToInitialState =  resetToInitialState;                          

export{initialContent}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.close-button').forEach(btn => {
            btn.addEventListener('click', closeModal);
  })
  document.getElementById('divOrdenesNoInformadas').addEventListener('click', function(e) {
    if (e.target.closest('#btnEliminar')) {
      const btn = e.target.closest('#btnEliminar');
      const ordenId = btn.getAttribute('data-orden-id');
      formEliminarOrden['OrdenId'].value=ordenId
    }
  });
});