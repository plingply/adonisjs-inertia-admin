import vine from '@vinejs/vine'

export const CreateRoleValidator = vine.compile(
  vine.object({
    name: vine.string(),
    slug: vine.string(),
    permissions: vine.array(vine.string()),
  })
)

export const UpdateRoleValidator = vine.compile(
  vine.object({
    id: vine.number(),
    name: vine.string(),
    permissions: vine.array(vine.string()),
  })
)

export const DeleteRoleValidator = vine.compile(
  vine.object({
    id: vine.number(),
  })
)
