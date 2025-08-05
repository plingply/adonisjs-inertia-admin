import { BaseModel, CamelCaseNamingStrategy } from '@adonisjs/lucid/orm'
import string from '@adonisjs/core/helpers/string'
class MyCustomNamingStrategy extends CamelCaseNamingStrategy {
  serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.snakeCase(propertyName)
  }
}

BaseModel.namingStrategy = new MyCustomNamingStrategy()

export default class Model extends BaseModel {}
