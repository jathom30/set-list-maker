export type Tempo = 'ballad' | 'chill' | 'medium' | 'up' | 'burner'
export type Feel = 'country' | 'latin' | 'swing' | 'blues' | 'rock' | 'funk' | 'other'
export type SongPlacement = 'opener' | 'closer' | 'other'

// export type Song = {
//   id?: string
//   name: string
//   tempo: Tempo
//   feel: Feel[]
//   placement: SongPlacement
//   length: number
//   isCover?: boolean
// }

export type BasicSong = {
  name: string
  tempo: Tempo
  feel: Feel[]
  placement: SongPlacement
  length: number
  isCover?: boolean
}

export type SongWithId = BasicSong & {id: string}