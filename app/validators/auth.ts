import vine from '@vinejs/vine'

export const loguinValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string(),
    remember: vine.boolean().optional(),
  })
)
