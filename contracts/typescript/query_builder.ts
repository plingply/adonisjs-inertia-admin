// contracts/typescript/query-builder.ts
declare module '@adonisjs/lucid/database' {
  interface DatabaseQueryBuilder {
    getCount(): Promise<number>
    deleteSoft(): Promise<void>
    restore(): Promise<void>
  }
}
declare module '@adonisjs/lucid/orm' {
  interface ModelQueryBuilder {
    getCount(): Promise<number>
    deleteSoft(): Promise<void>
    restore(): Promise<void>
  }
}
declare module '@adonisjs/lucid/types/querybuilder' {
  interface ChainableContract {
    getCount(): Promise<number>
    deleteSoft(): Promise<void>
    restore(): Promise<void>
  }
}
