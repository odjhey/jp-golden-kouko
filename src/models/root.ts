import { Instance, types } from 'mobx-state-tree'

const SubEntry = types.model('SubEntry', {
  num: types.number,
  time: types.string,
  values: types.array(types.string),
})
const Sub = types.model('Sub', {
  id: types.identifier,
  title: types.string,
  values: types.array(SubEntry),
})

export const State = types
  .model('State', {
    id: types.identifier,
    subs: types.array(Sub),
  })
  .actions((self) => {
    return {
      addSub: (sub: {
        id: string
        title: string
        values: { num: number; time: string; values: string[] }[]
      }) => {
        const { id, title, values } = sub
        self.subs.push({ id, title, values })
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
        return match.values
      },
    }
  })
  .actions((self) => {
    return {
      addSub: (sub: {
        id: string
        title: string
        values: { num: number; time: string; values: string[] }[]
      }) => {
        self.stateRef.addSub(sub)
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
