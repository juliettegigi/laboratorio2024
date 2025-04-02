const btnsRegresar=document.querySelectorAll('.btnRegresar');
const divLista=document.getElementById('divLista');
let divCurrent=divLista;

for(let btn of btnsRegresar){
    btn.addEventListener('click',()=>{
        divCurrent.classList.add("oculto");
        divCurrent=divLista;
        divCurrent.classList.remove("oculto");
    });
      }




        const divForm1=document.getElementById('divForm1');
        const divForm2=document.getElementById('divForm2');
        const divForm3=document.getElementById('divForm3');
        const divForm4=document.getElementById('divForm4');

        const btnEditar=document.querySelectorAll('.btnEditar');
        for(let btn of btnEditar){
               btn.addEventListener('click',()=>{
                      divCurrent.classList.add("oculto");
               })
                      switch(btn.id){
                       case 'btnRegPaciente': 
                           btn.addEventListener('click',()=>{ 
                          divForm2.classList.remove('oculto');
                          divCurrent=divForm2;
                          })
                          break;
                       case 'btnRegBioquimico': 
                           btn.addEventListener('click',()=>{ 
                          divForm3.classList.remove('oculto');
                          divCurrent=divForm3;
                          })
                          break;
                       case 'btnRegTecnico': 
                           btn.addEventListener('click',()=>{ 
                          divForm4.classList.remove('oculto');
                          divCurrent=divForm4;
                          })
                          break;
                       case 'btnEditarUsuario': 
                           btn.addEventListener('click',()=>{ 
                          divForm1.classList.remove('oculto');
                          divCurrent=divForm1;
                          })
                          
                          break;
                       case 'btnEditarPaciente': 
                          btn.addEventListener('click',()=>{ 
                          divForm2.classList.remove('oculto');
                          divCurrent=divForm2;                           
                          })
                          break;
                       case 'btnEditarBioquimico':
                        btn.addEventListener('click',()=>{  
                          divForm3.classList.remove('oculto');
                          divCurrent=divForm3;
                          })
                          break;
                             
                      }

        }