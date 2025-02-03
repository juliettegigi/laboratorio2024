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
    constructor(btn,forms,listaDeterminaciones,listaDeterminacionesSeleccionadas){
        const eventoBuscarDeterminacion='buscarDeterminacion'
        const liTextCbDeterminaciones=elem=>`${elem.codigo}-${elem.nombre}`
        this.input3=new InputDataList(forms[1][`determinaciones`],listaDeterminaciones,eventoBuscarDeterminacion,liTextCbDeterminaciones,LIMIT,OFFSET,"",`det`,listaDeterminacionesSeleccionadas);
        this.input3.inicializarInput()
        this.click1=true
        this.btn=btn;
        this.formDeterminaciones=forms[1]
        this.formCateg=forms[0]
        this.btn.addEventListener('click',(event)=>{
        this.editCategDet(event);
        })
    }

    editCategDet(event) {
        console.log('------------------------------------------------');
        if ( this.click1) {
          // Quita la clase "hidden"
          this.formDeterminaciones.classList.remove('hidden');
          this.formCateg.querySelector('button').classList.remove('hidden');
          this.formCateg.querySelector('input').disabled = false;
          this.click1=!this.click1
        } else {
            this.formDeterminaciones.classList.add('hidden')
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
    console.log('------------------------------------------------UUUUUUL'); 
    console.log(ul[0])
    new btnEditar(btn,forms,ul[1],ul[2])
})