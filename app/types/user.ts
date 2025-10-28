export interface UserCreateReq {
  username: string
  name: string
  password: string
  phone: string
  roles: string[]
  permissions: string[]
}

export interface UserUpdateReq {
  id: number
  username: string
  name: string
  password: string
  phone: string
  roles: string[]
  permissions: string[]
}
