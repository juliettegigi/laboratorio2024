const btnCruz = document.querySelectorAll('.btnCruz');


btnCruz.forEach(button => {
  button.addEventListener('click', () => { 
    const vrrt = button.closest('.contenedorBtnCruz');
    vrrt.remove();
})})