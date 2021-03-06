const yup = require('./yup');

const usuarioSquema = yup.object().shape({
    nome: yup.string().max(100).required().trim(),
    email: yup.string().max(100).email().required(),
    senha: yup.string().required().trim()
})

const usuarioEditarSquema = yup.object().shape({
    nome: yup.string().max(100).required().trim(),
    email: yup.string().max(100).email().required(),
    senha: yup.string().trim()
})

const restauranteSquema = yup.object().shape({
    nome: yup.string().max(50).required().trim(), 
    descricao: yup.string().max(100).trim().nullable(), 
    idCategoria: yup.number().integer().positive().required(), 
    taxaEntrega: yup.number().integer().required(), 
    tempoEntregaEmMinutos: yup.number().integer().required(), 
    valorMinimoPedido: yup.number().integer().required(),
    imagem: yup.string().trim(),
    nomeImagem: yup.string().trim()   
})

module.exports = {
    usuarioSquema,
    usuarioEditarSquema,
    restauranteSquema
};