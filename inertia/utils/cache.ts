import storage from 'good-storage'

interface StorageItemType {
  get: (key: string) => any
  set: (key: string, valye: any) => any
  remove: (key: string) => void
  has: (key: string) => boolean
  clear: () => void
  getAll: () => any
  forEach: () => void
}

interface StorageType extends StorageItemType {
  session: StorageItemType
}

export default storage as StorageType
