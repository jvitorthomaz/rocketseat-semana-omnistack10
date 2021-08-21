//recebe a requisiçao e a retorna uma resposta após exetutar seu codigo
/*
Controler, usualmennte tem 5 funcoes: 
index: mostrar uma lista desse recurso, no caso: de devs
show: quando uer mostrar um unico desenvolvedor
store: criar
update: alterar
destroy: deletar
*/
const axios = require('axios')
const Dev = require('../models/dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request, response){
        const devs = await Dev.find()
        return response.json(devs)
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body

        //declara como let para ela poder ser sobreposta mais a frente do codigo
        let dev = await Dev.findOne({github_username})

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
            // async await para aguardar finalizar a chamada para continuar o código
        
            const { name = login, avatar_url, bio} = apiResponse.data 
        
            const techsArray = parseStringAsArray(techs)
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })
            //filtrar as conexoes que estao a no maximo 10km de distancia 
            //e que o novo dev tenha pelo menos uma da techs fitradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )
            //enviar messagem
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
    
        return response.json(dev);
    },



    async update(){

    },

    async destroy(){

    },
}