const formattedReturn = require('./helpers/formattedReturn');
const getSetlist = require('./helpers/getSetlist');

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    return await getSetlist(event);
  }
  return formattedReturn(405, {})
};