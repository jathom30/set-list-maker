const { parentsTable } = require('./airtable')
const formattedReturn = require('./formattedReturn')
module.exports = async (event) => {
  try {
    const parents = await parentsTable.select().firstPage();
    const formattedParents = parents.map((parent) => ({
      id: parent.id,
      ...parent.fields,
    }));
    return formattedReturn(200, formattedParents);
  } catch (err) {
    console.error(err);
    return formattedReturn(500, {});
  }
};