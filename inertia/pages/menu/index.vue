<template>
  <div flex class="menu-tree">
    <div flex-1 bg-white p-20>
      <div m-b-10 border-b="1px solid #eee" p-b-10>
        <el-button type="primary" m-r-10 @click="changeExpandAll">{{
          !expandAll ? '展开' : '收起'
        }}</el-button>
        <el-button type="success" m-r-10 @click="saveMenuData">保存</el-button>
        <el-button type="warning" @click="getMenuTree">刷新</el-button>
      </div>
      <el-tree
        ref="treeRef"
        style="width: 100%"
        :data="menus"
        draggable
        default-expand-all
        node-key="id"
        :props="{
          label: 'title',
          children: 'children',
        }"
      >
        <template #default="{ data }">
          <div
            h-32
            w-full
            border="1px solid #ddd"
            m-2
            p-x-10
            lh-32
            flex
            justify-between
            items-center
          >
            <div flex items-center>
              <el-icon v-if="data.icon" m-r-5>
                <svg-icon :icon-class="data.icon" />
              </el-icon>
              <span m-r-10>{{ data.title }}</span>
              <el-link type="primary" underline="never">{{ data.uri }}</el-link>
            </div>
            <div>
              <el-button type="primary" size="small" text @click.stop="editMenu(data)">编辑</el-button>
              <el-button type="danger" size="small" text @click.stop="deleteMenu(data.id)"
                >删除</el-button
              >
            </div>
          </div>
        </template>
      </el-tree>
    </div>
    <div flex-1 m-l-20 bg-white p-20>
      <div border-b="1px solid #eee" lh-40 m-b-20>新增</div>
      <MenuForm ref="menuFormRef" @submit="createMenuData" />
    </div>
  </div>

  <MenuEdit ref="menuEditRef" @submit="getMenuTree"/>
</template>

<script setup lang="ts">
import { ref, provide, defineOptions, defineProps } from 'vue'
import Layout from '~/layout/layout.vue'
import { saveMenu, getAllMenuToTree, delMenuById, createMenu } from '~/api/menu'
import { ElMessage, ElMessageBox } from 'element-plus'
import MenuForm from './menu-form.vue'
import MenuEdit from './menu-edit.vue'

defineOptions({ layout: Layout })
const props = defineProps<{
  menus: any[]
  permissions: any[]
  roles: any[]
  icons: string[]
}>()


const menuFormRef = ref()
const menuEditRef = ref()
const menus = ref(props.menus)
const treeRef = ref()
const expandAll = ref(true)

provide('menus', menus)
provide('permissions', props.permissions)
provide('roles', props.roles)
provide('icons', props.icons)

const formatNodeParentId = (tree: any[], parentId = 0) => {
  const data = tree.map((item, index) => {
    if (!item) return item
    item.parentId = parentId
    item.order = index + 1
    if (item.children && item.children.length > 0) {
      item.children = formatNodeParentId(item.children, item.id)
    }
    return item
  })
  return data
}

const formatTreeNodeToArray = (tree: any[]) => {
  const data = [] as any[]
  function loop(tree: any[]) {
    for (let i = 0; i < tree.length; i++) {
      const item = tree[i]
      if (!item) continue
      data.push({
        id: item.id,
        parentId: item.parentId,
        title: item.title,
        permission: item.permission,
        icon: item.icon,
        path: item.path,
        order: item.order,
      })
      if (item.children && item.children.length > 0) {
        loop(item.children)
      }
    }
  }
  loop(tree)
  return data
}

const saveMenuData = () => {
  const data = formatTreeNodeToArray(formatNodeParentId(menus.value))
  saveMenu(data).then((res) => {
    if (res.data.code == 200) {
      ElMessage.success('保存成功')
      getMenuTree()
    } else {
      ElMessage.error('保存失败')
    }
  })
}

const getMenuTree = () => {
  getAllMenuToTree().then((res) => {
    menus.value = res.data.data
  })
}

const changeExpandAll = () => {
  expandAll.value = !expandAll.value
  const nodes = treeRef.value.store._getAllNodes()
  nodes.forEach((item: any) => {
    item.expanded = expandAll.value
  })
}

const deleteMenu = (id: number) => {
  ElMessageBox.confirm('是否确定删除菜单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      delMenuById(id).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success('删除成功')
          getMenuTree()
        } else {
          ElMessage.error('删除失败')
        }
      })
    })
    .catch(() => {})
}

const createMenuData = (data: any) => {
  createMenu(data).then((res) => {
    if (res.data.code === 200) {
      ElMessage.success('创建成功')
      menuFormRef.value?.initForm()
      getMenuTree()
    } else {
      ElMessage.error('创建失败')
    }
  })
}

const editMenu = (data:any) => {
    menuEditRef.value.show(data)
}
</script>

<style lang="less" scope>
.menu-tree {
  .el-tree-node__content {
    height: auto !important;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
