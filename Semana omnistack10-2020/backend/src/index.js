/*
PARA CADASTRAR NO INSOMNIA FOI USADO:
{
	"github_username": "lucasmontano",
	"techs": "React.js, ReactJS, Node.js ",
	"latitude": -22.3642939,
	"longitude": -47.3626261
}
*/


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//para que a aplicaçao ouça tanto o protocolo http quanto as requisiçoes com protocolo websocket
const http = require('http');
const routes = require('./routes');
//importando apenas uma funçao
const { setupWebsocket } = require('./websocket') 


const app = express();
//extraindo da aplicaçao express o servidor http
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://Vitor:omnistack@cluster0-5gbay.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //estava dando msg de erro o terminal, explicaçao: 
    //https://github.com/Automattic/mongoose/issues/6890
    useCreateIndex: true
 })

//.use = algo que vai ser valido para todas as rotas da aplicação
app.use(cors({ /*origin: 'http://localhost:3000/'*/ }))
app.use(express.json())
app.use(routes)

//MÉTODOS HTTP: GET, POST, PUT, DELETE

//Tipos de Parâmetros:
//Query Params: request.query (Filtros, ordenacao, paginacao, ...) 
//Route Params: request.params(Identificar um recurso na alteração ou remoçao)
//Body: request.body (Dados para criação ou alteraçao de um registro)

//MongoDB: Banco de Dados nao relacional


server.listen(3333)
