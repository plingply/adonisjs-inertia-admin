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
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column prop="restart_time" label="重启次数" />
      <el-table-column prop="pm_uptime" label="更新时间" width="180" />
      <el-table-column prop="" label="操作" fixed="right" width="140">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="restartPM2AppClick(row)">重启</el-button>
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
          <el-select
            v-model="queryParams.group"
            placeholder="请选择分组"
            clearable
            style="width: 150px"
          >
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
          <el-button plain @click="reset">重置</el-button>
          <el-button type="primary" @click="openAddNewSchedule">新增</el-button>
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
          <el-button type="primary" size="small" @click="executeNow(row)"
            >立即执行</el-button
          >
          <el-button type="primary" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 新增/编辑定时任务对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="scheduleFormRef"
        :model="currentSchedule"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="currentSchedule.name" />
        </el-form-item>
        <el-form-item label="指令" prop="command">
          <el-input v-model="currentSchedule.command" />
        </el-form-item>
        <el-form-item label="分组" prop="group">
          <el-select v-model="currentSchedule.group" style="width: 100%">
            <el-option
              v-for="item in groups"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间" prop="cron">
          <el-input v-model="currentSchedule.cron" placeholder="例如: 0 0 * * *" />
        </el-form-item>
        <el-form-item label="参数" prop="args">
          <el-input
            v-model="argsInput"
            type="textarea"
            placeholder="每行一个参数，例如:&#10;arg1&#10;arg2"
          />
        </el-form-item>
        <el-form-item label="状态" prop="is_active">
          <el-switch v-model="currentSchedule.is_active" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="currentSchedule.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import Layout from '~/layout/layout.vue'
import { ref, defineProps, reactive, computed, watch } from 'vue'
import type AdminScheduler from '#models/system/admin_scheduler'
import {
  delScheduleById,
  executeScheduleNow,
  getSchedulePage,
  refreshPM2List,
  restartPM2App,
  stopPM2App,
  updateSchedule,
  createSchedule,
} from '~/api/schedule'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

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

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'create' | 'update'>('create')
const scheduleFormRef = ref<FormInstance>()
const argsInput = ref('')

// 表单规则
const formRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  command: [{ required: true, message: '请输入指令', trigger: 'blur' }],
  group: [{ required: true, message: '请选择分组', trigger: 'change' }],
  cron: [{ required: true, message: '请输入执行时间', trigger: 'blur' }],
}

// 当前编辑的定时任务
const currentSchedule = reactive({
  id: 0,
  name: '',
  command: '',
  group: '',
  cron: '',
  args: [] as string[],
  is_active: true,
  description: '',
})

// 对话框标题
const dialogTitle = computed(() => {
  return dialogType.value === 'create' ? '新增定时任务' : '编辑定时任务'
})

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
  })
    .then((res) => {
      if (res.data.code === 200) {
        ElMessage.success('更新成功')
      } else {
        ElMessage.error('更新失败')
      }
    })
    .catch(() => {
      ElMessage.error('更新失败')
    })
}

const refreshPm2List = () => {
  refreshPM2List()
    .then((res) => {
      if (res.data.code === 200) {
        pm2List.value = res.data.data
        ElMessage.success('刷新成功')
      } else {
        ElMessage.error('刷新失败')
      }
    })
    .catch(() => {
      ElMessage.error('刷新失败')
    })
}

const restartPM2AppClick = (row: any) => {
  ElMessageBox.confirm('确定要重启吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    restartPM2App(row.name)
      .then((res) => {
        if (res.data.code === 200) {
          ElMessage.success('重启成功')
          refreshPm2List()
        } else {
          ElMessage.error('重启失败')
        }
      })
      .catch(() => {
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
    stopPM2App(row.name)
      .then((res) => {
        if (res.data.code === 200) {
          ElMessage.success('停止成功')
          refreshPm2List()
        } else {
          ElMessage.error('停止失败')
        }
      })
      .catch(() => {
        ElMessage.error('停止失败')
      })
  })
}

// 添加立即执行函数
const executeNow = (row: any) => {
  ElMessageBox.confirm(`确定要立即执行任务 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    executeScheduleNow(row.id)
      .then((res) => {
        if (res.data.code === 200) {
          ElMessage.success('任务已启动执行')
        } else {
          ElMessage.error('执行失败: ' + res.data.message)
        }
      })
      .catch((err) => {
        ElMessage.error('执行失败: ' + err.message)
      })
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除定时任务 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    delScheduleById(row.id)
    .then((res) => {
      if (res.data.code === 200) {
        ElMessage.success('删除成功')
        getList()
      } else {
        ElMessage.error('删除失败')
      }
    })
  }).catch(() => {

  })
}

const openEdit = (row: any) => {
  dialogType.value = 'update'
  Object.assign(currentSchedule, row)
  argsInput.value = row.args.join('\n')
  dialogVisible.value = true
}

const openAddNewSchedule = () => {
  dialogType.value = 'create'
  Object.assign(currentSchedule, {
    id: 0,
    name: '',
    command: '',
    group: '',
    cron: '',
    args: [],
    is_active: true,
    description: '',
  })
  argsInput.value = ''
  dialogVisible.value = true
}

const handleDialogClose = () => {
  scheduleFormRef.value?.resetFields()
}

// 提交表单
const submitForm = async () => {
  const valid = await scheduleFormRef.value?.validate()
  if (!valid) return

  // 处理参数输入
  currentSchedule.args = argsInput.value
    .split('\n')
    .map(arg => arg.trim())
    .filter(arg => arg.length > 0)

  loading.value = true
  try {
    let res
    if (dialogType.value === 'create') {
      res = await createSchedule(currentSchedule)
    } else {
      res = await updateSchedule(currentSchedule)
    }

    if (res.data.code === 200) {
      ElMessage.success(dialogType.value === 'create' ? '创建成功' : '更新成功')
      dialogVisible.value = false
      getList()
    } else {
      ElMessage.error(res.data.message || (dialogType.value === 'create' ? '创建失败' : '更新失败'))
    }
  } catch (err: any) {
    ElMessage.error(err.message || (dialogType.value === 'create' ? '创建失败' : '更新失败'))
  } finally {
    loading.value = false
  }
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
