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

  // 删除权限
  async deletePeimission(peimission: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    // 删除 subject 权限策略
    await enforcer.removeFilteredPolicy(0, peimission)
    // 删除用户 subject 权限
    await enforcer.removeFilteredNamedGroupingPolicy('g2', 1, peimission)
    // 删除角色 subject 权限
    await enforcer.removeFilteredGroupingPolicy(1, peimission)
    return true
  }

  // 删除权限所有策略
  async deletePeimissionPolicys(peimission: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.removeFilteredPolicy(0, peimission)
  }

  // 添加用户权限
  async addPermissionForUser(username: string, object: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.addNamedGroupingPolicy('g2', username, object)
  }

  // 删除用户权限
  async deletePermissionForUser(username: string, object: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.removeNamedGroupingPolicy('g2', username, object)
  }

  // 删除用户所有权限
  async deletePermissionsForUser(username: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.removeFilteredNamedGroupingPolicy('g2', 0, username)
  }

  // 获取用户权限
  async getPermissionForUser(username: string): Promise<string[]> {
    const enforcer = await this.getEnforcer()
    const permissions = await enforcer.getFilteredNamedGroupingPolicy('g2', 0, username)
    return permissions.map((permission) => permission[1])
  }

  // 获取用户所有权限
  async getAllPermissionForUser(username: string): Promise<string[]> {
    const permissions = await this.getPermissionForUser(username)
    const roles = await this.getUserRoles(username)
    for (const role of roles) {
      const rolesPermissions = await this.getPermissionForRole(role)
      permissions.push(...rolesPermissions)
    }
    return [...new Set(permissions)]
  }

  // 添加用户角色
  async addUserRole(username: string, role: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.addRoleForUser(username, role)
  }
  // 获取用户角色
  async getUserRoles(username: string): Promise<string[]> {
    const enforcer = await this.getEnforcer()
    const roles = await enforcer.getRolesForUser(username)
    return roles
  }

  // 删除用户角色
  async deleteUserRole(username: string, role: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.deleteRoleForUser(username, role)
  }

  // 删除用户所有角色
  async deleteRolesForUser(username: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.deleteRolesForUser(username)
  }

  // 删除角色所有权限
  async deletePermissionsForRole(role: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.deleteRolesForUser(role)
  }

  // 添加角色权限
  async addPermissionForRole(role: string, permission: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    return await enforcer.addGroupingPolicy(role, permission)
  }

  // 获取角色权限
  async getPermissionForRole(role: string): Promise<string[]> {
    const enforcer = await this.getEnforcer()
    const permissions = await enforcer.getImplicitRolesForUser(role)
    return permissions
  }

  // 删除角色
  async deleteRole(role: string): Promise<boolean> {
    const enforcer = await this.getEnforcer()
    // 删除角色 （角色权限）
    await enforcer.deleteRole(role)
    // 删除用户角色
    return await enforcer.removeFilteredGroupingPolicy(1, role)
  }
}
