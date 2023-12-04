import localforage from 'localforage'
import { TRootStore } from './root'
import { applySnapshot, onSnapshot } from 'mobx-state-tree'

type StoreMiddleware = (store: TRootStore) => TRootStore | Promise<TRootStore>

export const setup = async (
  store: TRootStore,
  middlewares: StoreMiddleware[],
): Promise<TRootStore> => {
  return middlewares.reduce((p, c) => {
    return p.then((x) => c(x))
  }, Promise.resolve(store))
}

const ROOTSTORE_KEY = 'rootStore-asdfj1'
export const loadFromStorage: StoreMiddleware = async (store) => {
  await localforage.getItem(ROOTSTORE_KEY).then((snap) => {
    if (snap) {
      applySnapshot(store, snap)
    }
  })

  return store
}

export const saveOnChange: StoreMiddleware = (store) => {
  onSnapshot(store, (snap) => {
    localforage.setItem(ROOTSTORE_KEY, snap)
  })

  return store
}
