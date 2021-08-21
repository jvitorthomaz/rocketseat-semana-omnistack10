const Dev = require('../models/dev')
const parseStringAsArray = require('../utils/parseStringAsArray')


module.exports = {
    async index(request, response){
        //realizaçao da busca dos devs
        //Buscar todos os devs nunm raio de 10km
        //Filtrar por tecnologias
        const{ latitude, longitude, techs} = request.query

        const techsArray = parseStringAsArray(techs)
        
        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
        })

        return response.json({ devs })
       
    }
}