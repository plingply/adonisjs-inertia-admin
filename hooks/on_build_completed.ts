import type { AssemblerHookHandler } from '@adonisjs/core/types/app'
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import path from 'node:path'

function myCustomLogic() {
  // 拷贝.env.production 到build 目录下 .env
  if (process.env.NODE_ENV === 'test') {
    if (existsSync('.env.test')) {
      copyFileSync('.env.test', 'build/.env')
    }
  }

  if (process.env.NODE_ENV === 'production') {
    if (existsSync('.env.production')) {
      copyFileSync('.env.production', 'build/.env')
    }
  }
  return Promise.resolve()
}
const buildHook: AssemblerHookHandler = async () => {
  console.log('build completed hook: ', process.env.NODE_ENV)
  await myCustomLogic()
}

export default buildHook
