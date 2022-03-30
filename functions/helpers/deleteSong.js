const { table } = require('./airtable');
const formattedReturn = require('./formattedReturn');
module.exports = async (event) => {
    const { id } = JSON.parse(event.body);
    try {
      const deletedSong = await table.destroy(id);
      return formattedReturn(200, deletedSong);
    } catch (err) {
        console.log(event.body)
        // console.error(err);
        return formattedReturn(500, event.body);
    }
};