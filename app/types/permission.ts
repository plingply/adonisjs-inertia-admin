export interface PermissionCreateReq {
  name: string
  slug: string
  permissions?: {
    http_method: string[]
    http_path: string
  }[]
}

export interface PermissionUpdateReq {
  id: number
  name: string
  permissions?: {
    http_method: string[]
    http_path: string
  }[]
}
