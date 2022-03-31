export type SetlistType = {
  [key: string]: string[]
}

export type ParentSetlistType = {
  id?: string;
  localId: string;
  name: string;
  setlists: {
    [key: string]: string[]
  };
  setlistIds: string[]
}