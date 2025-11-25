import vine from '@vinejs/vine'

export const CreateScheduleValidator = vine.compile(
  vine.object({
    name: vine.string(),
    command: vine.string(),
    description: vine.string().optional(),
    cron: vine.string(),
    group: vine.string(),
    args: vine.array(vine.string()).optional(),
    is_active: vine.boolean().optional(),
  })
)

export const UpdateScheduleValidator = vine.compile(
  vine.object({
    id: vine.number(),
    name: vine.string().optional(),
    command: vine.string().optional(),
    description: vine.string().optional(),
    cron: vine.string().optional(),
    group: vine.string().optional(),
    args: vine.array(vine.string()).optional(),
    is_active: vine.boolean().optional(),
  })
)

export const DeleteScheduleValidator = vine.compile(
  vine.object({
    id: vine.number(),
  })
)
