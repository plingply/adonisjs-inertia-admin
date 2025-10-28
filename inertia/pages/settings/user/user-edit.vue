<template>
  <el-dialog v-model="dialogVisible" title="编辑用户" width="800px" @open="onOpen">
    <el-form ref="ruleFormRef" label-width="80px" :model="form" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="form.roles" placeholder="请选择角色" multiple>
          <el-option v-for="item in roles" :key="item.slug" :label="item.name" :value="item.slug" />
        </el-select>
      </el-form-item>
      <el-form-item label="权限">
        <el-select v-model="form.permissions" placeholder="请选择权限" multiple>
          <el-option
            v-for="item in permissions"
            :key="item.slug"
            :label="item.name"
            :value="item.slug"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="saveRoleData(ruleFormRef)">提交</el-button>
        <el-button type="default" plain @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits, computed, reactive } from 'vue'
import type AdminPermission from '#models/system/admin_permission'
import type AdminRole from '#models/system/admin_role'
import { ElMessage, FormInstance } from 'element-plus'
import { createUser, updateUser } from '~/api/user'
const emit = defineEmits(['update:show', 'submit'])
const props = defineProps<{
  data: any
  roles: AdminRole[]
  permissions: AdminPermission[]
  show: boolean
}>()
const ruleFormRef = ref<FormInstance>()
const rules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [] as any,
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
  username: '',
  password: '',
  phone: '',
  roles: [] as string[],
  permissions: [] as string[],
})

const close = () => {
  dialogVisible.value = false
}

const onOpen = () => {
  if (!props.data) {
    form.value = {
      id: 0,
      name: '',
      username: '',
      password: '',
      phone: '',
      roles: [] as string[],
      permissions: [] as string[],
    }
    rules.password.push({ required: true, message: '请输入密码', trigger: 'blur' })
    return
  }
  form.value.id = props.data.id
  form.value.name = props.data.name
  form.value.username = props.data.username
  form.value.phone = props.data.phone
  form.value.password = props.data.password
  form.value.roles = props.data?.roles.map((item: any) => item.slug)
  form.value.permissions = props.data?.permissions.map((item: any) => item.slug)
}

const saveRoleData = (formRef: FormInstance | undefined) => {
  if (!formRef) return
  formRef.validate((valid: boolean) => {
    if (!valid) return
    if (!form.value?.id) {
      const data = {
        name: form.value.name,
        username: form.value.username,
        password: form.value.password,
        phone: form.value.phone,
        roles: form.value.roles,
        permissions: form.value.permissions,
      }
      createUser(data).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success('创建成功')
          close()
          emit('submit')
        } else {
          ElMessage.error('创建失败')
        }
      })
    } else {
      updateUser(form.value).then((res) => {
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
