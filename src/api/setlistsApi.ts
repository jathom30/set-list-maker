import { ParentSetlistType } from 'types';
import { base } from './setup';

export const getParentList = () => base(process.env.REACT_APP_AIRTABLE_PARENT_TABLE || '').select().firstPage()

export const createParentList = (parent: ParentSetlistType) => {
  const fields = {
    ...parent,
    childIds: JSON.stringify(parent.childIds)
  }
  return base(process.env.REACT_APP_AIRTABLE_PARENT_TABLE || '').create([{fields}])
}

export const getSetlist = (id: string) => base(process.env.REACT_APP_AIRTABLE_SETLISTS_TABLE || '').find(id)