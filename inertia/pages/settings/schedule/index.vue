<template>
  <div bg-white p-20 v-loading="loading" min-h-500px>
    <div flex justify-between m-b-10px>
      <span>PM2进程</span>
      <el-icon cursor-pointer @click="refreshPm2List"><Refresh /></el-icon>
    </div>
    <el-table :data="pm2List" border m-b-20px>
      <el-table-column prop="pid" label="PID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="memory" label="内存" />
      <el-table-column prop="cpu" label="CPU" />
      <el-table-column prop="instances" label="实例" />
      <el-table-column prop="created_at" label="创建时间" width="180"/>
      <el-table-column prop="restart_time" label="重启次数" />
      <el-table-column prop="pm_uptime" label="更新时间" width="180"/>
      <el-table-column prop="" label="操作" fixed="right" width="140">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="restartPM2AppClick(row)"
            >重启</el-button
          >
          <el-button type="primary" size="small" @click="stopPM2AppClick(row)">停止</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div m-b-10px>定时任务</div>
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
        <el-form-item prop="group">
          <el-select v-model="queryParams.group" placeholder="请选择分组" clearable style="width: 150px">
            <el-option
              v-for="item in groups"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFunc">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :data="list" border>
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="command" label="指令" />
      <el-table-column prop="group" label="分组">
        <template #default="{ row }">
          {{ groups.find((item) => item.id === row.group)?.name || '默认' }}
        </template>
      </el-table-column>
      <el-table-column prop="args" label="参数">
        <template #default="{ row }">
          {{ row.args.join('\n') }}
        </template>
      </el-table-column>
      <el-table-column prop="cron" label="执行时间"></el-table-column>
      <el-table-column prop="is_active" label="状态">
        <template #default="{ row }">
          <el-switch v-model="row.is_active" @change="isActiveChange($event, row)" />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
        <template #default="{ row }">
          <el-text class="w-150px" truncated>
            {{ row.description }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="updated_at" label="更新时间" width="170" />
      <el-table-column prop="" label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="() => $emit('edit', row)"
            >立即执行</el-button
          >
          <el-button type="primary" size="small" @click="() => $emit('edit', row)">编辑</el-button>
          <el-button type="danger" size="small" @click="() => $emit('delete', row)">删除</el-button>
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
</template>

<script setup lang="ts">
import Layout from '~/layout/layout.vue'
import { ref, defineProps } from 'vue'
import type AdminScheduler from '#models/system/admin_scheduler'
import { getSchedulePage, refreshPM2List, restartPM2App, stopPM2App, updateSchedule } from '~/api/schedule'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

defineOptions({ layout: Layout })
const props = defineProps<{
  list: AdminScheduler[]
  total: number
  groups: any[]
  search?: string
  group?: string
  apps: any[]
  pm2List: any[]
}>()

const pm2List = ref(props.pm2List)
const queryParams = ref({
  page: 1,
  limit: 10,
  search: props.search || '',
  group: '',
})
const total = ref(props.total)
const loading = ref(false)
const list = ref(props.list)
const reset = () => {
  queryParams.value.page = 1
  queryParams.value.search = ''
  queryParams.value.group = ''
  getList()
}

const searchFunc = () => {
  queryParams.value.page = 1
  getList()
}
const getList = () => {
  loading.value = true
  getSchedulePage(queryParams.value)
    .then((res) => {
      list.value = res.data.data.item
      total.value = res.data.data.total
    })
    .finally(() => {
      loading.value = false
    })
}

const isActiveChange = (e: boolean, row: any) => {
  updateSchedule({
    id: row.id,
    is_active: e,
  }).then(res=>{
    if(res.data.code === 200){
      ElMessage.success('更新成功')
    }else{
      ElMessage.error('更新失败')
    }
  }).catch(()=>{
    ElMessage.error('更新失败')
  })
}

const refreshPm2List = () => {
  refreshPM2List()
  .then(res=>{
    if(res.data.code === 200) {
      pm2List.value = res.data.data
      ElMessage.success('刷新成功')
    } else {
      ElMessage.error('刷新失败')
    }
  }).catch(()=>{
    ElMessage.error('刷新失败')
  })
}

const restartPM2AppClick = (row: any) => {
  ElMessageBox.confirm('确定要重启吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    restartPM2App(row.name).then(res=>{
      if(res.data.code === 200){
        ElMessage.success('重启成功')
        refreshPm2List()
      }else{
        ElMessage.error('重启失败')
      }
    }).catch(()=>{
      ElMessage.error('重启失败')
    })
  })
}

const stopPM2AppClick = (row: any) => {
  ElMessageBox.confirm('确定要停止吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    stopPM2App(row.name).then(res=>{
      if(res.data.code === 200){
        ElMessage.success('停止成功')
        refreshPm2List()
      }else{
        ElMessage.error('停止失败')
      }
    }).catch(()=>{
      ElMessage.error('停止失败')
    })
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
