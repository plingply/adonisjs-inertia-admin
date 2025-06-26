<template>
  <el-dialog v-model="dialogVisible" title="编辑菜单" width="600" @open="onOpen">
    <MenuForm ref="menuFormRef" @submit="saveMenuData" />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineEmits } from 'vue'
import MenuForm from './menu-form.vue'
import { updateMenu } from '~/api/menu'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['submit'])

const menuFormRef = ref()
const dialogVisible = ref(false)
const menu = ref<any>(null)
const show = (data: any) => {
  dialogVisible.value = true
  menu.value = data
}

const close = () => {
  dialogVisible.value = false
}

const onOpen = () => {
  menuFormRef.value.initForm(menu.value)
}

const saveMenuData = (data: any) => {
  if (!menu.value?.id) return ElMessage.error('请选择要修改的菜单')
  updateMenu(menu.value?.id, data).then((res) => {
    if (res.data.code === 200) {
      ElMessage.success('更新成功')
      close()
      emit('submit')
    } else {
      ElMessage.error('修改失败')
    }
  })
}

defineExpose({
  show,
  close,
})
</script>
