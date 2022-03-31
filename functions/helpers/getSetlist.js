const { setlistsTable } = require('./airtable')
const formattedReturn = require('./formattedReturn')
module.exports = async (event) => {
  const {id} = JSON.parse(event.body)
  console.log(event)
  try {
    const setlists = await setlistsTable.find(id);
    const formattedSetlists = setlists.map((setlist) => ({
      id: setlist.id,
      ...setlist.fields,
    }));
    console.log(setlists)
    return formattedReturn(200, formattedSetlists);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};