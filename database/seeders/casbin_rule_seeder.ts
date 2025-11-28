import CasbinRule from '#models/casbin_rule'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await CasbinRule.updateOrCreateMany(
      ['ptype', 'v0', 'v1'],
      [
        {
          id: 1,
          ptype: 'g',
          v0: 'admin',
          v1: 'administrator',
        },
      ]
    )
  }
}
