import { useEffect, useState } from 'react'
import { RootStore, State, TRootStore } from '../models/root'
import { loadFromStorage, saveOnChange, setup } from '../models/setup'
import { castToReferenceSnapshot, castToSnapshot } from 'mobx-state-tree'

export const useStore = () => {
  const [store, setStore] = useState<TRootStore>(() => {
    const state = State.create({ id: 'default' })
    return RootStore.create({
      userspace: {
        state: castToSnapshot(state),
        ui: { stateRef: castToReferenceSnapshot(state) },
      },
    })
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setup(store, [saveOnChange, loadFromStorage])
      .then((s) => {
        setStore(s)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { store, loading }
}

export const useUserspace = () => {
  const { loading, store } = useStore()
  const userspace = store.userspace

  return { loading, userspace }
}
