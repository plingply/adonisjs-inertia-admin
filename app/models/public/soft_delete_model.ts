import { CamelCaseNamingStrategy } from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'
import { compose } from '@adonisjs/core/helpers'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import BaseModel from './model.js'
class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.snakeCase(propertyName)
  }
}

BaseModel.namingStrategy = new MyCustomNamingStrategy()

export default class SoftDeleteTesModel extends compose(BaseModel, SoftDeletes) {}
