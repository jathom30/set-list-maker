const { table } = require('./airtable');
const formattedReturn = require('./formattedReturn');
module.exports = async (event) => {
    try {
        const songs = await table.select().firstPage();
        const formattedSongs = songs.map((song) => ({
            id: song.id,
            ...song.fields,
        }));
        return formattedReturn(200, formattedSongs);
    } catch (err) {
        console.error(err);
        return formattedReturn(500, {});
    }
};