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
    </div>

    <el-table v-loading="loading" :data="list" border>
      <el-table-column prop="user_id" label="用户ID" width="70" />
      <el-table-column prop="user.name" label="用户名称" width="100" />
      <el-table-column prop="method" label="请求方法" width="90" />
      <el-table-column prop="ip" label="IP" width="100">
        <template #default="{ row }">
          <el-tag type="success">{{ row.ip }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="访问路径">
        <template #default="{ row }">
          <el-tag type="primary">{{ row.path }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="input" label="输入">
        <template #default="{ row }">
          <pre>{{ row.input }}</pre>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="170" />
      <el-table-column prop="updated_at" label="更新时间" width="170" />
    </el-table>
    <Pagination
      v-model:page="queryParams.page"
      v-model:limit="queryParams.limit"
      :total="total"
      m-t-16
      @pagination="getList"
    />
  </div>
</template>

<script setup lang="ts">
import Layout from '~/layout/layout.vue'
import { ref, defineProps } from 'vue'
import AdminOperationLog from '#models/admin_operation_log'
import { getOperationLogsPage } from '~/api/operation_logs'

defineOptions({ layout: Layout })
const props = defineProps<{
  list: AdminOperationLog[]
  total: number
}>()
const queryParams = ref({
  page: 1,
  limit: 10,
  search: '',
})
const total = ref(props.total)
const loading = ref(false)
const list = ref(props.list)
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
  getOperationLogsPage(queryParams.value)
    .then((res) => {
      list.value = res.data.data.item
      total.value = res.data.data.total
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<style lang="scss" scoped>
pre {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.42857143;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: auto;
}
</style>
