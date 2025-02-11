const btnCruzVR = document.querySelectorAll('.btnCruzVR');

btnCruzVR.forEach(button => {
  button.addEventListener('click', () => {
   const vrrt
    = button.closest('.valorRef'); 
   if (vrrt
   ) {
     vrrt
     .remove(); 
   }
  });
});