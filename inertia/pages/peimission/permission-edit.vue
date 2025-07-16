<template>
  <el-dialog v-model="dialogVisible" title="编辑权限" width="800px" @open="onOpen">
    <el-form ref="formRef" label-width="80px" :rules="rules" :model="form">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="slug">
        <el-input v-model="form.slug"></el-input>
      </el-form-item>
      <el-form-item label="方法">
        <el-select v-model="form.http_method" multiple>
          <el-option label="GET" value="GET"></el-option>
          <el-option label="POST" value="POST"></el-option>
          <el-option label="PUT" value="PUT"></el-option>
          <el-option label="DELETE" value="DELETE"></el-option>
          <el-option label="PATCH" value="PATCH"></el-option>
          <el-option label="OPTIONS" value="OPTIONS"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="路由">
        <el-input v-model="form.http_path" type="textarea" :rows="4"></el-input>
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
import { ElMessage } from 'element-plus'
import { updatePermission, createPermission } from '~/api/permission'
const emit = defineEmits(['update:show', 'submit'])
const props = defineProps<{
  data: any
  show: boolean
}>()
const formRef = ref()

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
  http_method: '',
  http_path: '',
})
const rules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入标识', trigger: 'blur' }],
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
      http_method: '',
      http_path: '',
    }
    return
  }
  form.value.id = props.data.id
  form.value.name = props.data.name
  form.value.slug = props.data.slug
  form.value.http_method = props.data.http_method.split(',')
  form.value.http_path = props.data.http_path
}

const saveRoleData = () => {
  if (!formRef.value) return
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    if (!form.value?.id) {
      createPermission(form.value).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success('更新成功')
          close()
          emit('submit')
        } else {
          ElMessage.error('修改失败')
        }
      })
    } else {
      updatePermission(form.value).then((res) => {
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
