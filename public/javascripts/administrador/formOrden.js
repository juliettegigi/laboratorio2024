import InputDataList from "../input-datalist-class.js";

const LIMIT=5;
const OFFSET=0;

const eventoBuscarMedico='buscarMedico'
const listaMedicos=document.getElementById('listaMedicos');
const liTextCbMedicos=elem=>`${elem.id}-${elem.nombre}`

const eventoBuscarDiagnostico='buscarDiagnostico'
const listaDiagnosticos=document.getElementById('listaDiagnosticos');
const liTextCbDiagnosticos=elem=>`${elem.codigo}-${elem.diagnostico}`




const addCruz=(li,funcionCruz)=>{
    const cruz = document.createElement('button');
    cruz.type="button"
    cruz.classList.add('btn', 'btn-close', 'danger', 'btn-sm');
    cruz.addEventListener('click',funcionCruz) 
    li.appendChild(cruz);
}

const crearInput=(value)=>{
  const input=document.createElement('input');
  input.type='hidden';
  input.name="examenes"
  input.value=value
  return input
}

const funcionEnter=(text)=>{// funcion para que se haga esto cuando se seleccione algo del dataList
    //antes de agregar a la lista tengo que ver q el text que se quiera agregar no exista en la lista
    const lisListaExamenesSeleccionados=[...listaExamenesSeleccionados.querySelectorAll('li')];
    if(lisListaExamenesSeleccionados.find(li=>li.textContent===text))
        return
    const li=document.createElement('li')
    li.innerHTML=text;
    addCruz(li,(evento)=>{li.remove()})
    listaExamenesSeleccionados.appendChild(li)
    listaExamenesSeleccionados.appendChild(crearInput(text))
}
const eventoBuscarExamen='buscarExamen'
const liTextCbExamenes=elem=>`${elem.codigo}-${elem.nombre}`
const listaExamenes=document.getElementById('listaExamenes');
const listaExamenesSeleccionados=document.getElementById('listaExamenesSeleccionados');


const input1=new InputDataList(formOrden['medico'],listaMedicos,eventoBuscarMedico,liTextCbMedicos,LIMIT,OFFSET,'MedicoId');
const input2=new InputDataList(formOrden['diagnostico'],listaDiagnosticos,eventoBuscarDiagnostico,liTextCbDiagnosticos,LIMIT,OFFSET,"DiagnosticoId");
const input3=new InputDataList(formOrden['examen'],listaExamenes,eventoBuscarExamen,liTextCbExamenes,LIMIT,OFFSET,"examenesId",funcionEnter);




input1.inicializarInput()
input2.inicializarInput()
input3.inicializarInput()





