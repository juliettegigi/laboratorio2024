const getUsuario= (req, res, next) => {
                req.renderizar = async (errors) => {
                return res.redirect("http://localhost:3000/admins2/") }
                next();
              }


const postUsuario= (req, res, next) => {
                req.renderizar = async (errors) => {
                 console.log(" ERRORES------------------------------------------------------------------------")
                 console.log(errors)    
                 console.log('------------------------------------------------');
                 console.log(req.body);

                const {email,nombre,apellido,documento,
                           telefono}=req.body
                const roles=Array.isArray(req.body.roles) ? req.body.roles : [req.body.roles];
                    req.flash('formDataUsuario', {
                      email, nombre, apellido, documento, telefono,errors,href:req.href || null,roles
                    });             
                //if(req.href){obj.href=req.href}
                return res.redirect("http://localhost:3000/admins2/registrarUsuario") }
                next();
              }

const postTecnico=(req, res, next) => {
                        req.renderizar = async (errors) => {
                         console.log(" ERRORES------------------------------------------------------------------------")
                         console.log(errors)
                         const {UsuarioId}=req.params
                         return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)}
                         next();
}            


const putBioquimico=(req, res, next) => {
                req.renderizar = async (errors) => {
                const {UsuarioId}=req.params;        
                console.log(" ERRORES------------------------------------------------------------------------")
                console.log(errors)
                const { matricula,titulo}=req.body
                return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`)
        }
                next();
}



const putUsuario= (req, res, next) => {
                req.renderizar = async (errors) => {
                    const {UsuarioId}=req.params;
                    console.log(" ERRORES------------------------------------------------------------------------")
                    console.log(errors)
                    const {email,nombre,apellido,documento,
                           matricula,titulo,
                           telefono}=req.body
                    req.flash('formDataUsuario', {
                      email, nombre, apellido, documento,
                      matricula, titulo, telefono,errors,id:UsuarioId
                    });       

                    return res.redirect(`http://localhost:3000/admins2/${UsuarioId}`) 
                }
                next();
}
                
   
const putTecnico=(req, res, next) => {
                        req.renderizar = async (errors) => {
                        console.log(" ERRORES------------------------------------------------------------------------")
                        console.log(errors)
                        const {email,nombre,apellido,documento,
                               telefono}=req.body
                        return res.render(`administrador2/form`,{oculto:false,usuario:{id:req.params.UsuarioId},editarBioquimico:true,errors,email,nombre,apellido,documento,telefono}) }
                        next();
                        }

const putPaciente=(req, res, next) => {
                        req.renderizar = async (errors) => {
                        console.log(" ERRORES------------------------------------------------------------------------")
                        console.log(errors)
                        const {email,nombre,apellido,documento,
                               telefono}=req.body
                        return res.redirect(`http://localhost:3000/admins2/${req.body.UsuarioId}`)
                       }
                        next();
                }                        

module.exports={
    getUsuario,
    postUsuario,
    postTecnico,
    putBioquimico,
    putPaciente,
    putTecnico,
    putUsuario,

}