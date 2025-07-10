<template>
  <el-dialog v-model="dialogVisible" title="编辑角色" width="800px" @open="onOpen">
    <el-form ref="roleFormRef" label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="roleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="标识">
        <el-input v-model="roleForm.slug"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-transfer
          v-model="roleForm.permissions"
          :data="permissions"
          style="width: 100%;"
          :titles="['待选权限', '已选权限']"
          :props="{
            key: 'id',
            label: 'name',
          }"
        />
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="saveRoleData">提交</el-button>
        <el-button type="default" plain @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed } from 'vue'
import AdminPermission from '#models/admin_permission';
import { ElMessage } from 'element-plus';
import { updateRole } from '~/api/role';
const emit = defineEmits(['update:show', 'submit'])
const props = defineProps<{
  role: any
  permissions: AdminPermission[]
  show: boolean
}>()
const roleFormRef = ref()

const dialogVisible = computed({
  get() {
    return props.show
  },
  set(val) {
    emit('update:show', val)
  },
})
const roleForm = ref({
  id: 0,
  name: '',
  slug: '',
  permissions: [],
})

const close = () => {
  dialogVisible.value = false
}

const onOpen = () => {
  roleForm.value.id = props.role.id
  roleForm.value.name = props.role.name
  roleForm.value.slug = props.role.slug
  roleForm.value.permissions = props.role.permissions.map((item: any) => item.id)
}

const saveRoleData = () => {
  if (!roleForm.value?.id) return ElMessage.error('请选择要修改的菜单')
  updateRole(roleForm.value).then((res) => {
    if (res.data.code === 200) {
      ElMessage.success('更新成功')
      close()
      emit('submit')
    } else {
      ElMessage.error('修改失败')
    }
  })
}
</script>
