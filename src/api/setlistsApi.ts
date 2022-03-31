import { ParentSetlistType } from 'types';
import { base } from './setup';

export const getParentList = () => base(process.env.REACT_APP_AIRTABLE_PARENT_TABLE || '').select().firstPage()

export const createParentSetlists = (parent: ParentSetlistType) => {
  const fields = {
    ...parent,
    setlists: JSON.stringify(parent.setlists),
    setlistIds: JSON.stringify(parent.setlistIds),
  }
  return base(process.env.REACT_APP_AIRTABLE_PARENT_TABLE || '').create([{fields}])
}

// export const getSetlist = (id: string) => base(process.env.REACT_APP_AIRTABLE_SETLISTS_TABLE || '').find(id)