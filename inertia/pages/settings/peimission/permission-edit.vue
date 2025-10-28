<template>
  <el-dialog v-model="dialogVisible" title="编辑权限" width="800px" @open="onOpen">
    <el-form ref="formRef" label-width="80px" :rules="rules" :model="form">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="标识" prop="slug">
        <el-input v-model="form.slug"></el-input>
      </el-form-item>
      <el-form-item label="资源" prop="permissions">
        <template v-for="(item, index) in form.permissions" :key="index">
          <el-row w-full m-b-10>
            <el-col :span="8" m-r-10>
              <el-select v-model="item.http_method" multiple>
                <el-option label="GET" value="GET"></el-option>
                <el-option label="POST" value="POST"></el-option>
                <el-option label="PUT" value="PUT"></el-option>
                <el-option label="DELETE" value="DELETE"></el-option>
                <el-option label="PATCH" value="PATCH"></el-option>
                <el-option label="OPTIONS" value="OPTIONS"></el-option>
              </el-select>
            </el-col>
            <el-col :span="14">
              <el-input v-model="item.http_path" placeholder="请输入路径"></el-input>
            </el-col>
            <el-col :span="1">
              <div flex items-center h-32>
                <el-icon class="w-16! text-16! text-center" @click="removeItem(index)">
                  <svg-icon icon-class="home" />
                </el-icon>
                <el-icon class="w-16! text-16! text-center" @click="addItem()">
                  <svg-icon icon-class="collapse" />
                </el-icon>
              </div>
            </el-col>
          </el-row>
        </template>
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
import { ElMessage, GAP } from 'element-plus'
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
  permissions: [
    {
      http_method: [],
      http_path: '',
    },
  ],
})
const rules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  slug: [{ required: true, message: '请输入标识', trigger: 'blur' }],
})

const removeItem = (index: number) => {
  form.value.permissions.splice(index, 1)
}

const addItem = () => {
  form.value.permissions.push({
    http_method: [],
    http_path: '',
  })
}
const close = () => {
  dialogVisible.value = false
}

const onOpen = () => {
  if (!props.data) {
    form.value = {
      id: 0,
      name: '',
      slug: '',
      permissions: [
        {
          http_method: [],
          http_path: '',
        },
      ],
    }
    return
  }
  form.value.id = props.data.id
  form.value.name = props.data.name
  form.value.slug = props.data.slug
  form.value.permissions = props.data.permissions
}

const saveRoleData = () => {
  if (!formRef.value) return
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    if (!form.value?.id) {
      const permissions = form.value.permissions.filter((item: any) => item.http_method && item.http_method.length && item.http_path)
      const data = {
        name: form.value.name,
        slug: form.value.slug,
        permissions: permissions,
      }
      createPermission(data).then((res) => {
        if (res.data.code === 200) {
          ElMessage.success('更新成功')
          close()
          emit('submit')
        } else {
          ElMessage.error('修改失败')
        }
      })
    } else {
      const permissions = form.value.permissions.filter((item: any) => item.http_method && item.http_method.length && item.http_path)
      const data = {
        id: form.value.id,
        name: form.value.name,
        permissions: permissions,
      }
      updatePermission(data).then((res) => {
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
