import { FieldSet } from 'airtable'
import { Song } from 'types'
import { base } from './setup'

export const getSongs = () => base(process.env.REACT_APP_AIRTABLE_SONGS_TABLE || '').select().firstPage()

export const createSong = (song: Song) => base(process.env.REACT_APP_AIRTABLE_SONGS_TABLE || '').create([{fields: song}])

export const updateSong = (song: Song) => {
  const {id, ...fields} = song
  return base(process.env.REACT_APP_AIRTABLE_SONGS_TABLE || '').update([{id: id || '', fields: fields as unknown as FieldSet}])
}

export const deleteSong = (id: string) => base(process.env.REACT_APP_AIRTABLE_SONGS_TABLE || '').destroy(id)
