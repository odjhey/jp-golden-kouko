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
  subId: types.string,
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
      mine: (params: {
        subId: string
        subEntry: { num: number; time: string; contents: string[] }
      }) => {
        const { subEntry, subId } = params
        self.tags.push({
          name: 'mine',
          subId: subId,
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
    activeSub: types.maybeNull(types.reference(Sub)),
  })
  .views((self) => {
    return {
      subs: () => {
        const match = self.activeSub
        if (!match) {
          return { subId: '', title: '', subEntries: [] }
        }
        const subEntries = match.subEntries.map((v) => ({
          ...v,
          tags: self.stateRef.tags.filter(
            (t) => v.num === t.subEntry.num && match.id === t.subId,
          ),
        }))

        return {
          subId: match.id,
          title: match.title,
          subEntries,
        }
      },
      tags: () => {
        return self.stateRef.tags.map((t) => ({ ...t.subEntry, name: t.name }))
      },
    }
  })
  .actions((self) => {
    return {
      loadSub: (id: string) => {
        const match = self.stateRef.subs.find((s) => s.id === id)
        console.log({ id, match })
        if (!match) {
          return
        }
        self.activeSub = match
      },
      addSub: (sub: {
        id: string
        title: string
        subEntries: { num: number; time: string; contents: string[] }[]
      }) => {
        self.stateRef.addSub(sub)
      },
      mine: (params: {
        subId: string
        subEntry: { num: number; time: string; contents: string[] }
      }) => {
        self.stateRef.mine(params)
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
