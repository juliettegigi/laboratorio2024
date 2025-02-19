
import InputDataList from "../input-datalist-class.js";













const LIMIT=5;
const OFFSET=0;

const eventoBuscarDeterminacion='buscarDeterminacion'
const liTextCbDeterminaciones=elem=>`${elem.codigo}-${elem.nombre}`
const listaDeterminaciones=formDet.querySelector(`#listaDeterminaciones`);
const listaDeterminacionesSeleccionadas=formDet.querySelector(`#listaDeterminacionesSeleccionadas`);
const input3=new InputDataList(formDet[`detInput`],listaDeterminaciones,eventoBuscarDeterminacion,liTextCbDeterminaciones,LIMIT,OFFSET,"",`det`,listaDeterminacionesSeleccionadas);
input3.inicializarInput()




const btnEditar=document.querySelectorAll('.btnEditar')

const divSubmit=document.querySelectorAll('.divSubmit')
let click=[false,false]

const forms=document.querySelectorAll('form')




const eventoBtnEditar1=(event)=>{
   const divsValorRef=document.querySelectorAll('.valorRef') 
   const btnsEditarVR=document.querySelectorAll('.btnsEditarVR') 

   divsValorRef.forEach((div,index)=>{
      const inputIsNew = div.querySelector('input[name="isNew"]');
      if (inputIsNew && inputIsNew.value != "3") {
            if(inputIsNew.value == "0" || inputIsNew.value == "1"){
              const inputs = div.querySelectorAll("input");
              const selects = div.querySelectorAll("select");
              inputs.forEach(i=>{
                 if(i.type!="hidden"){
                    i.removeAttribute("readonly")
                  }
              })
              selects.forEach(s=>{
               s.removeAttribute("readonly")
              })
            }
      }

   })
   
   btnsEditarVR.forEach(btn=>{
    btn.classList.remove('hidden')
   })
   event.target.removeEventListener('click',eventoBtnEditar1)
   event.target.addEventListener('click',eventoBtnEditar2)
}

const eventoBtnEditar2=function(event,index) {
  console.log("evento2")
  const btnsEditarVR=document.querySelectorAll('.btnsEditarVR') 
  const inputs = formValorRef.querySelectorAll("input");
  const selects = formValorRef.querySelectorAll("select");
  inputs.forEach(i=>{
   if(i.type!="hidden"){
     i.setAttribute("readonly",true)
   }
  })
  selects.forEach(s=>{
   s.setAttribute("readonly",true)
  })
  btnsEditarVR.forEach(btn=>{
   btn.classList.add('hidden')
  })
  event.target.removeEventListener('click',eventoBtnEditar2)
   event.target.addEventListener('click',eventoBtnEditar1)
}


const eventoBtnEditar01=(event)=>{

  const inputs= formDet.querySelectorAll("input,select");
  const crucesUnidad= formDet.querySelectorAll(".btnsEditarDet")
  inputs.forEach(i=>{
    i.removeAttribute("disabled")
  })
  crucesUnidad.forEach(i=>{
    i.classList.remove('hidden')
  })

  event.target.removeEventListener('click',eventoBtnEditar01)
  event.target.addEventListener('click',eventoBtnEditar02)
}

const eventoBtnEditar02=(event)=>{

  const inputs= formDet.querySelectorAll("input,select");
  const crucesUnidad= formDet.querySelectorAll(".btnsEditarDet")
  inputs.forEach(i=>{
    i.setAttribute("disabled","true")
  })
  crucesUnidad.forEach(i=>{
    i.classList.add('hidden')
  })
  event.target.removeEventListener('click',eventoBtnEditar02)
  event.target.addEventListener('click',eventoBtnEditar01)
}

btnEditar[1].addEventListener('click',eventoBtnEditar1);
btnEditar[0].addEventListener('click',eventoBtnEditar01);





const btnCruz=(div2)=>{
   const div=document.createElement('div')
    div.setAttribute('role','button')
    div.innerHTML=`
    <svg  tabindex="0" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#261290" class="bi bi-x-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>   

    `
   div.addEventListener('click',()=>{
   div2.remove()
   })

    return div
}
const selectElement = document.getElementById('unidad');
const divAddUnidad = document.getElementById('divAddUnidad');
const inputAddUnidad = divAddUnidad.querySelector('input');
const btnAddUnidad = document.getElementById('btnAddUnidad');
const formDiv = selectElement.closest('.d-flex');
const btnQuitarInput = document.getElementById('btnQuitarInput');


const eventoQuitarInput=()=>{
  divAddUnidad.classList.add('hidden')
}
btnQuitarInput.addEventListener('click',eventoQuitarInput)

const existeUnidad=(unidadSeleccionada)=>{
   const divs=document.querySelectorAll('.option-unidad')
  for(let div of divs){
     const span=div.querySelector('span').textContent
     if(span===unidadSeleccionada)
       return true   
  }  
  return false
}

const existeUnidadEnListaOption=(unidadSeleccionada)=>{
  const options=selectElement.querySelectorAll('option')
 for(let op of options){
    if(op.value===unidadSeleccionada)
      return true   
 }  
 return false
}
const cb=(unidad)=>{
  
     const option= document.createElement('option');
     option.value=unidad.unidad
     option.textContent=unidad.unidad
     selectElement.insertBefore(option, selectElement.firstChild);
     console.log("meeeee")
}


btnAddUnidad.addEventListener('click',(e)=>{
      console.log("pkk")
      eventoQuitarInput()
      
      if(!existeUnidadEnListaOption(inputAddUnidad.value))
        socket.emit('addUnidad',inputAddUnidad.value,cb)
      inputAddUnidad.value=""
})

selectElement.addEventListener('click', event => {
  if(event.target.value==="agregarUnidad"){
    // socket io
    divAddUnidad.classList.remove('hidden')
     event.target.value="no unidad"
    return
  }
  if(event.target.value=="no unidad"){
    console.log("eeentiroor")
    return
  }
  if(existeUnidad(event.target.value)){
     event.target.value="no unidad"
     return
  }
  const div=document.createElement('div')
  const span=document.createElement('span');
  
  const inputHidden=document.createElement('input');
  inputHidden.type='hidden';
  inputHidden.name="unidades"
  inputHidden.value=event.target.value

  span.textContent=event.target.value
  div.appendChild(span)
 div.classList.add('option-unidad')
  formDiv.appendChild(div)
  div.appendChild(inputHidden) 
  div.appendChild(btnCruz(div))
   event.target.value="no unidad"
});



const btnCruzEliminarUnidad = document.querySelectorAll('div[role="button"]');

btnCruzEliminarUnidad.forEach(button => {
  button.addEventListener('click', () => {
   const optionUnidad = button.closest('.option-unidad'); 
   if (optionUnidad) {
     optionUnidad.remove(); 
   }
  });
});


