const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
    async listBy(request, response) {
        
        const { page = 1 } = request.query;

        const ong_id = request.headers.authorization;

        const offset = (page-1)*5;

        const [totalIncidents] = await connection('incidents').where('ong_id', ong_id).count();

        const incidents = await 
            connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .where('ong_id', ong_id)
            .select(['incidents.*', 'ongs.name', 'ongs.email', 'ongs.whatsapp', 'ongs.city', 'ongs.uf']);

        response.header('X-Total-Count', totalIncidents['count(*)']);
    
        return response.json(incidents);
    },

}