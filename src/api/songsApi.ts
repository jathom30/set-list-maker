import axios, {AxiosResponse} from 'axios'
import { Song } from 'types'

export const getSongs = (): Promise<AxiosResponse<Song[], any>> => axios.get('/api/songs')

export const createSong = (song: Song): Promise<AxiosResponse<Song, any>> =>
  axios.post('/api/songs', song)

export const deleteSong = (id: string): Promise<AxiosResponse<Song, any>> =>
  axios.delete('/api/songs', {data: id})

export const updateSong = (song: Song): Promise<AxiosResponse<Song, any>> =>
  axios.put('/api/songs', song)