
import BtnAddVR from "./btnAddVR.js";

document.querySelectorAll('.btnAddVR').forEach(
    (btn,index)=>{ 
       console.log("see")
       const sex=btn.getAttribute('sexo')
       btn.addEventListener("click",event=> {
       const ref=new BtnAddVR(btn,document.querySelectorAll('.vrXsexo')[index],sex)
       ref.addDivVR()
    })

    btn.addEventListener("keydown", event => {
      if (event.key === "Enter") {
          event.preventDefault();  // Evita comportamientos predeterminados
          const ref = new BtnAddVR(btn, document.querySelectorAll('.vrXsexo')[index], sex);
          ref.addDivVR();
      }
  });


 }
 )


const btnCruzVR = document.querySelectorAll('.btnCruzVR');


btnCruzVR.forEach(button => {
  button.addEventListener('click', () => { 
    const vrrt = button.closest('.valorRef');
    const id=button.getAttribute('vrId')
    vrrt.remove();
    
    
  });

             
});


const btnsDesactivar=document.querySelectorAll('.desactivar')
const btnsActivar=document.querySelectorAll('.activar')

const eventoDesactivar=(event)=>{
  const contenedor =event.target.closest('.valorRef'); 
  const elements = contenedor.querySelectorAll("input,select");
  elements.forEach(e=>{
    e.setAttribute("readonly",true);

  })
  elements[1].value='3'
  elements[2].disabled=false
  event.target.classList.remove('desactivar')
  event.target.classList.add('activar')
  event.target.textContent="Activar"
  event.target.removeEventListener('click',eventoDesactivar)
  event.target.addEventListener('click',eventoActivar)
}


const eventoActivar=(event)=>{
  const contenedor = event.target.closest('.valorRef'); 
  const elements = contenedor.querySelectorAll("input,select");
  elements.forEach(e=>{
    e.removeAttribute("readonly");
  })
  elements[1].value='0'
  elements[2].disabled=true
  event.target.classList.remove('activar')
  event.target.classList.add('desactivar')
   event.target.textContent="Desactivar"
   event.target.removeEventListener('click',eventoActivar)
   event.target.addEventListener('click',eventoDesactivar)
  }

  


btnsDesactivar.forEach(
   btn=>{
          btn.addEventListener('click',eventoDesactivar)
   }

)

btnsActivar.forEach(
  btn=>{
         btn.addEventListener('click',eventoActivar)
  }

)