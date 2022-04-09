# Set list maker

makes random setlists with an Airtable backend and Netlify's Identity auth

Build Status: [![Netlify Status](https://api.netlify.com/api/v1/badges/7022c8de-6647-4e83-9a5a-208fc73a5fc4/deploy-status)](https://app.netlify.com/sites/stn-setlists/deploys)

Changelog:

April 9, 2022

- Searchable song table
- Confirm setlist delete
- Add tooltips to setlist delete and song tempo icons
- Add setlist loader when generating setlist (unneeded, but fun)

April 5, 2022

- Dark mode

April 4, 2022

- Limit ballads to one per hour per set
- Song keys added to db and displayed in song table
- Sorting added to Song table
- Display key on SongDisplay

Existing functionality

- Create setlist(s) of specific length (in minutes) and quantity, with or without covers
- Update setlist order, replace/remove/add songs, rename setlist
- Track and display when setlist was last updated and by whom
- Modify saved setlists. Either overwrite or save as new
- Delete saved setlists
- Create/Update/Remove songs with which setlists are built
- Log in and out
