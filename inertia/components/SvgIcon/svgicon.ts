import * as components from '@element-plus/icons-vue'

export default {
  install: (app) => {
    for (const key in components) {
      if (Object.hasOwn(components, key)) {
        const componentConfig = components[key]
        app.component(componentConfig.name, componentConfig)
      }
    }
  }
}
