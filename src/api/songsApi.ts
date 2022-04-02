import { FieldSet } from 'airtable'
import { BasicSong, SongWithId } from 'types'
import { base } from './setup'

const songsBase = base(process.env.REACT_APP_AIRTABLE_SONGS_TABLE || '')

export const getSongs = () => songsBase.select().firstPage()

export const createSong = (song: BasicSong) => songsBase.create([{fields: song}])

export const updateSong = (song: SongWithId) => {
  const {id, ...fields} = song
  return songsBase.update([{id: id || '', fields: fields as unknown as FieldSet}])
}

export const deleteSong = (id: string) => songsBase.destroy(id)
