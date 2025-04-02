import InputDataList from "../input-datalist-class.js";

const LIMIT=5;
const OFFSET=0;





const forms=document.querySelectorAll('.formOrden');



for(let form of forms){
    const eventoBuscarMedico='buscarMedico'
    const listaMedicos=form.querySelector('#listaMedicos');
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






const lis=Array.from(document.querySelectorAll('.liExamenes'))

const addCruz=(li,funcionCruz)=>{
    const cruz = document.createElement('button');
    cruz.type="button"
    cruz.classList.add('btn', 'btn-close', 'danger', 'btn-sm');
    cruz.addEventListener('click',funcionCruz) 
    li.appendChild(cruz);
}

for(let li of lis)
    addCruz(li,(evento)=>{li.remove()})
    

 
