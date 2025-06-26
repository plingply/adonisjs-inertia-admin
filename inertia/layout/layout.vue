<template>
  <div bg-light-5 h-100vh of-y-auto>
    <div grid bg-white h-48 style="grid-template-columns: auto 1fr">
      <div
        :class="{ is_collapse: isCollapse }"
        class="menu_collapse text-center p-10 box-border flex items-center"
      >
        <div>
          <img v-if="!isCollapse" class="h-32" src="../assets/images/logo_full.png" alt="logo" />
          <img v-else class="h-40" src="../assets/images/logo.png" alt="logo" />
        </div>
      </div>
      <div class="ml-16 grid gap-24 items-center" style="grid-template-columns: 60px 1fr 0px">
        <div class="flex items-center h-48 cursor-pointer" @click="isCollapse = !isCollapse">
          <el-icon class="w-24! text-18! text-center">
            <svg-icon icon-class="collapse" :class="isCollapse ? 'rotate-z-180' : ''" />
          </el-icon>
          <span class="menu_collapse_text text-14 c-gray-4">
            {{ !isCollapse ? '收起' : '展开' }}
          </span>
        </div>
        <div class="font-bold text-center flex-1 relative h-full">{{ user.name }}</div>
      </div>
    </div>
    <div
      grid
      style="grid-template-columns: auto 1fr; height: calc(100vh - 48px)"
      class="menu_wrapper"
    >
      <el-menu default-active="/" :collapse="isCollapse" router>
        <menu-content :menus="menuData"></menu-content>
      </el-menu>
      <div class="p-16 h-full box-border w-full of-x-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineOptions } from 'vue'

import MenuContent from '~/components/MenuContent.vue'
defineProps<{
  user: any
}>()

defineOptions({
  name: 'Layout',
})

const isCollapse = ref(false)

const menuData = [
  {
    name: 'Home',
    title: '首页',
    icon: 'collapse',
    url: '/',
    children: [],
  },
  {
    name: 'About',
    url: '/about',
    title: '关于',
    icon: 'collapse',
    children: [
      {
        name: 'Team',
        title: '团队',
        icon: 'collapse',
        url: '/about/team',
        children: [
          {
            name: 'Team',
            title: '团队1',
            icon: 'collapse',
            url: '/about/team',
            children: [],
          },
        ],
      },
      {
        name: 'History',
        title: '历史',
        icon: 'collapse',
        url: '/about/history',
        children: [],
      },
    ],
  },
  {
    name: 'Services',
    title: '服务',
    icon: 'collapse',
    url: '/services',
    children: [
      {
        name: 'Web Design',
        title: '网站设计',
        icon: 'collapse',
        url: '/services/web-design',
        children: [],
      },
      {
        name: 'SEO',
        title: 'SEO',
        url: '/services/seo',
        children: [],
      },
    ],
  },
]
</script>

<style lang="less" scoped>
.menu_collapse {
  transition: var(--el-transition-all);
  padding: 0 10px;
  white-space: nowrap;
  justify-content: center;
  width: 64px;
  overflow: hidden;
  &:not(.is_collapse) {
    width: 180px;
  }

  &.is_collapse {
    .menu_collapse_text {
      display: none;
    }
  }
}
:deep(.menu_wrapper) {
  .el-menu-item.is-active {
    background-color: var(--el-color-primary);
    color: #fff;
  }
  .el-aside {
    width: auto;
  }
  .el-menu:not(.el-menu--collapse) {
    width: 180px;
  }
}
</style>
