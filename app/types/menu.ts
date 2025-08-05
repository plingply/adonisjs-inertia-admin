import AdminMenu from '#models/system/admin_menu'

export interface MenuItem extends AdminMenu {
  children?: MenuItem[]
  hasRole?: boolean
  hasPermission?: boolean
}
