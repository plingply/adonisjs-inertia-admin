export interface ScheduleCreateReq {
  name: string
  command: string
  description?: string
  cron: string
  group: string
  args?: string[]
  is_active: boolean
}

export interface ScheduleUpdateReq {
  id: number
  name?: string
  command?: string
  description?: string
  cron?: string
  group?: string
  args?: string[]
  is_active?: boolean
}
