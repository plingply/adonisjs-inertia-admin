import AdminMenu from '#models/system/admin_menu'

export interface MenuItem extends AdminMenu {
  children?: MenuItem[]
  hasRole?: boolean
  hasPermission?: boolean
}

export interface MenuCreateReq {
  icon: string
  order: number
  parent_id: number
  permission?: string
  title: string
  uri: string
  roles?: string[]
}

export interface MenuUpdateReq {
  id: number
  icon: string
  order: number
  parent_id: number
  permission?: string
  title: string
  uri: string
  roles?: string[]
}
