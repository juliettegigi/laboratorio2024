




        //formularios
        const id3=document.getElementById('id3');
        const id1=document.getElementById('id1');
        const id2=document.getElementById('id2');
        const id4=document.getElementById('id4');
        const rowListas=document.getElementById('rowListas');
        const rowFormularios=document.getElementById('rowFormularios');
        const rowAuditoria=document.getElementById('rowAuditoria');
       const btnId={'btnRegPaciente':id3,
         'btnRegBioquimico':id1,
         'btnRegTecnico':id2,
         'btnEditarUsuario':id4,
         'btnEditarPaciente':id3,
         'btnEditarBioquimico':id1,
       }

 const btnsRegresar=document.querySelectorAll('.btnRegresar');

 let currentForm=null
 const rows = [rowListas, rowFormularios, rowAuditoria];
 let currentRow = rows.find(row => !row.classList.contains('oculto'));
 console.log("CURRENT ROW", currentRow);
 
 const btnEditar=document.querySelectorAll('.btnEditar');
        for(let btn of btnEditar){
               btn.addEventListener('click',()=>{
                  switch(btn.id){

                   case 'btnRegPaciente': 
                   case 'btnRegBioquimico': 
                   case 'btnRegTecnico':
                             currentRow.classList.add("oculto")
                             currentRow=rowFormularios;
                             currentRow.classList.remove("oculto")
                             btnId[btn.id].classList.remove('oculto');
                              if(!currentForm) currentForm=btnId[btn.id]
                              else if(currentForm!=btnId[btn.id]){
                                 currentForm.classList.add('oculto');
                                 currentForm=btnId[btn.id];
                              }
                               rowListas.classList.add('oculto');
                            break;
                   
                   case 'btnMovimientos':  
                        currentRow.classList.add("oculto")
                        currentRow=rowAuditoria;
                        currentRow.classList.remove("oculto")
                      break;
                   case 'btnEditarUsuario':
                   case 'btnEditarPaciente': 
                   case 'btnEditarBioquimico':   
                             currentRow.classList.add("oculto")
                             currentRow=rowFormularios;
                             currentRow.classList.remove("oculto")
                             btnId[btn.id].classList.remove('oculto');  
                         
                  }
               })

        }