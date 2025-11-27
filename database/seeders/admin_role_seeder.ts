import AdminRole from '#models/system/admin_role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    AdminRole.updateOrCreateMany(
      ['id'],
      [
        {
          id: 1,
          name: '超级管理员',
          slug: 'administrator',
        },
      ]
    )
  }
}
