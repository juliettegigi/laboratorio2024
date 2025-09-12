
const guardarRoles=(req,res,usuario)=>{
    const roles=usuario.Rols.map(elem=>elem.nombre)
    req.session.usuario = usuario;
    req.session.roles=roles;
    req.session.isTecnico = roles.includes('Técnico');
    req.session.isBioquimico = roles.includes('Bioquímico');   
    req.session.isPaciente = roles.includes('Paciente'); 
    res.locals.currentUserRoles = req.session.roles || [];
        console.log("Useeeeeeeeeeeeeeeeeer")
    console.log(usuario)
    console.log("Pacienteeeeee")
    console.log(usuario.Paciente)
    if(usuario.Paciente){
        req.session.pacienteId=usuario.Paciente.id
    }
}

module.exports = guardarRoles;