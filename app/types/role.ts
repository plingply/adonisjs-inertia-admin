export interface RoleCreateReq {
  name: string
  slug: string
  permissions: string[]
}

export interface RoleUpdateReq {
  id: number
  name: string
  permissions: string[]
}
