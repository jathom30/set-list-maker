import { FieldSet } from 'airtable';
import { ParentSetlistType } from 'types';
import { base } from './setup';

export const getParentLists = () => base(process.env.REACT_APP_AIRTABLE_PARENT_TABLE || '').select().firstPage()

export const getParentList = (id: string) => base(process.env.REACT_APP_AIRTABLE_PARENT_TABLE || '').find(id)

export const createParentSetlists = (parent: ParentSetlistType) => {
  const fields = {
    ...parent,
    setlists: JSON.stringify(parent.setlists),
    setlistIds: JSON.stringify(parent.setlistIds),
  }
  return base(process.env.REACT_APP_AIRTABLE_PARENT_TABLE || '').create([{fields}])
}

export const deleteParentSetlists = (id: string) => base(process.env.REACT_APP_AIRTABLE_PARENT_TABLE || '').destroy(id)

export const updateParentSetlists = (parent: ParentSetlistType) => {
  const {id, ...fields} = parent
  const updatedFields: FieldSet = {
    ...fields,
    setlists: JSON.stringify(parent.setlists),
    setlistIds: JSON.stringify(parent.setlistIds),
  }
  return base(process.env.REACT_APP_AIRTABLE_PARENT_TABLE || '').update([{id: id || '', fields: updatedFields}])
}
