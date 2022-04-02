import { FieldSet } from 'airtable';
import { ParentSetlistType } from 'types';
import { base } from './setup';

const parentBase = base(process.env.REACT_APP_AIRTABLE_PARENT_TABLE || '')

export const getParentLists = () => parentBase.select().firstPage()

export const getParentList = (id: string) => parentBase.find(id)

export const createParentSetlists = (parent: ParentSetlistType) => {
  const fields = {
    ...parent,
    setlists: JSON.stringify(parent.setlists),
    setlistIds: JSON.stringify(parent.setlistIds),
  }
  return parentBase.create([{fields}])
}

export const deleteParentSetlists = (id: string) => parentBase.destroy(id)

export const updateParentSetlists = (parent: ParentSetlistType) => {
  const {id, ...fields} = parent
  const updatedFields: FieldSet = {
    ...fields,
    setlists: JSON.stringify(parent.setlists),
    setlistIds: JSON.stringify(parent.setlistIds),
  }
  return parentBase.update([{id: id || '', fields: updatedFields}])
}
