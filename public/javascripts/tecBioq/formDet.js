import InputDataList from "../input-datalist-class.js";
const LIMIT=5;
const OFFSET=0;

const eventoBuscarDeterminacion='buscarDeterminacion'
const liTextCbDeterminaciones=elem=>`${elem.id}-${elem.nombre}`
const input1=new InputDataList(formDet['determinacion'],listaDeterminaciones,eventoBuscarDeterminacion,liTextCbDeterminaciones,LIMIT,OFFSET,'DeterminacionId');
input1.inicializarInput()

