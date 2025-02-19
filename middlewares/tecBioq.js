



const  bodyPostVr=async(req,res,next)=>{

  console.log("---------------------*****************>>>>>   MIDDLEWARE")
  console.log(req.body)

  req.body.frontData={ id:req.body.id,
                       idsVrForm:req.body.idsVrForm,
                       isNew:req.body.isNew,
                       sex:req.body.sex,
                       nota:req.body.nota,
                       edadMin:req.body.edadMin,
                       unidadMin:req.body.unidadMin,
                       edadMax:req.body.edadMax,
                       unidadMax:req.body.unidadMax,
                       valorMin:req.body.valorMin,
                       valorMax:req.body.valorMax}
  
  for(let propiedad in req.body){
    req.body[`${propiedad}`]=Array.isArray(req.body[`${propiedad}`])
                            ?req.body[`${propiedad}`]
                            :[req.body[`${propiedad}`]];
  }
 
  let {id,nota,edadMin,unidadMin,edadMax,unidadMax,valorMin,valorMax,
    idsVrForm,isNew,sex
  }=req.body
  
  req.body.id=id;
  
  const arr=['Femenino','Masculino','Ambos'];
  arr.forEach(
    sexo=>{
      req.body[`edadMin${sexo}`]=[]
      req.body[`edadMax${sexo}`]=[]
      req.body[`valorMax${sexo}`]=[]
      req.body[`valorMin${sexo}`]=[]

    }
  )
  console.log('------------------------------------------------ whaaaa');
  console.log(idsVrForm)
  idsVrForm.forEach(
    (element,i)=>{
        
      edadMin[i]=parseInt(req.body[`unidadMin`][i]==='Meses'
        ? (req.body[`edadMin`][i]*30)
        : (req.body[`unidadMin`][i]==='Años'
                   ? (req.body[`edadMin`][i]*365)
                   :req.body[`edadMin`][i]))


      edadMax[i]=parseInt(req.body[`unidadMax`][i]==='Meses'? (req.body[`edadMax`][i]*30):
      (req.body[`unidadMax`][i]==='Años'? (req.body[`edadMax`][i]*365):
       req.body[`edadMax`][i]))
       
      valorMax[i]=parseFloat(req.body[`valorMax`][i])

      valorMin[i]=parseFloat(req.body[`valorMin`][i])

        if(isNew[i]==1 || isNew[i]==0){
          const sexo=sex[i]
          req.body[`edadMin${sexo}`].push(edadMin[i])

          req.body[`edadMax${sexo}`].push(edadMax[i])

          req.body[`valorMax${sexo}`].push(valorMax[i])

          req.body[`valorMin${sexo}`].push(valorMin[i])

        }

      
    }
  )
             

/* req.body.valoresRef={
Femenino:vrF,
Masculino:vrM,
Ambos:vrA
} */


next();
}



