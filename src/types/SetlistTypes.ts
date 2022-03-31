export type SetlistType = {
  id?: string;
  localId: string;
  parentId: string;
  songIds: string[];
  index: number;
}

export type ParentSetlistType = {
  id?: string;
  localId: string;
  name: string;
  childIds: string[];
}