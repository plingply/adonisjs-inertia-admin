<template>
  <div bg-white p-20 v-loading="loading">
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

    <el-table v-loading="loading" :data="list" border>
      <el-table-column prop="id" label="ID" width="50"/>
      <el-table-column prop="name" label=" 名称" width="170"/>
      <el-table-column prop="slug" label="标识" width="170"/>
      <el-table-column prop="permissions" label="权限">
        <template #default="{ row }">
            <el-tag v-for="item in row.permissions" type="success" effect="dark" size="small" class="mr-5 mb-5">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="170" />
      <el-table-column prop="updated_at" label="更新时间" width="170" />
      <el-table-column prop="" label="操作" fixed="right" width="140">
        <template #default="{ row }">
            <el-button size="small" type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button size="small" type="danger">删除</el-button>
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

  <RoleEdit ref="roleEdit" :show.sync="showEdit" :role="currentRole" :permissions="permissions"/>
</template>

<script setup lang="ts">
import Layout from '~/layout/layout.vue'
import AdminRole from '#models/admin_role'
import { ref, defineProps } from 'vue'
import { getRolePage } from '~/api/role'
import RoleEdit from './role-edit.vue'
import AdminPermission from '#models/admin_permission'

defineOptions({ layout: Layout })
const props = defineProps<{
  permissions: AdminPermission[],
  roles: AdminRole[],
  total: number
}>()
const queryParams = ref({
  page: 1,
  limit: 10,
  search: '',
})
const total = ref(props.total)
const loading = ref(false)
const list = ref(props.roles)
const currentRole = ref<AdminRole | null>(null)
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
    getRolePage(queryParams.value)
    .then((res) => { 
        list.value = res.data.data.item
        total.value = res.data.data.total
    }).finally(() => {
        loading.value = false
    })
}

const openEdit = (row: AdminRole) => {
  showEdit.value = true
  currentRole.value = row
}
</script>
