<template>
  <template v-if="isArray(menus) && menus.length > 0">
    <template v-for="menu in menus" :key="menu.name">
      <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.uri">
        <template #title>
          <el-icon v-if="menu.icon">
            <component :is="getIconComponent(menu.icon)"></component>
          </el-icon>
          <span>{{ menu.title }}</span>
        </template>
        <menu-content :menus="menu.children"></menu-content>
      </el-sub-menu>
      <el-menu-item v-else :index="menu.uri">
        <el-icon v-if="menu.icon">
          <component :is="getIconComponent(menu.icon)"></component>
        </el-icon>
        <template #title>{{ menu.title }}</template>
      </el-menu-item>
    </template>
  </template>
</template>
<script setup lang="ts">
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const props = defineProps<{
  menus: any[]
}>()

const getIconComponent = (icon: string) => {
  return ElementPlusIconsVue[icon]
}
const isArray = (data: any) => {
  return Array.isArray(data)
}
</script>
<style scoped>
.svgClass {
  font-size: 18px;
  padding-right: 6px;
  opacity: 0.6;
}
</style>
