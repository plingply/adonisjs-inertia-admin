import vine from '@vinejs/vine'

export const CreateMenuValidator = vine.compile(
  vine.object({
    title: vine.string(),
    icon: vine.string(),
    order: vine.number(),
    parent_id: vine.number(),
    permission: vine.string().optional(),
    roles: vine.array(vine.string()).optional(),
    uri: vine.string(),
  })
)

export const UpdateMenuValidator = vine.compile(
  vine.object({
    id: vine.number(),
    title: vine.string(),
    icon: vine.string(),
    order: vine.number(),
    parent_id: vine.number(),
    permission: vine.string().optional(),
    roles: vine.array(vine.string()).optional(),
    uri: vine.string(),
  })
)

export const DeleteMenuValidator = vine.compile(
  vine.object({
    id: vine.number(),
  })
)
