<template>
  <el-form ref="menuFormRef" label-width="80px" :rules="rules" :model="form">
    <el-form-item label="菜单父级" prop="parent_id">
      <el-tree-select
        v-model="form.parent_id"
        :data="rootMenus"
        :render-after-expand="true"
        default-expand-all
        check-strictly
        style="width: 100%"
        node-key="id"
        placeholder="请选择菜单父级"
        :props="{
          label: 'title',
          children: 'children',
        }"
      />
    </el-form-item>
    <el-form-item label="菜单名称" prop="title">
      <el-input v-model="form.title" maxlength="10"></el-input>
    </el-form-item>
    <el-form-item label="菜单图标">
      <el-popover placement="bottom-start" :width="400" :visible="visible">
        <template #reference>
          <el-input v-model="form.icon" @focus="visible = true" @blur="visible = false"></el-input>
        </template>
        <div text-20 flex flex-wrap gap-10>
          <template v-for="(icon, key) in ElementPlusIconsVue">
            <component :is="icon" size="20" cursor-pointer hover:text-blue @click="form.icon = key" />
          </template>
        </div>
      </el-popover>
    </el-form-item>
    <el-form-item label="菜单路由" prop="uri">
      <el-input v-model="form.uri" placeholder="请填写完整路由"></el-input>
    </el-form-item>
    <el-form-item label="菜单排序" prop="order">
      <el-input v-model="form.order"></el-input>
    </el-form-item>
    <el-form-item label="权限">
      <el-select v-model="form.permission" style="width: 100%" placeholder="请选择权限">
        <el-option label="请选择权限" value=""></el-option>
        <el-option
          v-for="item in permissions"
          :key="item.slug"
          :label="item.name"
          :value="item.slug"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="createMenuData">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, inject, reactive } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import type AdminMenu from '#models/system/admin_menu'
import type AdminPermission from '#models/system/admin_permission'

const menuFormRef = ref()
const menus = inject<AdminMenu[]>('menus')
const permissions = inject<AdminPermission[]>('permissions')

const emit = defineEmits(['submit'])
const visible = ref(false)
const form = ref({
  title: '',
  icon: '',
  uri: '',
  parent_id: 0,
  order: 0,
  permission: '',
})
const rootMenus = computed(() => {
  return [
    {
      id: 0,
      title: '根节点',
      children: menus,
    },
  ]
})
const rules = reactive({
  parent_id: [{ required: true, message: '请选择父级菜单', trigger: 'blur' }],
  title: [{ required: true, message: '请选择输入菜单名称', trigger: 'blur' }],
  uri: [{ required: true, message: '请输入路由', trigger: 'blur' }],
  order: [{ required: true, message: '请输入排序', trigger: 'blur' }],
})

const initForm = (data?: any) => {

  if (data) {
    form.value = {
      title: data.title,
      icon: data.icon,
      uri: data.uri,
      parent_id: data.parent_id,
      order: data.order,
      permission: data.permission,
    }
    return
  }
  form.value = {
    title: '',
    icon: '',
    uri: '',
    parent_id: 0,
    order: 0,
    permission: '',
  }
}
const createMenuData = () => {
  if (!menuFormRef.value) return
  menuFormRef.value.validate((valid: boolean) => {
    if (valid) {
      emit('submit', form.value)
    }
  })
}

defineExpose({
  initForm,
})
</script>
