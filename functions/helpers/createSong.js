const { songsTable } = require('./airtable')
const formattedReturn = require('./formattedReturn')

module.exports = async (event) => {
  const fields = JSON.parse(event.body)
  try {
    const createdSong = await songsTable.create([{fields}]);
    return formattedReturn(200, createdSong)
  } catch (err) {
    console.error(err)
    return formattedReturn(500, {})
  }
}