export default class SelectUnidad{
    constructor(selectElement, divContainer){
        this.divContainer=divContainer
        this.select=selectElement
        this.options = Array.from(this.select.options);
        this.options.slice(3) //quito las 3 1ras options q son "no unidad" , "Agregar una unidad" y ""
    
        this.select.addEventListener('change', () => {
            const selectedOption = this.options[this.select.selectedIndex];
            console.log("see", selectedOption.value, selectedOption.textContent);
            this.AgregarUnidadSeleccionada(selectedOption)
            
        });
    }




    AgregarUnidadSeleccionada(selectedOption){
       const div= document.createElement('div')
       div.classList.add('divUnidadesSeleccionadas')
       const p=document.createElement('p')  
       p.textContent=selectedOption.textContent
       div.appendChild(p)
       this.agregarInputHidden(selectedOption.value, selectedOption.textContent,div)
       this.addCruz(div,(evento)=>{
       TODO://quitar el input relacionado a él
        div.remove()
        
       })
       this.divContainer.appendChild(div)
    }

   
    addCruz=(Elemento,funcionCruz)=>{
        const cruz = document.createElement('button');
        cruz.type="button"
        cruz.classList.add('btn', 'btn-close', 'danger', 'btn-sm');
        cruz.addEventListener('click',funcionCruz) 
        Elemento.appendChild(cruz);
    }

    agregarInputHidden(value,texto,div){
        const input=document.createElement('input')
        input.name="unidadesId"
        input.value=value
        input.type="hidden"
        input.textContent=texto
        div.appendChild(input)
    }
  


}


