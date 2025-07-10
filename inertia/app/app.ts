/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/element-var.scss'
import 'virtual:svg-icons-register'
import 'virtual:uno.css'
import '../css/app.css'
import { createSSRApp, h } from 'vue'
import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import SvgIcon from '~/components/SvgIcon/index.vue'
import MenuContent from '~/components/MenuContent.vue'
import Pagination from '~/components/Pagination/index.vue'
const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )
  },

  setup({ el, App, props, plugin }) {
    createSSRApp({ render: () => h(App, props) })
      .use(plugin)
      .use(ElementPlus, {
        locale: zhCn,
        zIndex: 3000,
      })
      .component('SvgIcon', SvgIcon)
      .component('MenuContent', MenuContent)
      .component('Pagination', Pagination)
      .mount(el)
  },
})
