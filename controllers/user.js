const{Usuario}=require('../models');


const getUsuarios=async(req,res)=>{
    try{   
        res.json({ok:await Usuario.findAll()})
    }catch(error){
        res.json({msg:"error en get usuario by id"})
    }
}

module.exports={
    getUsuarios
}