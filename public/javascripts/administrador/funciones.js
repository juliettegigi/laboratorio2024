import InputDataList from "../input-datalist-class.js";
import {initialContent}from './formOrden.js';
const LIMIT=5;
const OFFSET=0;

const inputsFormOrden=(form)=>{
     const eventoBuscarMedico='buscarMedico'
    const listaMedicos=form.querySelector('#listaMedicos');
    console.log("LISTA MEDICOS: ",listaMedicos)
    const liTextCbMedicos=elem=>`${elem.id}-${elem.nombre}`
    
    const eventoBuscarDiagnostico='buscarDiagnostico'
    const listaDiagnosticos=form.querySelector('#listaDiagnosticos');
    const liTextCbDiagnosticos=elem=>`${elem.codigo}-${elem.diagnostico}`



const eventoBuscarExamen='buscarExamen'
const liTextCbExamenes=elem=>`${elem.codigo}-${elem.nombre}`
const listaExamenes=form.querySelector('#listaExamenes');
const listaExamenesSeleccionados=form.querySelector('#listaExamenesSeleccionados');



const input1=new InputDataList(form['medico'],listaMedicos,eventoBuscarMedico,liTextCbMedicos,LIMIT,OFFSET,'MedicoId');
    const input2=new InputDataList(form['diagnostico'],listaDiagnosticos,eventoBuscarDiagnostico,liTextCbDiagnosticos,LIMIT,OFFSET,"DiagnosticoId");
    const input3=new InputDataList(form['examen'],listaExamenes,eventoBuscarExamen,liTextCbExamenes,LIMIT,OFFSET,"","examenes",listaExamenesSeleccionados);
    input1.inicializarInput()
    input2.inicializarInput()
    input3.inicializarInput()
}


function ajustarAltura(card) {
  const front = card.querySelector('.front');
  const back = card.querySelector('.back');
  
  if (card.classList.contains('flipped')) {
    card.style.height = back.scrollHeight + "px";
  } else {
    card.style.height = front.scrollHeight + "px";
  }
}


function flipCard(button) {
                  const currentCard = button.closest('.card-flip');
                  console.log("CURRENT CARD: ",currentCard)
                  
                   currentCard.classList.toggle('flipped');
                        ajustarAltura(currentCard);      
                        const backDiv = currentCard.querySelector('.back');
                        const card = document.getElementById(backDiv.id);
                      card.scrollIntoView({ behavior: "smooth", block: "start" });
   
                 }

function showModal(ordenId) {
   const modal = document.getElementById("divEliminarOrden");
   modal.style.display = "block";
   formEliminarOrden['OrdenId'].value=ordenId
 }
 
 // Cerrar el modal
 function closeModal() {
   const modal = document.getElementById("divEliminarOrden");
   modal.style.display = "none";
 }
 
 // Manejar la confirmación
 function submitReason() {
   const reason = document.getElementById("reason").value;
   if (reason.trim() === "") {
     alert("Por favor, ingresa un motivo.");
     return;
   }
 
   alert("El motivo de eliminación ha sido enviado: " + reason);
   closeModal(); // Cierra el modal después de enviar el formulario
 }



const formOrden=(fromRegresar=false)=>{
    const forms=document.querySelectorAll('.formOrden');
    for(let form of forms){
        inputsFormOrden(form)
   }
    const lis=Array.from(document.querySelectorAll('.liExamenes'))
    if(!fromRegresar){
    const addCruz=(li,funcionCruz)=>{
              const cruz = document.createElement('button');
              cruz.type="button"
              cruz.classList.add('btn', 'btn-close', 'danger', 'btn-sm');
              cruz.addEventListener('click',funcionCruz) 
              li.appendChild(cruz);
    }
    for(let li of lis)
        addCruz(li,(evento)=>{li.remove()})
    }
}



                  
function resetToInitialState() {
    console.log("CONTENIDO INICIAL")
    console.log(initialContent)
                    document.querySelector('#divOrdenesNoInformadas').innerHTML = initialContent;/* 
                    const lis=Array.from(document.querySelectorAll('.liExamenes'))
                    for(let li of lis)addCruz(li,(evento)=>{li.remove()})*/
                    formOrden(true); 
                          }

export { inputsFormOrden,flipCard,showModal,closeModal,submitReason,resetToInitialState ,formOrden};