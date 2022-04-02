export type SetlistType = {
  [key: string]: string[]
}

export type ParentSetlistType = {
  id?: string;
  name: string;
  setlists: {
    [key: string]: string[]
  };
  setlistIds: string[];
  dateModified?: string;
  modifiedBy: string;
}