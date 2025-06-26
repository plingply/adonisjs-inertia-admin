import AdminMenu from '#models/admin_menu'

export interface MenuItem extends AdminMenu {
  children?: MenuItem[]
  hasRole?: boolean
  hasPermission?: boolean
}
