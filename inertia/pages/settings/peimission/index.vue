<template>
  <div bg-white p-20 v-loading="loading" min-h-500px>
    <div flex justify-between>
      <el-form inline :model="queryParams">
        <el-form-item prop="keyword">
          <el-input
            v-model="queryParams.search"
            placeholder="请输入名称查询"
            maxlength="50"
            @keydown.enter="searchFunc"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFunc">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="openAdd">新增</el-button>
      </div>
    </div>

    <el-table v-loading="loading" :data="list" border>
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="name" label="名称" width="170" />
      <el-table-column prop="slug" label="标识" width="170" />
      <el-table-column prop="http_path" label="路由">
        <template #default="{ row }">
          <div v-for="item in formartHttpPath(row.http_path)">
            <div m-y-4px>
              <template v-if="row.http_method">
                <template v-for="tag in row.http_method?.split(',')">
                  <el-tag size="mini" m-r-4px>{{ tag }}</el-tag>
                </template>
              </template>
              <el-tag v-else size="mini" m-r-4px>ANY</el-tag>
              <span>{{ item }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="170" />
      <el-table-column prop="updated_at" label="更新时间" width="170" />
      <el-table-column prop="" label="操作" fixed="right" width="140">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteRow(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="queryParams.page"
      v-model:limit="queryParams.limit"
      :total="total"
      m-t-16
      @pagination="getList"
    />
  </div>
  <PermissionsEdit v-model:show.sync="showEdit" :data="currentPermission" @submit="getList" />
</template>

<script setup lang="ts">
import Layout from '~/layout/layout.vue'
import { ref, defineProps } from 'vue'
import PermissionsEdit from './permission-edit.vue'
import type AdminPermission from '#models/system/admin_permission'
import { ElMessage, ElMessageBox } from 'element-plus'
import { delPermissionById, getPermissionPage } from '~/api/permission'

defineOptions({ layout: Layout })
const props = defineProps<{
  peimissions: AdminPermission[]
  total: number
}>()
const queryParams = ref({
  page: 1,
  limit: 10,
  search: '',
})
const total = ref(props.total)
const loading = ref(false)
const list = ref(props.peimissions)
const currentPermission = ref<AdminPermission | null>(null)
const showEdit = ref(false)
const reset = () => {
  queryParams.value.page = 1
  queryParams.value.search = ''
  getList()
}

const searchFunc = () => {
  queryParams.value.page = 1
  getList()
}
const getList = () => {
  loading.value = true
  getPermissionPage(queryParams.value)
    .then((res) => {
      list.value = res.data.data.item
      total.value = res.data.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

const openEdit = (row: AdminPermission) => {
  showEdit.value = true
  currentPermission.value = row
}

const deleteRow = async (id: number) => {
  ElMessageBox.confirm('是否确定删除权限?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    delPermissionById(id).then((res) => {
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        getList()
      } else {
        ElMessage.error('删除失败')
      }
    })
  })
}

const formartHttpPath = (path: string) => {
  if (!path) return ''
  path = path.replace(/\r/g, '')
  return path.split('\n')
}

const openAdd = () => {
  showEdit.value = true
  currentPermission.value = null
}
</script>
