const socketio = require('socket.io');

const parseStringAsArray = require ('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance')

//armazenar a conexao fora para que ela seja acessivel atraves desse metodo
let io;

//armazenar conexoes que aplicaçao ja teve
//como é um aplicacao teste, sera salvo na propria memoria do node - sera usado um array
const connections = [];


exports.setupWebsocket = (server) => {
    io = socketio(server);

    //toda vez que receber uma conexao, recebe um obj chamado socket
    io.on('connection', socket =>{
        const { latitude, longitude, techs } = socket.handshake.query;

        //toda vez que um usuario se conectar denro da aplicaçao, sera colocado um novo obJ 
        //dentro desse array
        connections.push({
            id: socket.id,
            coordinates: {
                //converter para numero, pois como padrao sempre é enviado como String
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            //como esta sendo enviado me formato de texto, precisa do parseStringAsArray.js
            techs: parseStringAsArray(techs),
        });
    })
};

exports.findConnections = (coordinates, techs) => {
    //percorre todas as conexoes do websocket e realiza um filtro
    //pega cada uma das coxecoes e retorna um calculo
    //metodo para fazer o calculo da distancia, que precisa ser menos de 10km
    return connections.filter(connection => {
        //comparar coordenadas do novo dev cadastrado com as coordenadas armazenadas em cada 
        //uma das conexoes de websocket. E ver se essa distancia é menor do que 10
        //segunda verificaçao é das techs
        //Tambem recisa ver se detro das techs que recebe, pelo menos uma delas é verdadeira
        return calculateDistance(coordinates, connection.coordinates) < 10
        //metodo some() retorna true caso uma das condições seja verdadeira
            && connection.techs.some(item => techs.includes(item))

    })
}

//parametros (para quem, tipo da menssagem, valor)
exports.sendMessage = (to, message, data) => {
    //percorre cada um dos destinatarios
    to.forEach(connection => {
        io.to(connection.id).emit(message, data)
    })
}