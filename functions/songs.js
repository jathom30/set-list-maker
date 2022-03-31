const formattedReturn = require('./helpers/formattedReturn');
const getSongs = require('./helpers/getSongs');
const createSong = require('./helpers/createSong');
const deleteSong = require('./helpers/deleteSong');
const updateSong = require('./helpers/updateSong');

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        return await getSongs(event);
    } else if (event.httpMethod === 'POST') {
        return await createSong(event);
    } else if (event.httpMethod === 'PUT') {
        return await updateSong(event);
    } else if (event.httpMethod === 'DELETE') {
        console.log(JSON.parse(event.body))
        return await deleteSong(event);
    } else {
        return formattedReturn(405, {});
    }
};