const knex = require('../bancodedados/conexao');
const cadastroProdutoSquema = require('../validacoes/cadastroProdutoSquema');
const idParamsSquema = require('../validacoes/idParamsSquema');

async function listarProdutosRestaurante (req, res) {
    const { restaurante } = req;

    try {
        const produtos = await knex('produto')
            .where({ restaurante_id: restaurante.id });

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function obterProduto (req, res) {
    const { restaurante } = req;
    const { id: idProduto } = req.params;

    try {
        await idParamsSquema.validate(req.params);

        const produto = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto })
            .first();
            

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function cadastrarProduto (req, res){
    const { restaurante } = req;
    const { nome, preco, descricao, permiteObservacoes } = req.body;
    
    try {
        await cadastroProdutoSquema.validate(req.body);
        
        const valores = {
            restaurante_id: restaurante.id,
            nome,
            descricao,
            preco,
            permite_observacoes: permiteObservacoes
        }

        const produtoExistente = await knex('produto')
            .where('nome', 'ilike', `${nome}`)
            .first();
    
        if (produtoExistente) {
            return res.status(400).json('Já existe produto cadastrado com esse nome');
        }

        const produto = await knex('produto')
            .insert(valores)
            .returning('*');
        
        if (!produto) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json('O produto foi cadastrado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function editarProduto (req, res) {
    const { restaurante } = req;
    const { id: idProduto } = req.params;
    const { nome, preco, descricao, permiteObservacoes } = req.body;

    if (!nome && !preco && !descricao && !permiteObservacoes) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }

    try {
        const produto = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto })
            .first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoAtualizado = await knex('produto')
            .update({ nome, preco, descricao, permite_observacoes: permiteObservacoes })
            .where({ restaurante_id: restaurante.id, id: idProduto });
    

        if (!produtoAtualizado) {
            return res.status(400).json('O produto não foi atualizado');
        }

        return res.status(200).json('O produto foi atualizado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function excluirProduto (req, res) {
    const { restaurante } = req;
    const { id: idProduto } = req.params;

    try {
        await idParamsSquema.validate(req.params);

        const produto = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto })
            .first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoAtivo = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto, ativo: true });

        if (produtoAtivo) {
            return res.status(400).json('Não é possível excluir um produto ativo');
        }

        const produtoExcluido = await knex('produto')
            .del()
            .where({ restaurante_id: restaurante.id, id: idProduto });

        if (!produtoExcluido) {
            return res.status(400).json('O produto não foi excluido');
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function ativarProduto (req, res) {
    const { restaurante } = req;
    const { id: idProduto } = req.params;

    try {
        await idParamsSquema.validate(req.params);

        const produto = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto })
            .first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoAtivado = await knex('produto')
            .update({ ativo: true })
            .where({ restaurante_id: restaurante.id, id: idProduto });

        if (!produtoAtivado) {
            return res.status(400).json('O produto não foi ativado');
        }

        return res.status(200).json('Produto ativado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function desativarProduto (req, res) {
    const { restaurante } = req;
    const { id: idProduto } = req.params;

    try {
        await idParamsSquema.validate(req.params);

        const produto = await knex('produto')
            .where({ restaurante_id: restaurante.id, id: idProduto })
            .first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoDesativado = await knex('produto')
            .update({ ativo: false })
            .where({ restaurante_id: restaurante.id, id: idProduto });

        if (!produtoDesativado) {
            return res.status(400).json('O produto não foi desativado');
        }

        return res.status(200).json('Produto desativado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutosRestaurante,
    obterProduto,
    cadastrarProduto,
    editarProduto,
    excluirProduto,
    ativarProduto,
    desativarProduto
}