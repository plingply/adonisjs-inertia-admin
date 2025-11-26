<template>
  <div bg-white p-20px min-h-500px>
    <div text-16 border-b="1px solid #eee" p-b-10px>概览 <el-icon cursor-pointer @click="getQueueOverview"><Refresh /></el-icon></div>
    <div flex>
      <div w-200px m-r-10px border-r="1px solid #eee" p-t-20px>
        <div
          lh-32px
          cursor-pointer
          hover:bg="#029b46"
          hover:text-white
          p-x-10px
          m-b-10px
          :class="{ tabAcitve: active == 'overview' }"
          @click="tabClick('overview')"
        >
          概览
        </div>
        <template v-for="queue in queues" :key="queue.key">
          <div
            lh-32px
            cursor-pointer
            hover:bg="#029b46"
            m-b-10px
            :class="{ tabAcitve: active == queue.name }"
            hover:text-white
            p-x-10px
            @click="tabClick(queue.name)"
          >
            {{ queue.name }}
          </div>
        </template>
      </div>
      <div flex-1 p-t-20px>
        <div v-if="active == 'overview'">
          <el-table :data="queues" border>
            <el-table-column label="队列名称" prop="name"></el-table-column>
            <el-table-column label="总数" prop="jobs"></el-table-column>
            <el-table-column label="完成" prop="jobs_completed"></el-table-column>
            <el-table-column label="失败" prop="jobs_failed"></el-table-column>
            <el-table-column label="正在执行" prop="jobs_active"></el-table-column>
            <el-table-column label="等待执行" prop="jobs_waiting"></el-table-column>
          </el-table>
        </div>
        <div v-else v-loading="loading">
          <el-tabs v-model="status" type="card" @tab-click="handleClick">
            <el-tab-pane :label="formartTabCount('completed')" name="completed"></el-tab-pane>
            <el-tab-pane :label="formartTabCount('failed')" name="failed"></el-tab-pane>
            <el-tab-pane :label="formartTabCount('active')" name="active"></el-tab-pane>
            <!-- <el-tab-pane
              :label="formartTabCount('prioritized')"
              name="prioritized"
            ></el-tab-pane> -->
            <el-tab-pane :label="formartTabCount('wait')" name="wait"></el-tab-pane>
            <!-- <el-tab-pane :label="formartTabCount('delayed')" name="delayed"></el-tab-pane> -->
            <!-- <el-tab-pane :label="formartTabCount('paused')" name="paused"></el-tab-pane> -->
          </el-tabs>
          <el-table :data="jobs" border>
            <el-table-column label="KEY" prop="key"></el-table-column>
            <el-table-column label="任务名称" prop="name"></el-table-column>
            <el-table-column label="任务数据" prop="data">
              <template #default="{ row }">
                <el-tooltip placement="right" effect="light">
                  <template #content>
                    <pre>{{ JSON.parse(row.data) }}</pre>
                  </template>
                  <el-text type="primary">查看</el-text>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="返回值" prop="returnvalue"></el-table-column>
            <el-table-column label="选项" prop="opts">
              <template #default="{ row }">
                <el-tooltip placement="right" effect="light">
                  <template #content>
                    <pre>{{ JSON.parse(row.opts) }}</pre>
                  </template>
                  <el-text type="primary">查看</el-text>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="processedOn">
              <template #default="{ row }">
                {{ dateFormart(row.processedOn) }}
              </template>
            </el-table-column>
            <el-table-column label="结束时间" prop="finishedOn">
              <template #default="{ row }">
                {{ dateFormart(row.finishedOn) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template #default="{ row }">
                <el-button
                  v-if="status === 'failed'"
                  type="primary"
                  size="small"
                  @click="restart(row.key)"
                  >重新执行</el-button
                >
                <el-button type="danger" size="small" @click="deleteJob(row.key)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            v-model:page="page"
            :total="total"
            :limit="10"
            layout="prev, pager, next, total"
            m-t-16
            @pagination="pagination"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, nextTick, ref } from 'vue'
import { deleteJobByKey, getQueueJobs, getQueueOverview, jobRestart } from '~/api/queue'
import Layout from '~/layout/layout.vue'
import { capitalizeFirst, dateFormart } from '~/utils/util'
import { Refresh } from '@element-plus/icons-vue'
defineOptions({ layout: Layout })

const loading = ref(false)
const active = ref('overview')
const status = ref('completed')
const page = ref(1)
const jobs = ref([])
const queues = ref<any[]>([])

const tabClick = (name: string) => {
  page.value = 1
  active.value = name
  getJobs(name)
}

const formartTabCount = (name: string) => {
  const count = queues.value.find((item) => item.name == active.value)?.['jobs_' + name] || 0
  if (count > 0) {
    return `${capitalizeFirst(name)} (${count})`
  }
  // 首字母大写
  return capitalizeFirst(name)
}

const total = computed(() => {
  return queues.value.find((item) => item.name == active.value)?.['jobs_' + status.value] || 0
})

const queueOverview = () => {
  getQueueOverview().then((res) => {
    queues.value = res.data.data
  })
}

const getJobs = async (queueName: string) => {
  loading.value = true
  getQueueJobs(queueName, status.value, page.value)
    .then((res) => {
      jobs.value = res.data.data
    })
    .finally(() => {
      loading.value = false
    })
}

const handleClick = () => {
  page.value = 1
  nextTick(() => {
    getJobs(active.value)
  })
}

const pagination = (p: any) => {
  page.value = p.page
  getJobs(active.value)
};

const restart = (key: string) => {
  jobRestart(key).then((res) => {
    if (res.data.code == 200) {
      ElMessage.success('任务重新执行成功')
      queueOverview()
      getJobs(active.value)
    } else {
      ElMessage.error(res.data.message)
    }
  })
}

const deleteJob = (key: string) => {
  deleteJobByKey(key).then((res) => {
    if (res.data.code == 200) {
      ElMessage.success('任务删除成功')
      queueOverview()
      getJobs(active.value)
    } else {
      ElMessage.error(res.data.message)
    }
  })
}

queueOverview()
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

.tabAcitve {
  background: #029b46;
  color: white;
}
</style>
