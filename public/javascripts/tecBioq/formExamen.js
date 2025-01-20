import InputDataList from "../input-datalist-class.js";
let i=0
let i2=0
const cruz=document.querySelectorAll('.tablaCategorias-cruz');
const tablaDiv=document.querySelectorAll('.divTabla');
const btnAddRow=document.querySelectorAll('.btnAddRow');
const tBody=document.querySelectorAll('tbody')

const LIMIT=5;
const OFFSET=0;




const divMostrarTabla=document.querySelectorAll(".divMostrarTabla");
const divAddDeterminacion=document.querySelector(".addDeterminacion");



/*
div.form-div 
     div
      label(for="laboratorioQueLoRealiza") Laboratorio que lo realiza 
     div 
      input(type="text" 
            id="laboratorioQueLoRealiza" 
            name="laboratorioQueLoRealiza"
            autocomplete="off") */
const crearDiv=(clase,...params)=>{
    const div= document.createElement('div');
    div.classList.add(clase);
    params.forEach(elem=>div.appendChild(elem))
}
const mostrarTabla=(evento,i)=>{
     cruz[i].classList.remove('hidden');
     tablaDiv[i].classList.remove('hidden');

}            

const crearInput=(name,placeholder,type)=>{
    const categoriaInput=document.createElement('input');
    categoriaInput.name=name;
    if(type){
        categoriaInput.type="hidden";
        return  categoriaInput
    }
        categoriaInput.type="text";
   
    categoriaInput.autocomplete="off";
    categoriaInput.placeholder=placeholder;
    return categoriaInput
}


const crearCruzRow=()=>{
    const div=document.createElement('div')
    div.innerHTML=`
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#261290" class="bi bi-x-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>   

    `
    return div;

}

const crearRow=()=>{
    const row=document.createElement('tr');
    const td1=document.createElement('td');
    const td2=document.createElement('td');
    const categoriaInput=crearInput(`categorias`,"nombre de la categoría")
    td1.appendChild(categoriaInput);
    row.appendChild(td1);

   
       const determinacionInput=crearInput("","nombre de la determinación")
        determinacionInput.id=`determinacion-${i2}`;
        const div0=document.createElement('div');
        div0.classList.add('position-relative','col-md-auto');
        const div=document.createElement('div');
        div.classList.add('position-absolute','z-3','contenedorLista');
        div.style="top:2rem;";
        const ul=document.createElement('ul')
        ul.id=`listaDeterminaciones-${i2}`
        div.appendChild(ul);
        div0.appendChild(determinacionInput);
        div0.appendChild(div)
        const divSeleccionados=document.createElement('div');
        const ulSeleccionados=document.createElement('ul')
        ulSeleccionados.id=`listaDeterminacionesSeleccionadas-${i2}`
        divSeleccionados.appendChild(ulSeleccionados)
        td2.appendChild(div0)
        td2.appendChild(divSeleccionados)
        
        row.appendChild(td2)
        const cruz=crearCruzRow();
        row.appendChild(cruz)
        cruz.addEventListener('click',function(){
            const tr = this.closest('tr'); 
            tr.remove()
        }) 


    

    return row

}






const crearRow2=()=>{

   
       const determinacionInput=crearInput("","nombre de la determinación")
        determinacionInput.id=`determinacioness`;
        const div0=document.createElement('div');
        div0.classList.add('position-relative','col-md-auto');
        const div=document.createElement('div');
        div.classList.add('position-absolute','z-3','contenedorLista');
        div.style="top:2rem;";
        const ul=document.createElement('ul')
        ul.id=`listaDeterminaciones2`
        div.appendChild(ul);
        div0.appendChild(determinacionInput);
        div0.appendChild(div)
        const divSeleccionados=document.createElement('div');
        const ulSeleccionados=document.createElement('ul')
        ulSeleccionados.id=`listaDeterminacionesSeleccionadas2`
        divSeleccionados.appendChild(ulSeleccionados)

  


    

    return determinacionInput

}



divMostrarTabla[0].addEventListener('click',e=>mostrarTabla(e,0))
cruz[0].addEventListener('click',(evento)=>{
    tablaDiv[0].classList.add('hidden')
    const trs=tBody[0].querySelectorAll('tr');

    trs.forEach((tr,index)=>{
           if(index!=0)
            tr.remove()
    })
}
)

btnAddRow[0].addEventListener('click',()=>{
    tBody[0].appendChild(crearRow(1));
    const eventoBuscarDeterminacion='buscarDeterminacion'
    const liTextCbDeterminaciones=elem=>`${elem.codigo}-${elem.nombre}`
    const listaDeterminaciones=formExamen.querySelector(`#listaDeterminaciones-${i2}`);
const listaDeterminacionesSeleccionadas=formExamen.querySelector(`#listaDeterminacionesSeleccionadas-${i2}`);
const input3=new InputDataList(formExamen[`determinacion-${i2}`],listaDeterminaciones,eventoBuscarDeterminacion,liTextCbDeterminaciones,LIMIT,OFFSET,"",`determinaciones-${i2}`,listaDeterminacionesSeleccionadas);
    input3.inicializarInput()

    i2++
})

// *********************************************************************
divMostrarTabla[1].addEventListener('click',e=>mostrarTabla(e,1))
cruz[1].addEventListener('click',(evento)=>{
    tablaDiv[1].classList.add('hidden')
   
}
)

const eventoBuscarDeterminacion='buscarDeterminacion'
const liTextCbDeterminaciones=elem=>`${elem.codigo}-${elem.nombre}`
const listaDeterminaciones=formExamen.querySelector(`#listaDeterminaciones2`);
const listaDeterminacionesSeleccionadas=formExamen.querySelector(`#listaDeterminacionesSeleccionadas2`);
const input3=new InputDataList(formExamen[`determinacion2`],listaDeterminaciones,eventoBuscarDeterminacion,liTextCbDeterminaciones,LIMIT,OFFSET,"",`determinaciones2`,listaDeterminacionesSeleccionadas);
    input3.inicializarInput()



