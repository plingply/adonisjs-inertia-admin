import { createInertiaApp } from '@inertiajs/vue3'
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h, type DefineComponent } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import 'virtual:uno.css'
import 'virtual:svg-icons-register'
import SvgIcon from '~/components/SvgIcon/index.vue'
import MenuContent from '~/components/MenuContent.vue'
import Pagination from '~/components/Pagination/index.vue'
import { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
export default function render(page: any) {
  return createInertiaApp({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue', { eager: true })
      return pages[`../pages/${name}.vue`]
    },

    setup({ App, props, plugin }) {
      return createSSRApp({ render: () => h(App, props) })
        .use(plugin)
        .use(ElementPlus, {
          locale: zhCn,
          zIndex: 3000,
        })
        .component('SvgIcon', SvgIcon)
        .component('MenuContent', MenuContent)
        .component('Pagination', Pagination)
        .provide(ZINDEX_INJECTION_KEY, { current: 0 })
        .provide(ID_INJECTION_KEY, {
          prefix: 1024,
          current: 0,
        })
    },
  })
}
