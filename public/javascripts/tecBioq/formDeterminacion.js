
import InputDataList from "../input-datalist-class.js";
import BtnAddVR from "./btnAddVR.js";












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




const eventoBtnEditar=function(event,index) {
   click[index]=!click[index]
   const elements = forms[index].querySelectorAll("input,.form-select");

    if(click[index]){
      console.log(index)
       divSubmit[index].classList.remove('hidden')
       elements.forEach(element => {
        element.disabled = false; // Habilita los elementos
      });
     if(forms[index].name=="formDet") input3.agregarCruzLiListaSeleccionados()
   } 
   else{
    divSubmit[index].classList.add('hidden')
    elements.forEach(element => {
        element.disabled = true; 
      });
      if(forms[index].name=="formDet") input3. removerCruzLiListaSeleccionados()
   }
}





btnEditar.forEach((btn,index)=>btn.addEventListener("click",event=> {
   
   eventoBtnEditar(event,index)

}));



document.querySelectorAll('.btnAddVR').forEach(
   (btn,index)=>{ 
      console.log("see")
      btn.addEventListener("click",event=> {
      const ref=new BtnAddVR(btn,document.querySelectorAll('.vrXsexo')[index])
      ref.addDivVR()
   })
}
)

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


const btnCruzVR = document.querySelectorAll('.btnCruzVR');

btnCruzVR.forEach(button => {
  button.addEventListener('click', () => {
   const vrrt
    = button.closest('.valorRef'); 
   if (vrrt
   ) {
     vrrt
     .remove(); 
   }
  });
});