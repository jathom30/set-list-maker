require('dotenv').config();
var Airtable = require('airtable');
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
);
const songsTable = base(process.env.AIRTABLE_SONGS_TABLE);
const setlistsTable = base(process.env.AIRTABLE_SETLISTS_TABLE);

module.exports = { songsTable, setlistsTable };