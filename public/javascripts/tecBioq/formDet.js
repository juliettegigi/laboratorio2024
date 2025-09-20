import InputDataList from "../input-datalist-class.js";
import SelectUnidad from "../selectUnidad.js";
const LIMIT=5;
const OFFSET=0;

const eventoBuscarDeterminacion='buscarDeterminacion'
const liTextCbDeterminaciones=elem=>`${elem.Parametro.id}-${elem.Parametro.nombre}`
const listaDeterminaciones=document.getElementById('listaDeterminaciones');
const listaDeterminacionesSeleccionadas=document.getElementById('listaDeterminacionesSeleccionadas');
const input1=new InputDataList(
    formDet['detInput'],
    listaDeterminaciones,
    eventoBuscarDeterminacion,
    liTextCbDeterminaciones,
    LIMIT,
    OFFSET,
    "",
    'Determinaciones',listaDeterminacionesSeleccionadas);
input1.inicializarInput()



// unidad
const selectUnidad= new SelectUnidad(document.getElementById("selectId"), document.getElementById("containerUnidadesSeleccionadas"));