const formattedReturn = require('./helpers/formattedReturn');
const getParents = require('./helpers/getParents')

exports.handler = async (event) => {
  if (event.httpMethod === 'GET') {
    return await getParents(event);
  }
  return formattedReturn(405, {})
};