/* 

const  bodyPostVr=async(req,res,next)=>{
    
      const{id}=req.body; 
      for(let propiedad in req.body){
        req.body[`${propiedad}`]=Array.isArray(req.body[`${propiedad}`])?req.body[`${propiedad}`]:[req.body[`${propiedad}`]];
      }
      req.body.id=id;
      const vrF=[];
      const vrM=[];
      const vrA=[];
      const arr=['Femenino','Masculino','Ambos'];
      let j=0;
          for(let sexo of arr){
            if( req.body[`nota${sexo}`]  
                    || 
                req.body[`editarnota${sexo}` ]
            ){
              req.body[`edadMin${sexo}2`]=[]
              req.body[`edadMax${sexo}2`]=[]
              req.body[`valorMax${sexo}2`]=[]
              req.body[`valorMin${sexo}2`]=[]
              for(let i=0;i<req.body[`nota${sexo}`].length;i++){
                        const vr={
                            id:req.body[`idsVrForm`][j++],
                            nota:req.body[`nota${sexo}`][i],
                            edadMin:req.body[`edadMin${sexo}`][i],
                            valorMin:req.body[`valorMin${sexo}`][i],
                            edadMax:req.body[`edadMax${sexo}`][i],
                            valorMax:req.body[`valorMax${sexo}`][i],
                            unidadMin:req.body[`unidadMin${sexo}`][i],
                            unidadMax:req.body[`unidadMax${sexo}`][i],
                        }   
                      

                        switch(sexo){
                            case 'Femenino':vrF.push(vr);break;
                            case 'Masculino':vrM.push(vr);break;
                            case 'Ambos':vrA.push(vr);break;
                        }
                
                        
                        req.body[`edadMin${sexo}2`][i]= parseInt(req.body[`unidadMin${sexo}`][i]==='Meses'? (req.body[`edadMin${sexo}`][i]*30):
                                 (req.body[`unidadMin${sexo}`][i]==='Años'? (req.body[`edadMin${sexo}`][i]*365):
                                  req.body[`edadMin${sexo}`][i]))
                        ,
                        req.body[`edadMax${sexo}2`][i]= parseInt(req.body[`unidadMax${sexo}`][i]==='Meses'? (req.body[`edadMax${sexo}`][i]*30):
                                  (req.body[`unidadMax${sexo}`][i]==='Años'? (req.body[`edadMax${sexo}`][i]*365):
                                   req.body[`edadMax${sexo}`][i])),
                        req.body[`valorMax${sexo}2`][i]=parseFloat(req.body[`valorMax${sexo}`][i]),           
                        req.body[`valorMin${sexo}2`][i]=parseFloat(req.body[`valorMin${sexo}`][i])  
                        
                        
                      
              }
            }
  }
  req.body.valoresRef={
    Femenino:vrF,
    Masculino:vrM,
    Ambos:vrA
  }
  next();
}

 */

const seSolapaPostVr=async (valor,req,sexo)=>{
 
   
        
            const edadMin=req.body[`edadMin${sexo}`];
            const edadMax=req.body[`edadMax${sexo}`];
            edadMin.forEach(  (min1,i1)=>{
                edadMin.forEach((min2,i2)=>{
                  const max1=edadMax[i1];
                  const max2=edadMax[i2]; 
                  if(i1==i2 && min1>max1 && req.body[`unidadMax${sexo}`][i1]!='-'){
                   /*  console.log("-----------------if1")
                    console.log(min1," >= ", max1," = ",min1>=max1) */
                    throw new Error(`Se solapan los valores de referencia que se quieren ingresar, el min(${valor}) es mayor al máx.`);
                  }
                  if(  i1!=i2 ){
                      if(   (min1>min2 && min1<max2)
                             ||
                          (max1>min2 && max1<max2)
                         ){  /* console.log("-----------------if2")
                             console.log(min1," >= ", min2," = ",min1>=min2)
                             console.log(min1," <= ", max2," = ",min1<=max2)
                             console.log(max1," <= ", min2," = ",max1>=min2)
                             console.log(max1," <= ", max2," = ", max1<=max2) */
                             throw new Error(`Se solapan los valores de referencia que se quieren ingresar,  ${valor}`);
                          }
                      if((min1==min2 && max1==max2)){
                        throw new Error(`Se solapan3 los valores de referencia que se quieren ingresar,  ${valor}`);
               
                      }    
                      if( max1==min2){
                          min2++
                      }
                  }


                  //&& (max1==min2 && max1==max2)
                })
            }) 
    
}

const valoresMayorMenor=async(valor,req,sexo)=>{
  if(req.body[`valorMin${sexo}`]){
       const valoresMinimos=req.body[`valorMin${sexo}`];
       const valoresMaximos=req.body[`valorMax${sexo}`];

       valoresMinimos.forEach((vm,i)=>{
        if(valoresMaximos[i]<valoresMinimos[i])
          throw new Error(`${sexo}: valor mín(${valor}) no puede ser mayor al valor máx`);
       })

  }

}

module.exports={
    bodyPostVr,
    seSolapaPostVr,
    valoresMayorMenor
};