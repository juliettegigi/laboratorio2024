export default class BtnAddVR{
    constructor(btn,divVrXsexo,sexo){
        this.btn=btn
        this.divVrXsexo=divVrXsexo
        this.sexo=sexo
        //estructuraHTML
        this.divValorRef=null
        this.divValorRef=null
        this.div=null
        this.divFormDivVr1=null
        this.divFormDivVr2=null
        this.divFormDivVr3=null
        this.divFormDivVr4=null
        this.divAcciones=null
    }

    addDivVR(){
        console.log("algo")
        this.crearEstructuraHTML();
        
    }
       
    crearEstructuraHTML()
    { this.divValorRef=document.createElement('div')
        this.div=document.createElement('div')
            this.divFormDivVr1=document.createElement('div')
               this.innear1( this.divFormDivVr1)
            this.divFormDivVr2=document.createElement('div')
               this.innear2( this.divFormDivVr2)
            this.divFormDivVr3=document.createElement('div')
               this.innear3( this.divFormDivVr3)
            this.divFormDivVr4=document.createElement('div')
               this.innear4( this.divFormDivVr4)
        this.divAcciones=document.createElement('div')
               this.innear5( this.divAcciones)


        this.apendear();
        this.clasear();
        this.agregarEventos();
        this.focusear();
    }

    focusear(){
        this.divFormDivVr1.querySelector('#nota').focus();

    }

    agregarEventos(){
        this.divAcciones.querySelector('div[title="Eliminar"]').addEventListener('click',()=>{
            this.divValorRef.remove()
        })
    }
    clasear(){
        this.divVrXsexo.classList.add('vrXsexo')
        this.divValorRef.classList.add('valorRef')
        this.divFormDivVr1.classList.add('form-div-vr')
        this.divFormDivVr2.classList.add('form-div-vr')
        this.divFormDivVr3.classList.add('form-div-vr')
        this.divFormDivVr4.classList.add('form-div-vr')
        this.divAcciones.classList.add('acciones')
    }
    apendear(){
        this.divVrXsexo.insertBefore(this.divValorRef,this.btn);
        this.divValorRef.innerHTML=`
        <input type="hidden" name="idsVrForm" value="0">
        <input type="hidden" name="isNew" value="1">
        <input type="hidden" name="sex" value="${this.sexo}">
        `
        this.divValorRef.appendChild(this.div)
        this.divValorRef.appendChild(this.divAcciones)
        this.div.appendChild( this.divFormDivVr1)
        this.div.appendChild( this.divFormDivVr2)
        this.div.appendChild( this.divFormDivVr3)
        this.div.appendChild( this.divFormDivVr4)
    }

    innear1(div){
        div.innerHTML=`
        <div class="d-flex">
            <div class="me-3">
                <label for="nota">Nota</label>
            </div>
            <div> 
                <input type="text" id="nota" name="nota" autocomplete="off" >
            </div>
        </div>
        `
        
    }
    innear2(div){
        div.innerHTML=`
        <div class="d-flex"> 
            <div class="me-3">
                <label for="edadMin">Edad mínima</label>
            </div>
            <div> 
                <input type="text" id="edadMin" name="edadMin" autocomplete="off" >
            </div>
        </div>
        <div class="d-flex"> 
            <div class="me-3">
                <label for="unidadMin">unidad</label>
            </div>
            <div> 
                <select id="unidadMin" name="unidadMin"> 
                    <option value="Días">Días</option>
                    <option value="Meses">Meses</option>
                    <option value="Años" selected="">Años   </option>
                    <option value="-">-   </option>
                </select>
            </div>
        </div>
        
        `
        
    }


    innear3(div){
        div.innerHTML=`
        
        
        <div class="d-flex">       
            <div class="me-3">
                <label for="edadMax">Edad máxima </label>
            </div>
            <div> 
                <input type="text" id="edadMax" name="edadMax" autocomplete="off" value="0" >
            </div>
        </div>
        
        <div class="d-flex"> 
            <div class="me-3">
                <label for="unidadMax">unidad</label>
            </div>
            <div> 
                <select id="unidadMax" name="unidadMax"> 
                    <option value="Días">Días</option>
                    <option value="Meses">Meses</option>
                    <option value="Años">Años   </option>
                    <option value="-" selected="">-        </option>
                </select>
            </div>
        </div>
        
        `

    }



    innear4(div){
        div.innerHTML=`
        <div class="d-flex">
             <div class="me-3">
                <label for="valorMin">Valor mín.</label>
             </div>
             <div> 
                 <input type="text" id="valorMin" name="valorMin" autocomplete="off" value="0.00" >
             </div>
        </div>     
        <div class="d-flex">
            <div class="me-3">
                <label for="valorMax">Valor máx.</label>
            </div>
            <div> 
                <input type="text" id="valorMax" name="valorMax" autocomplete="off" value="0.00" >
            </div>
        </div>
        `
        
    }
    innear5(div){
        div.innerHTML=`
       <div title="Eliminar" class="btnsEditarVR">
             <svg class="bi bi-x-circle" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#261290" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16">
                 </path>
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708">
                </path> 
            </svg>
        </div>    
        `
        
    }

}