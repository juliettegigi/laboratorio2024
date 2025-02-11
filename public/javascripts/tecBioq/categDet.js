import InputDataList from "../input-datalist-class.js";
let i=0
let i2=0
const cruz=document.querySelector('.tablaCategorias-cruz');
const tablaDiv=document.querySelector('#divTabla');
const btnAddRow=document.querySelectorAll('.btnAddRow');
const tBody=document.querySelectorAll('tbody')

const LIMIT=5;
const OFFSET=0;


//const divMostrarTabla=document.querySelectorAll(".divMostrarTabla");
const formdiv1=document.querySelector(".form-div");
const divAddDeterminacion=document.querySelector(".addDeterminacion");



/*  no va estooo, esto es un comentario
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
/* const mostrarTabla=(evento,i)=>{
     cruz.classList.remove('hidden');
     tablaDiv.classList.remove('hidden');
     divMostrarTabla[0].style="visibility: hidden;";

}  */           

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
    div.setAttribute('role','button')
    div.innerHTML=`
    <svg  tabindex="0" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#261290" class="bi bi-x-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>   

    `
    div.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          eventoCruzRow.call(div)
        }
      });

    return div;

}


const eventoCruzRow=function(){
    const tr = this.closest('tr'); 
    tr.remove()
    focusPrimerInput()
}
const crearRow=()=>{
  
  
  
  
  
  const row=document.createElement('tr');
      const td1=document.createElement('td');
            const categoriaInput=crearInput(`categorias`,"nombre de la categoría")
      const td2=document.createElement('td');
           const div0td2=document.createElement('div');
                     const parametroInput=crearInput("","nombre del parámetro")
                     const divTd2=document.createElement('div');
                         const ulTd2=document.createElement('ul')
                  const divSeleccionadosTd2=document.createElement('div');
      const td3=document.createElement('td');
             const div0=document.createElement('div');
                const determinacionInput=crearInput("","nombre de la determinación")
                const div=document.createElement('div');
                    const ul=document.createElement('ul')
             const divSeleccionados=document.createElement('div');
      const td4=document.createElement('td');
            const cruz=crearCruzRow();

  row.appendChild(td1);
  row.appendChild(td2)
  row.appendChild(td3)
  row.appendChild(td4)

  td1.appendChild(categoriaInput);

  td2.appendChild(div0td2)
  td2.appendChild(divSeleccionadosTd2)
  div0td2.appendChild(parametroInput);
  div0td2.appendChild(divTd2)
  divTd2.appendChild(ulTd2);
  parametroInput.id=`parametro-${i2}`;
  div0td2.classList.add('position-relative','col-md-auto');
  divTd2.classList.add('position-absolute','z-3','contenedorLista');
  divTd2.style="top:2rem;";
  ulTd2.id=`listaParametros-${i2}`
  const ulSeleccionadosTd2=document.createElement('ul')
  ulSeleccionadosTd2.id=`listaParametrosSeleccionados-${i2}`;
  ulSeleccionadosTd2.classList.add('listaParametrosSeleccionados');
  divSeleccionadosTd2.appendChild(ulSeleccionadosTd2)

  td3.appendChild(div0)
  td3.appendChild(divSeleccionados)
  div0.appendChild(determinacionInput);
  div0.appendChild(div)
  div.appendChild(ul);
  determinacionInput.id=`determinacion-${i2}`;
  div0.classList.add('position-relative','col-md-auto');
  div.classList.add('position-absolute','z-3','contenedorLista');
  div.style="top:2rem;";
  ul.id=`listaDeterminaciones-${i2}`
  const ulSeleccionados=document.createElement('ul')
  ulSeleccionados.id=`listaDeterminacionesSeleccionadas-${i2}`;
  ulSeleccionados.classList.add('listaDeterminacionesSeleccionadas');
  divSeleccionados.appendChild(ulSeleccionados)

  
  td4.appendChild(cruz)
  cruz.addEventListener('click',eventoCruzRow) 
    
        
        
        


    

    return row

}









//divMostrarTabla[0].addEventListener('click',e=>mostrarTabla(e,0))

/* cruz.addEventListener('click',(evento)=>{
    tablaDiv.classList.add('hidden')
    divMostrarTabla[0].style="visibility: visible;";
    const trs=tBody[0].querySelectorAll('tr');

    trs.forEach((tr,index)=>{
           if(index!=0)
            tr.remove()
    })
}
) */

const eventoAddRow=()=>{
    tBody[1].appendChild(crearRow(1));

    const eventoBuscarDeterminacion='buscarDeterminacion'
    const liTextCbDeterminaciones=elem=>`${elem.codigo}-${elem.nombre}`
    const listaDeterminaciones=formExamen.querySelector(`#listaDeterminaciones-${i2}`);
    const listaDeterminacionesSeleccionadas=formExamen.querySelector(`#listaDeterminacionesSeleccionadas-${i2}`);
    const input3=new InputDataList(formExamen[`determinacion-${i2}`],listaDeterminaciones,eventoBuscarDeterminacion,liTextCbDeterminaciones,LIMIT,OFFSET,"",`det`,listaDeterminacionesSeleccionadas);
    input3.inicializarInput()

    const eventoBuscarParametro='buscarParametro'
    const liTextCbParametros=elem=>`${elem.nombre}`
    const listaParametros=formExamen.querySelector(`#listaParametros-${i2}`);
    const listaParametrosSeleccionados=formExamen.querySelector(`#listaParametrosSeleccionados-${i2}`);
    const input=new InputDataList(formExamen[`parametro-${i2}`],listaParametros,eventoBuscarParametro,liTextCbParametros,LIMIT,OFFSET,"",`param`,listaParametrosSeleccionados);
    input.inicializarInput()

    i2++;
    focusPrimerInput()

}

btnAddRow[0].addEventListener('click',eventoAddRow)


btnAddRow[0].addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      eventoAddRow.call(btnAddRow[0])
    }
  });


  const focusPrimerInput=()=>{
    const lastRow = tBody[1].querySelector(" tr:last-child");
    if(lastRow){
        const input = lastRow.querySelector("input");
        input.focus();
    }
  }


  const btnEnviar=document.querySelector('#btnEnviar')
  if(btnEnviar)
    btnEnviar.addEventListener('click',function(){
          this.type='submit'
          const tabla=document.getElementById("tabla2")
          tabla.querySelectorAll("tr").forEach((tr, index) => {
            const secondTd = tr.querySelectorAll("td")[1]; // Obtiene el segundo <td>
            const tercerTd = tr.querySelectorAll("td")[2]; // Obtiene el segundo <td>
            if (secondTd) {
              const lis = secondTd.querySelectorAll("ul.listaParametrosSeleccionados li"); // Obtiene los <li> dentro del <ul> correspondiente
              
              
              
              lis.forEach((li, liIndex) => {
                const inputs = li.querySelectorAll("input"); // Obtiene los <input> dentro de cada <li>
                inputs[1].name=`param-${(index)}`
              });
            }

            if (tercerTd) {
              const lis = tercerTd.querySelectorAll("ul.listaDeterminacionesSeleccionadas li"); // Obtiene los <li> dentro del <ul> correspondiente
              
              
              
              lis.forEach((li, liIndex) => {
                const inputs = li.querySelectorAll("input"); // Obtiene los <input> dentro de cada <li>
                inputs[1].name=`${(index)}`
              });
            }
          });

  })


 