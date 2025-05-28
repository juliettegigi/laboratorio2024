
let i=0
const rojo=document.querySelectorAll('.text-danger');
     rojo.forEach((e)=>e.addEventListener('input',()=>{
         e.classList.remove('text-danger');
         if(i==0){
             const alertDanger=document.querySelector('.alert-danger');
             alertDanger.remove()
             i++
         }
         }))

