import { Instance, types } from 'mobx-state-tree'

const SubEntry = types.model('SubEntry', {
  num: types.number,
  time: types.string,
  contents: types.array(types.string),
})
const Sub = types.model('Sub', {
  id: types.identifier,
  title: types.string,
  subEntries: types.array(SubEntry),
})

const Tag = types.model('Tag', {
  // NOTES: after some consideration, lets try to use own copy of subEntry, instead of a reference
  subEntry: SubEntry,
  name: types.string,
})

export const State = types
  .model('State', {
    id: types.identifier,
    subs: types.array(Sub),
    tags: types.array(Tag),
  })
  .actions((self) => {
    return {
      mine: (subEntry: { num: number; time: string; contents: string[] }) => {
        self.tags.push({
          name: 'mine',
          subEntry: {
            num: subEntry.num,
            time: subEntry.time,
            contents: subEntry.contents,
          },
        })
      },
      addSub: (sub: {
        id: string
        title: string
        subEntries: { num: number; time: string; contents: string[] }[]
      }) => {
        const { id, title, subEntries } = sub
        self.subs.push({ id, title, subEntries })
      },
    }
  })
export const Ui = types
  .model('Ui', {
    stateRef: types.reference(State),
  })
  .views((self) => {
    return {
      subs: () => {
        const match = self.stateRef.subs[0]
        if (!match) {
          return []
        }
        return match.subEntries.map((v) => ({
          ...v,
          // TODO: consider subs id
          tags: self.stateRef.tags.filter((t) => v.num === t.subEntry.num),
        }))
      },
      tags: () => {
        return self.stateRef.tags.map((t) => ({ ...t.subEntry, name: t.name }))
      },
    }
  })
  .actions((self) => {
    return {
      addSub: (sub: {
        id: string
        title: string
        subEntries: { num: number; time: string; contents: string[] }[]
      }) => {
        self.stateRef.addSub(sub)
      },
      mine: (subEntry: { num: number; time: string; contents: string[] }) => {
        self.stateRef.mine(subEntry)
      },
    }
  })

const Userspace = types.model('Userspace', {
  state: State,
  ui: Ui,
})

export const RootStore = types.model('RootStore', {
  userspace: Userspace,
})

export type TRootStore = Instance<typeof RootStore>
