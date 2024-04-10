const express = require ( 'express');
const app = express(); //Para criar o servidor basta instaciar no express ao executar o servidor ele roda em uma posta 
app.use(express.json()); //Para trabalhar com json é middleware
const PORT = 3005;
const yup = require('yup');

//Toda vez que receber uma nova requiseição eu salvo a hora atual da requisicao e mostra a requisição e url
const logHoraMiddleware = (req, res, next) => {
    const horaAtual = new Date().toISOString();
    console.log(
        `[${horaAtual}] Nova solicitação recebida para: ${req.method} ${req.originalUrl}`
    );
    next(); 
};

app.use(logHoraMiddleware);

const schema = yup.object().shape({
    nome: yup.string().required(),
    preco: yup.number().integer().required(),
    descricao: yup.string().required(),
  });

  const validarCriarProduto = async(req, res, next)=>{
    const {body} = req;

    try {
        // Validar os dados recebidos no corpo da solicitação
        await schema.validate(body, { abortEarly: false });
        next(); // Se os dados forem válidos, chame o próximo middleware
      } catch (erro) {
        // Se houver erros de validação, retorne uma resposta com status 400 (Bad Request)
        res.status(400).json({ erro: erro.errors });
      }
    };
  


let produtos = []

app.get('/produtos', (req,res)=>{
    res.json(produtos)
})

app.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const produto = produtos.find(produto => produto.id === parseInt(id));
    if (!produtos) {
        res.status(404).send('Produto não encontrado');
        return;
    }
    res.json(produto);
});


// app.post('/produtos', (req, res,next) => {
//     try {
//             const produto = req.body;
    
//             produto.id = produtos.length + 1
//             produtos.push(produto)
//             res.status(201).send('Produto adicionado com sucesso')
//         } catch (error) {
//                 res.status(404).send(error)        
//             }
        
//         });
app.post('/produtos', validarCriarProduto, (req, res) => {
    const { nome, preco, descricao } = req.body;
    
    res.status(201).json({ mensagem: 'Pessoa adicionada com sucesso', dados: req.body });
  });

app.put('/produtos/:id', (req, res) => {
        const { id } = req.params;
        const newData = req.body;
        const index = produtos.findIndex(produto => produto.id === parseInt(id));
        if (index === -1) {
            res.status(404).send('Produto não encontrado.');
            return;
        }
        produtos[index] = { ...produtos[index], ...newData };
        res.status(200).send('Produto adicionado com sucesso.');
    });
    
    app.delete('/produtos/:id', (req, res) => {
        const { id } = req.params;
        const index = produtos.findIndex(produto => produto.id === parseInt(id));
        if (index === -1) {
            res.status(404).send('Produto não encontrado"');
            return;
        }
        produtos.splice(index, 1);
        res.status(200).send('Produto deletado com sucesso.');
    });
    
    app.listen(PORT, function(){
        console.log("Servidor Rodando")
    })
    
    