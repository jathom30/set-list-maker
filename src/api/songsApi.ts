import axios, {AxiosResponse} from 'axios'
import { Song } from 'types'

const songsUrl = '/.netlify/functions/songs'

export const getSongs = (): Promise<AxiosResponse<Song[], any>> => axios.get(songsUrl)

export const createSong = (song: Song): Promise<AxiosResponse<Song, any>> =>
  axios.post(songsUrl, song)
  
export const updateSong = (song: Song): Promise<AxiosResponse<Song, any>> =>
  axios.put(songsUrl, song)

// export const deleteSong = (id: string): Promise<AxiosResponse<Song, any>> =>
//   axios.delete(songsUrl, {data: id})

export const deleteSong = async (id: string) => {
  try {
      await fetch(songsUrl, {
          method: 'DELETE',
          body: JSON.stringify({ id }),
      });
  } catch (err) {
      console.error(err);
  }
}