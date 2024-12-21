const sexos=document.getElementsByName('sexo');
const radioMujer=sexos[1]
const radioHombre=sexos[0];
const radioOtro=sexos[2]
const embz=document.getElementsByName('embarazada')[0];


const f=(e)=> {
    embz.disabled=(e.target.value=='Masculino')
}

radioHombre.addEventListener('change',f)
radioMujer.addEventListener('change',f );
radioOtro.addEventListener('change',f);