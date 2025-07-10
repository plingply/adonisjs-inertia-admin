<template>
  <template v-if="isArray(menus) && menus.length > 0">
    <template v-for="menu in menus" :key="menu.name">
      <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.uri">
        <template #title>
          <el-icon v-if="menu.icon">
            <svg-icon class="svgClass" :icon-class="menu.icon"> </svg-icon
          ></el-icon>
          <span>{{ menu.title }}</span>
        </template>
        <menu-content :menus="menu.children"></menu-content>
      </el-sub-menu>
      <el-menu-item v-else :index="menu.uri">
        <el-icon v-if="menu.icon">
          <svg-icon class="svgClass" :icon-class="menu.icon"> </svg-icon
        ></el-icon>
        <template #title>{{ menu.title }}</template>
      </el-menu-item>
    </template>
  </template>
</template>
<script>
export default {
  name: 'menu-content',
  props: ['menus'],
  data() {
    return {}
  },
  methods: {
    isArray(data) {
      return Array.isArray(data)
    }
  },
}
</script>
<style scoped>
.svgClass {
  font-size: 18px;
  padding-right: 6px;
  opacity: 0.6;
}
</style>
