require('dotenv').config();
var Airtable = require('airtable');
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
);
const songsTable = base(process.env.AIRTABLE_SONGS_TABLE);
const setlistsTable = base(process.env.AIRTABLE_SETLISTS_TABLE);
const parentsTable = base(process.env.AIRTABLE_PARENT_TABLE);

module.exports = { songsTable, setlistsTable, parentsTable };