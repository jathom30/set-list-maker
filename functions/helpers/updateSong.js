const { songsTable } = require('./airtable');
const formattedReturn = require('./formattedReturn');
module.exports = async (event) => {
    const {id, ...fields} = JSON.parse(event.body);
    try {
        const updatedSong = await songsTable.update([{id, fields}]);
        return formattedReturn(200, updatedSong);
    } catch (err) {
        console.error(err);
        return formattedReturn(500, {});
    }
};