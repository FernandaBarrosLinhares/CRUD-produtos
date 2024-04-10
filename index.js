const express = require ( 'express');
const app = express();
app.use(express.json());



const logHoraMiddleware = (req, res, next) => {
    const horaAtual = new Date().toISOString();
    console.log(
        `[${horaAtual}] Nova solicitação recebida para: ${req.method} ${req.originalUrl}`
    );
    next(); 
};

app.use(logHoraMiddleware);

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


app.post('/produtos', (req, res,next) => {
    try {
            const produto = req.body;
    
            produto.id = produtos.length + 1
            produtos.push(produto)
            res.status(201).send('Produto adicionado com sucesso')
        } catch (error) {
                res.status(404).send(error)        
            }
        
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
    
    app.listen(3000, function(){
        console.log("Servidor Rodando")
    })
    
    