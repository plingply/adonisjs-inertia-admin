import vine from '@vinejs/vine'

export const CreateUserValidator = vine.compile(
  vine.object({
    username: vine.string(),
    name: vine.string(),
    password: vine.string(),
    phone: vine.string().optional(),
    roles: vine.array(vine.string()).optional(),
    permissions: vine.array(vine.string()).optional(),
  })
)

export const UpdateUserValidator = vine.compile(
  vine.object({
    id: vine.number(),
    username: vine.string(),
    password: vine.string().optional(),
    phone: vine.string().optional(),
    roles: vine.array(vine.string()).optional(),
    permissions: vine.array(vine.string()).optional(),
  })
)

export const DeleteUserValidator = vine.compile(
  vine.object({
    id: vine.number(),
  })
)
