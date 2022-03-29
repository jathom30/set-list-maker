export type Feel = 'ballad' | 'chill' | 'medium' | 'up' | 'burner'
export type SongPlacement = 'opener' | 'closer' | 'other'

export type Song = {
  name: string
  feel: Feel
  placement: SongPlacement
  length: number
  isCover?: boolean
  id: string
}
