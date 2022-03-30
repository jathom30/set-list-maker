import axios, {AxiosResponse} from 'axios'
import { Song } from 'types'

export const getSongs = (): Promise<AxiosResponse<Song[], any>> => axios.get('/.netlify/functions/songs')

export const createSong = (song: Song): Promise<AxiosResponse<Song, any>> =>
  axios.post('/.netlify/functions/songs', song)

export const deleteSong = (id: string): Promise<AxiosResponse<Song, any>> =>
  axios.delete('/.netlify/functions/songs', {data: id})

export const updateSong = (song: Song): Promise<AxiosResponse<Song, any>> =>
  axios.put('/.netlify/functions/songs', song)