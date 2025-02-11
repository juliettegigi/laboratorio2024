export default class InputDataList{
    //recibo el input, 
    //la lista, el data list, 
    //el evento del socket q hace una búsqueda paginada y  retorna un arreglo y el total de registros
    // el texto del li, un cb q retorna el texto del li, el cb recibe el objeto del arreglo q retornó la búsqueda
    // el inputHiddenNAme el nombre del input q va a llevar el id de lo q se seleccione
    // funcionEnter es una funcion q se va a ejecutar cuando se seleccione un elemento de la datalist
    constructor(input,dataList,nombreEvento,
                liTextCb,limit,offset,
                inputHiddenName,inputHiddenName2,seleccionadosLista=null,
              eventoNoRegistrado,msjLiNoReg){
        this.input=input;
        this.msjLiNoReg=msjLiNoReg
        this.nombreEvento=nombreEvento;
        this.dataList=dataList;
        this.liTextCb=liTextCb;
        this.limit=limit;
        this.offset=offset;
        this.indexHover = -1;
        this.dataList.parentNode.style.display = "none"; // Oculta la div de la lista
        this.inputHiddenName=inputHiddenName
        this.inputHiddenName2=inputHiddenName2
        
        this.seleccionadosLista=seleccionadosLista;
        this.eventoNoRegistrado=eventoNoRegistrado;
        this.arrayLis=[]

       /*  if(seleccionadosLista){
          for(let li of seleccionadosLista.querySelectorAll('li')){
              this.addCruz(li,(evento)=>{li.remove()})
          }
        } */
    }

    agregarCruzLiListaSeleccionados=()=>{
      if(this.seleccionadosLista){
        console.log(this.seleccionadosLista)
        for(let li of this.seleccionadosLista.querySelectorAll('li')){
            this.addCruz(li,(evento)=>{li.remove()})
        }
      }
    }

    removerCruzLiListaSeleccionados=()=>{
      if(this.seleccionadosLista){
        for(let li of this.seleccionadosLista.querySelectorAll('li')){
          const cruz = li.querySelector('.btn-close'); // Selecciona la cruz
          if (cruz) {
            cruz.remove(); // Elimina la cruz si existe
          }
        }
      }
    }

    crearInput=(value,inputName)=>{
      const input=document.createElement('input');
      input.type='hidden';
      input.name=inputName;
      input.value=value
      return input
    }
    


     addCruz=(li,funcionCruz)=>{
      const cruz = document.createElement('button');
      cruz.type="button"
      cruz.classList.add('btn', 'btn-close', 'danger', 'btn-sm');
      cruz.addEventListener('click',funcionCruz) 
      li.appendChild(cruz);
  }

    funcionEnter=(text,id)=>{// funcion para que se haga esto cuando se seleccione algo del dataList
        //antes de agregar a la lista tengo que ver q el text que se quiera agregar no exista en la lista
        const lisListaExamenesSeleccionados=[...this.seleccionadosLista.querySelectorAll('li')];
        if(lisListaExamenesSeleccionados.find(li=>li.textContent===text))
            return
        const li=document.createElement('li')
        li.innerHTML=text;
        this.addCruz(li,(evento)=>{li.remove()})
        this.seleccionadosLista.appendChild(li)
        li.appendChild(this.crearInput(text,`${this.inputHiddenName2}`))
        li.appendChild(this.crearInput(id,`${this.inputHiddenName2}Id`))
    }

    
    clickLi=(event)=>{
      this.input.value = event.target.textContent; // Asigna el texto al input
      const indice=event.target.getAttribute('indice')
      if(this.inputHiddenName)
         this.input.form.elements[this.inputHiddenName].value=this.arrayLis[indice].id
      this.dataList.parentNode.style.display = "none"; // Oculta la lista
      if(this.seleccionadosLista){
          this.funcionEnter(event.target.textContent,this.arrayLis[indice].id)
        }
      this.input.select();
  }



    crearLi=(text="",indice,eventoClickLi=null)=>{
      const li=document.createElement('li')  
        li.textContent=text
        li.classList.add('liInputDataList','dataList-li')
        li.setAttribute('indice',indice)
        if(!eventoClickLi && this.eventoNoRegistrado ){
             li.addEventListener('mousedown',(e)=>{
              this.eventoNoRegistrado(e,this.funcionEnter)
            })
        }
        else if(eventoClickLi)
               li.addEventListener('mousedown',eventoClickLi)
        
        return li;
    }

    
    verMas=(inputValue)=>{
      this.offset+=this.limit
      this.emitirEventoSocket(inputValue,true)
     // this.input.focus();
    }
    
    emitirEventoSocket=(inputValue,masResultados=false)=>{
      this.dataList.parentNode.style.display = "";
      this.indexHover=-1
      this.dataList.parentNode.style.display = "";
            if(!masResultados){
               this.arrayLis=[];
               this.dataList.innerHTML=""
               this.offset=0
            }
             const cb=(arreglo,total)=>{ 

                     let indice=this.arrayLis.length;
                     if(masResultados)  for(let elem of arreglo){
                                     this.arrayLis.push({li:this.crearLi(this.liTextCb(elem),indice,this.clickLi),
                                                         id:elem.id})
                                     this.dataList.insertBefore(this.arrayLis[indice].li,this.dataList.lastChild)   
                                     indice++
                                     this.dataList.parentNode.style.display = "";
                                    }              
                     
                     else {     if(arreglo.length===0){
                                     const li=this.crearLi();
                                     li.innerHTML=`"${inputValue}" <span style="font-weight:bolder ;">no registrado. ${this.msjLiNoReg?this.msjLiNoReg:""}</span>`
                                     li.classList.add("text-danger")
                                     this.dataList.appendChild(li);

                                }else{  
                                        for(let elem of arreglo) {
                                             
                                             this.arrayLis.push({li:this.crearLi(this.liTextCb(elem),indice,this.clickLi),
                                                                 id:elem.id+`${elem.origen?"-"+elem.origen:""}`})
                                             this.dataList.appendChild(this.arrayLis[indice].li);
                                             indice++;
                                            }
                                     }
                        } 
                   if(arreglo.length  && total>this.offset+this.limit){
                        if(masResultados)
                            this.dataList.lastChild.remove()
                        this.arrayLis.push({li:this.crearLi("ver más resultados",indice,(event)=>this.verMas(inputValue)),id:0})
                        const li=this.arrayLis[indice].li;
                        //li.addEventListener('click',(event)=>this.verMas(inputValue))
                        this.dataList.appendChild(li);
                    }
                    else{
                        if(masResultados)
                            this.dataList.lastChild.remove()
                    }
                    this.input.focus();
                  //  this.input.select();
             }
             socket.emit(this.nombreEvento,inputValue,this.limit,this.offset,cb)
             
    }
    
    updateHover(items) {
        items.forEach((item, index) => {
          if (index === this.indexHover) {
            item.classList.add("hover");
          } else {
            item.classList.remove("hover");
          }
        });
      }


    inicializarInput() {
        this.input.addEventListener('input', (e) => {
            this.emitirEventoSocket(this.input.value);
           
        });
        this.input.addEventListener('blur', (e) => {
          this.dataList.parentNode.style.display = "none";
        });   



         // evento para moverme en la lista 
        this.input.addEventListener("keydown", (e) => {
            const items = this.dataList.querySelectorAll("li");
            if (!this.arrayLis.length) return;
        
            // Flecha hacia abajo
            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (this.indexHover < this.arrayLis.length - 1) {
                if(this.indexHover!=-1)
                    this.arrayLis[this.indexHover].li.classList.remove("hover");
                this.indexHover++;
                this.arrayLis[this.indexHover].li.classList.add("hover");
              }
            }
        
            // Flecha hacia arriba
            if (e.key === "ArrowUp") {
              e.preventDefault();
              if (this.indexHover > 0) {
                this.arrayLis[this.indexHover].li.classList.remove("hover");
                this.indexHover--;
                this.arrayLis[this.indexHover].li.classList.add("hover");
              }
            }
        
            // Enter
            if (e.key === "Enter") {
              e.preventDefault();
              if(this.arrayLis[this.indexHover].li.textContent=="ver más resultados"){
                this.verMas(this.input.value)}
              else{
                    if (this.indexHover >= 0 && this.indexHover < this.arrayLis.length) {
                      this.input.value = this.arrayLis[this.indexHover].li.textContent; // Asigna el texto al input
                      if(this.inputHiddenName)
                       this.input.form.elements[this.inputHiddenName].value=this.arrayLis[this.indexHover].id
                      this.input.select(); // Selecciona todo el texto del input
                      this.dataList.parentNode.style.display = "none"; // Oculta la lista
                      if(this.inputHiddenName2){
                            this.funcionEnter(this.arrayLis[this.indexHover].li.textContent,this.arrayLis[this.indexHover].id)
                      }
                    }
              }
            }


          });
    }


}


