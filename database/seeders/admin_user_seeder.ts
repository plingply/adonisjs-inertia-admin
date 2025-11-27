import AdminUser from '#models/system/admin_user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    AdminUser.updateOrCreateMany(
      ['username'],
      [
        {
          username: 'admin',
          password: 'admin',
          name: '管理员',
          phone: '12345678901',
        },
      ]
    )
  }
}
