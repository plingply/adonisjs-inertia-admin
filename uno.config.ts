import { defineConfig } from 'unocss'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import presetRemToPx from '@unocss/preset-rem-to-px'

export default defineConfig({
  // ...UnoCSS options
  content: {
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/],
    },
  },
  presets: [presetUno(), presetAttributify(), presetIcons(), presetRemToPx({ baseFontSize: 4 })],
  theme: {
    colors: {
      wxwork: '#3975C6',
      success: '#67c23a',
      primary: '#384ba1',
    },
  },
})
