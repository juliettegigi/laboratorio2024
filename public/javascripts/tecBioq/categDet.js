import InputDataList from "../input-datalist-class.js";
let i=0
let i2=0
const cruz=document.querySelector('.tablaCategorias-cruz');
const tabla2=document.querySelector(".tablaCategDet2");
const tabla2cabeceras = tabla2.querySelectorAll('.row.cabecera');
const btnAddRow=document.querySelectorAll('.btnAddRow');
const tBody=document.querySelectorAll('tbody')
const btnEditCategDet=document.querySelectorAll('.formCategDet-btn-editarCategoria');

const LIMIT=5;
const OFFSET=0;


//const divMostrarTabla=document.querySelectorAll(".divMostrarTabla");
const formdiv1=document.querySelector(".form-div");
const divAddDeterminacion=document.querySelector(".addDeterminacion");




 const crearDiv=(clase,...params)=>{
    const div= document.createElement('div');
    div.classList.add(clase);
    params.forEach(elem=>div.appendChild(elem))
}
       

const crearInput=(name,placeholder,isHidden)=>{
    const categoriaInput=document.createElement('input');
    categoriaInput.name=name;
    if(isHidden){
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












const eventoAddRow=(event)=>{
  
 console.log("wwwwwwwwwww")
  const row=document.createElement('div');
  row.classList.add('row');
  const rowPadre = event.target.closest('.row');
  rowPadre.parentNode.insertBefore(row, rowPadre);
  agregarColums(row);
  i++;
}



const agregarColums=(row)=>{
 
const col1=document.createElement('div');  
col1.classList.add('col','col-3');
const col2=document.createElement('div');  
col2.classList.add('col','col-4');
col2.innerHTML=`<div class="row">
                     <div class="col-xxl-12">
                      <input type="text" name="parametros" placeholder="Agregar parámetro" autocomplete="off">
                    </div>    
                                           
                                           <div class="col-xxl-12 divInputLista">
                                               <ul class="listaParametros"></ul>
                                           </div>
                                
                                           <div class="col-xxl-12 divListaSeleccionados">
                                               <ul class="listaParametrosSeleccionados"></ul>
                                           </div>
                </div>`
const col3=document.createElement('div'); 
col3.classList.add('col','col-4'); 
col3.innerHTML=`<div class="row">
                                             <div class="col-xxl-12">
                                                   <input type="text" name="determinaciones" placeholder="agregar determinación" autocomplete="off">
                                                   <div class="divInputLista">
                                                      <ul class="listaDeterminaciones "></ul>
                                                    </div>
                                             </div>
                                             <div class="col-xxl-12">
                                                   <ul class="listaDeterminacionesSeleccionadas divListaSeleccionados"></ul>
                                             </div> 
                                         </div>`
const col4=document.createElement('div');  
col4.classList.add('col','col-1');
col1.appendChild(crearInput("categorias","nombre de la categoría"));

const input1=col2.querySelector('input');
const listaParametros=col2.querySelector(`.listaParametros`);
const listaParametrosSeleccionados=col2.querySelector(`.listaParametrosSeleccionados`);
const liTextCbParametros=elem=>`${elem.nombre}`
const eventoBuscarParametro='buscarParametro'

const input2=col3.querySelector('input');
const listaDeterminaciones=col3.querySelector(`.listaDeterminaciones`);
const listaDeterminacionesSeleccionadas=col3.querySelector(`.listaDeterminacionesSeleccionadas`);
const liTextCbDeterminaciones=elem=>`${elem.nombre}`
const eventoBuscarDeterminacion='buscarDeterminacion'


row.appendChild(col1);
row.appendChild(col2);
row.appendChild(col3);
row.appendChild(col4);

const  input11=new InputDataList(input1,listaParametros,eventoBuscarParametro,liTextCbParametros,LIMIT,OFFSET,"",`param-${i}`,listaParametrosSeleccionados);      
const  input22=new InputDataList(input2,listaDeterminaciones,eventoBuscarDeterminacion,liTextCbDeterminaciones,LIMIT,OFFSET,"",`det-${i}`,listaDeterminacionesSeleccionadas);      

input11.inicializarInput()
input22.inicializarInput()
}




btnAddRow[0].addEventListener('click',eventoAddRow)


  const focusPrimerInput=()=>{
    let lastRow=null;
    if(tBody[1])
     lastRow = tBody[1].querySelector(" tr:last-child");
    else
      lastRow = tBody[0].querySelector(" tr:last-child");
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


 

  btnEditCategDet.forEach((btn,index)=>{
    btn.addEventListener('click',function(){
                               const rowDelBtn=btn.closest(".row")
                               const input= rowDelBtn.querySelector('.formCategDet-input-1ro');
                               if(input.disabled)
                                 agregarRows(rowDelBtn);
                               else{
                                 rowDelBtn.nextElementSibling?.remove();
                                 rowDelBtn.nextElementSibling?.remove();
                               } 
                               input.disabled=!input.disabled;
                               if(!input.disabled){
                                input.focus();
                                 input.select();
                               }
                          }
                        )

  })



  

  const agregarRows=(rowDelBtn)=>{
    const div1=document.createElement('div');
                                div1.classList.add('row');
                                div1.innerHTML=`
                                  <div class="col">  
                                        <div class="row">
                                           
                                           <div class="col p-0">
                                               <input type="text" class="inputParametro" name="parametros" placeholder="Agregar parámetro" autocomplete="off">
                                           </div>    
                                        </div>
                                        <div class="row">   
                                           <div class="col divInputLista">
                                               <ul class="listaParametros"></ul>
                                           </div>
                                        </div>
                                        <div class="row">
                                           <div class="col divListaSeleccionados">
                                               <ul class="listaParametrosSeleccionados"></ul>
                                           </div>
                                        </div>
                                   </div>   
                                `
                               
                                const div2=document.createElement('div');
                                div2.classList.add('row','justify-content-center');
                                div2.innerHTML=`
                                      <div class="col-auto">
                                          <button class="btnGuardarCambios">
                                              Guardar cambios
                                           </button> 
                                      </div>
                                `
const inputs=div1.getElementsByTagName('input');
const columnaParametro=rowDelBtn.querySelector('.columnaParametros')
columnaParametro.appendChild(div1)
const listaParametros=div1.querySelector(`.listaParametros`);
const listaParametrosSeleccionados=div1.querySelector(`.listaParametrosSeleccionados`);
const liTextCbParametros=elem=>`${elem.nombre}`
        const eventoBuscarParametro='buscarParametro'
rowDelBtn.parentNode.insertBefore(div2, rowDelBtn.nextElementSibling);
const  input2=new InputDataList(inputs[0],listaParametros,eventoBuscarParametro,liTextCbParametros,LIMIT,OFFSET,"",`param`,listaParametrosSeleccionados);      

input2.inicializarInput()
                              

  }