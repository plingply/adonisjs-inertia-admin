import { Enforcer, newEnforcer } from 'casbin'
import app from '@adonisjs/core/services/app'
import { KnexAdapter } from 'casbin-knex-adapter'
import databaseConfig from '#config/database'
import Knex from 'knex'
export default class CasbinService {
  private enforcer: Enforcer | null = null

  async getEnforcer(): Promise<Enforcer> {
    if (!this.enforcer) {
      await this.initEnforcer()
    }
    return this.enforcer!
  }

  private async initEnforcer() {
    const optons = databaseConfig.connections.mysql
    const kextSchema = Knex(optons)
    const adapter = await KnexAdapter.newAdapter(kextSchema, {
      tableName: 'casbin_rules',
    })

    // 创建 enforcer
    this.enforcer = await newEnforcer(app.makePath('config/casbin_model.conf'), adapter)
    // this.enforcer = await newEnforcer(
    //   app.makePath('config/casbin_model.conf'),
    //   app.makePath('config/policy.csv')
    // )

    // 加载策略
    await this.enforcer.loadPolicy()
  }

  // 权限检查
  async checkPermission(subject: string, object: string, action?: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.enforce(subject, object, action)
  }

  // 添加策略
  async addPolicy(subject: string, object: string, action: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.addPolicy(subject, object, action)
  }

  // 删除策略
  async deletePolicy(subject: string, object: string, action: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.removePolicy(subject, object, action)
  }

  // 添加用户权限
  async addPermissionForUser(subject: string, object: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.addGroupingPolicy(subject, object)
  }

  // 获取用户权限
  async getPermissionForUser(subject: string): Promise<string[]> {
    const enforcer = await this.getEnforcer()
    const permissions = await enforcer.getRolesForUser(subject)
    return permissions.map((item) => item[1])
  }

  // 删除用户权限
  async deletePermissionsForUser(subject: string, permissions?: string[]): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    const userPermissions = await this.getPermissionForUser(subject)
    for (const permission of userPermissions) {
      if (!permissions) {
        await enforcer.removeGroupingPolicy(subject, permission)
      } else {
        if (permissions.includes(permission)) {
          await enforcer.removeGroupingPolicy(subject, permission)
        }
      }
    }
    return true
  }

  // 为用户分配角色
  async addGroupingPolicy(userId: string, role: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.addGroupingPolicy(userId, role)
  }

  // 获取用户的所有角色
  async getRolesForUser(userId: string): Promise<string[]> {
    const enforcer = await this.getEnforcer()
    return await enforcer.getRolesForUser(userId)
  }

  // 移除用户角色
  async deleteRoleForUser(userId: string, role: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.deleteRoleForUser(userId, role)
  }

  async deleteRolesForUser(userId: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.deleteRolesForUser(userId)
  }

  // 添加菜单策略
  async addMenuPolicy(subject: string, object: string, action: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.addPolicy(subject, object, action, 'menu')
  }

  // 删除菜单策略
  async deleteMenuPolicy(subject?: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    if (subject) {
      return await enforcer.removeFilteredPolicy(0, subject)
    } else {
      return await enforcer.removeFilteredPolicy(3, 'menu')
    }
  }

  // 删除菜单权限或角色
  async deleteMenuPermissionAndRole(subject: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.removeFilteredGroupingPolicy(1, subject)
  }
}
