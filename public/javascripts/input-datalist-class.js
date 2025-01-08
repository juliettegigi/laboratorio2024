export default class InputDataList{
    //recibo el input, 
    //la lista, 
    //el evento del socket q hace una búsqueda paginada y  retorna un arreglo y el total de registros
    // el texto del li, un cb q retorna el texto del li, el cb recibe el objeto del arreglo q retornó la búsqueda
    // el inputHiddenNAme el nombre del input q va a llevar el id de lo q se seleccione
    // funcionEnter es una funcion q se va a ejecutar cuando se seleccione un elemento de la datalist
    constructor(input,lista,nombreEvento,liTextCb,limit,offset,inputHiddenName,funcionEnter=null){
        this.input=input;
        this.nombreEvento=nombreEvento;
        this.lista=lista;
        this.liTextCb=liTextCb;
        this.limit=limit;
        this.offset=offset;
        this.indexHover = -1;
        this.lista.parentNode.style.display = "none"; // Oculta la div de la lista
        this.inputHiddenName=inputHiddenName
       this.funcionEnter=funcionEnter;
       this.arrayLis=[]
    }

    
    clickLi=(event)=>{
      this.input.value = event.target.textContent; // Asigna el texto al input
      const indice=event.target.getAttribute('indice')
      if(this.inputHiddenName)
         this.input.form.elements[this.inputHiddenName].value=this.arrayLis[indice].id
      this.input.select(); // Selecciona todo el texto del input
      this.lista.parentNode.style.display = "none"; // Oculta la lista
      if(this.funcionEnter){
        this.funcionEnter(event.target.textContent,this.arrayLis[indice].id)
  }
  }



    crearLi=(text="",indice,eventoClickLi=null)=>{
      const li=document.createElement('li')  
        li.textContent=text
        li.classList.add('liInputDataList')
        li.setAttribute('indice',indice)
        if(eventoClickLi)
          li.addEventListener('mousedown',eventoClickLi)
        
        return li;
    }

    
    verMas=(inputValue)=>{
      this.offset+=this.limit
      this.emitirEventoSocket(inputValue,true)
      this.input.focus();
      console.log("en ver masss")
    }
    
    emitirEventoSocket=(inputValue,masResultados=false)=>{
            if(!masResultados){
               this.arrayLis=[];
               this.lista.innerHTML=""
               this.offset=0
            }
             const cb=(arreglo,total)=>{ 
                     let indice=this.arrayLis.length;
                     if(masResultados)  for(let elem of arreglo){
                                     this.arrayLis.push({li:this.crearLi(this.liTextCb(elem),indice,this.clickLi),
                                                         id:elem.id})
                                     this.lista.insertBefore(this.arrayLis[indice].li,this.lista.lastChild)   
                                     indice++
                                    }              
                     
                     else {     if(arreglo.length===0){
                                     const li=this.crearLi();
                                     li.innerHTML=`"${inputValue}" <span style="font-weight:bolder ;">no registrado.</span>`
                                     li.classList.add("text-danger")
                                     this.lista.appendChild(li);
                                }else{  
                                        for(let elem of arreglo) {
                                             
                                             this.arrayLis.push({li:this.crearLi(this.liTextCb(elem),indice,this.clickLi),
                                                                 id:elem.id+`${elem.origen?"-"+elem.origen:""}`})
                                             this.lista.appendChild(this.arrayLis[indice].li);
                                             indice++;
                                            }
                                            console.log("ARREGLO")
                                            console.log(arreglo)
                                     }
                        }
                      console.log("MIRAAADDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD")
                      console.log(total)
                      console.log(this.offset)
                      console.log(arreglo.length)  
                   if(arreglo.length  && total>this.offset+this.limit){
                        if(masResultados)
                            this.lista.lastChild.remove()
                        this.arrayLis.push({li:this.crearLi("ver más resultados",indice,(event)=>this.verMas(inputValue)),id:0})
                        const li=this.arrayLis[indice].li;
                        //li.addEventListener('click',(event)=>this.verMas(inputValue))
                        this.lista.appendChild(li);
                    }
                    else{
                        if(masResultados)
                            this.lista.lastChild.remove()
                    }
                    this.input.focus();
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
        this.input.addEventListener('focus', (e) => {
          this.lista.parentNode.style.display = "";
        });
        this.input.addEventListener('blur', (e) => {
          this.lista.parentNode.style.display = "none";
        });   



         // evento para moverme en la lista 
        this.input.addEventListener("keydown", (e) => {
            const items = this.lista.querySelectorAll("li");
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
                      this.input.form.elements[this.inputHiddenName].value=this.arrayLis[this.indexHover].id
                      this.input.select(); // Selecciona todo el texto del input
                      this.lista.parentNode.style.display = "none"; // Oculta la lista
                      if(this.funcionEnter){
                            this.funcionEnter(this.arrayLis[this.indexHover].li.textContent)
                      }
                    }
              }
            }


          });
    }


}


