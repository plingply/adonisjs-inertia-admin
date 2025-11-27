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
            <Expand v-if="isCollapse" />
            <Fold v-else/>
          </el-icon>
        </div>
        <div class="font-bold text-center flex-1 relative h-full flex justify-end flex-items-center">
          <div>
            {{ user?.name }}
          </div>
          <el-icon class="w-24! text-18! text-center cursor-pointer m-l-10px" @click="logout">
            <svg-icon icon-class="logout" c-gray-5 />
          </el-icon>
        </div>
      </div>
    </div>
    <div
      grid
      style="grid-template-columns: auto 1fr; height: calc(100vh - 48px)"
      class="menu_wrapper"
    >
      <el-menu :default-active="activeMenu" :collapse="isCollapse" router @select="menuSelect">
        <menu-content :menus="myMenus"></menu-content>
      </el-menu>
      <div class="p-16 h-full box-border w-full of-y-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import { ref, defineOptions, computed } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import MenuContent from '~/components/MenuContent.vue'
const props = defineProps<{
  user: any
  myMenus: any[]
  path: string
}>()

defineOptions({
  name: 'Layout',
})

const isCollapse = ref(false)
const activeMenu = computed(() => {
  return props.path || '/'
})
const menuSelect = (url: string) => {
  console.log('menuSelect', url)
  if (!url) return
  location.href = url
}

const logout = () => {
  ElMessageBox.confirm('确定要退出吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    location.href = '/logout'
  })
}
</script>

<style lang="scss" scoped>
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
    width: 220px;
  }
}
</style>
