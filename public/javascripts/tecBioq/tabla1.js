import InputDataList from "../input-datalist-class.js";
const LIMIT=5;
const OFFSET=0;

export default class btnEditar{
    //recibo el input, 
    //la lista, el data list, 
    //el evento del socket q hace una búsqueda paginada y  retorna un arreglo y el total de registros
    // el texto del li, un cb q retorna el texto del li, el cb recibe el objeto del arreglo q retornó la búsqueda
    // el inputHiddenNAme el nombre del input q va a llevar el id de lo q se seleccione
    // funcionEnter es una funcion q se va a ejecutar cuando se seleccione un elemento de la datalist
    constructor(btn,forms,listas){
        this.formDeterminaciones=forms[2]
        this.formCateg=forms[0]
        this.formParams=forms[1]

        this.listaDeterminaciones=listas[4]
        this.listaDeterminacionesSeleccionadas=listas[5]
        this.listaParametros=listas[1]
        this.listaParametrosSeleccionados=listas[2]

        const eventoBuscarDeterminacion='buscarDeterminacion'
        const eventoBuscarParametro='buscarParametro'

        const liTextCbDeterminaciones=elem=>`${elem.codigo}-${elem.nombre}`
        this.input3=new InputDataList(forms[2][`determinaciones`],this.listaDeterminaciones,eventoBuscarDeterminacion,liTextCbDeterminaciones,LIMIT,OFFSET,"",`det`,this.listaDeterminacionesSeleccionadas);
        this.input3.inicializarInput()

        const liTextCbParametros=elem=>`${elem.nombre}`
        const eventoNoRegistrado=(e,funcion)=>{
           funcion(forms[1][`parametros`].value)
        }
        this.input=new InputDataList(forms[1][`parametros`],this.listaParametros,eventoBuscarParametro,liTextCbParametros,LIMIT,OFFSET,"",`det`,this.listaParametrosSeleccionados,eventoNoRegistrado,"Click para agregar");
        this.input.inicializarInput()

        this.click1=true
        this.btn=btn;
        this.btn.addEventListener('click',(event)=>{
        this.editCategDet(event);

        })
    }

    editCategDet(event) {
        if ( this.click1) {
          // Quita la clase "hidden"
          this.formDeterminaciones.classList.remove('hidden');
          this.formParams.classList.remove('hidden');

          this.formCateg.querySelector('button').classList.remove('hidden');
          this.formCateg.querySelector('input').disabled = false;
          this.click1=!this.click1
        } else {
            this.formDeterminaciones.classList.add('hidden')
            this.formParams.classList.add('hidden')

            this.formCateg.querySelector('button').classList.add('hidden')
            this.formCateg.querySelector('input').disabled = true;
            this.click1=!this.click1
        }
    
    
        
    
      }
}




  



const btnsEdit=document.querySelectorAll('.editCategDet')

btnsEdit.forEach(btn=>{
    const tr = btn.closest('tr');
   //  quiero seleccionar el ul que está dentro del form ""
    const forms = tr.querySelectorAll('form');
    const ul = tr.querySelectorAll('ul');
    new btnEditar(btn,forms,ul)
})