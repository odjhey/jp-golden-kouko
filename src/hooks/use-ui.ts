import { useStore } from './use-store'

export const useUi = () => {
  const { loading, store } = useStore()
  const ui = store.userspace.ui

  return { loading, ui }
}
