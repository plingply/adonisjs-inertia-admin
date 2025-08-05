<template>
  <el-dialog v-model="dialogVisible" title="编辑角色" width="800px" @open="onOpen">
    <el-form ref="formRef" label-width="80px" :rules="rules" :model="form">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="slug">
        <el-input v-model="form.slug"></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-transfer
          v-model="form.permissions"
          :data="permissions"
          style="width: 100%"
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
import { ref, defineEmits, computed, reactive } from 'vue'
import AdminPermission from '#models/admin_permission'
import { ElMessage } from 'element-plus'
import { updateRole, createRole } from '~/api/role'
const emit = defineEmits(['update:show', 'submit'])
const props = defineProps<{
  data: any
  permissions: AdminPermission[]
  show: boolean
}>()
const formRef = ref()
const rules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入标识', trigger: 'blur' }],
})

const dialogVisible = computed({
  get() {
    return props.show
  },
  set(val) {
    emit('update:show', val)
  },
})

const form = ref({
  id: 0,
  name: '',
  slug: '',
  permissions: [] as AdminPermission[],
})

const close = () => {
  dialogVisible.value = false
}

const onOpen = () => {
  if (!props.data) {
    form.value = {
      id: 0,
      name: '',
      slug: '',
      permissions: [] as AdminPermission[],
    }
    return
  }
  form.value.id = props.data.id
  form.value.name = props.data.name
  form.value.slug = props.data.slug
  form.value.permissions = props.data?.permissions.map((item: any) => item.id)
}

const saveRoleData = () => {
  if (!formRef.value) return
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    if (!form.value?.id) {
      const data = {
        name: form.value.name,
        slug: form.value.slug,
        permissions: form.value.permissions,
      }
      createRole(data).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success('创建成功')
          close()
          emit('submit')
        } else {
          ElMessage.error('创建失败')
        }
      })
    } else {
      updateRole(form.value).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success('更新成功')
          close()
          emit('submit')
        } else {
          ElMessage.error('修改失败')
        }
      })
    }
  })
}
</script>
