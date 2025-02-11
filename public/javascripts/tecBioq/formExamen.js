

const btnEditar=document.querySelector('#btnEditar')

btnEditar.addEventListener("click", function(event) {
  // Selecciona todos los inputs y selects con las clases específicas
  console.log(this)
  const elements = document.querySelectorAll("input,.form-select");
  
  elements.forEach(element => {
    element.disabled = false; // Habilita los elementos
  });
   this.textContent="Guardar cambios"
   if(this.type==='button'){
     this.type="submit"
     event.preventDefault()
   }
});