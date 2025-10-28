import vine from '@vinejs/vine'

export const CreatePerimissionValidator = vine.compile(
  vine.object({
    permissions: vine
      .array(
        vine.object({
          http_method: vine.array(vine.string()),
          http_path: vine.string(),
        })
      )
      .optional(),
    name: vine.string(),
    slug: vine.string(),
  })
)

export const UpdatePerimissionValidator = vine.compile(
  vine.object({
    id: vine.number(),
    permissions: vine
      .array(
        vine.object({
          http_method: vine.array(vine.string()),
          http_path: vine.string(),
        })
      )
      .optional(),
    name: vine.string(),
  })
)

export const DeletePerimissionValidator = vine.compile(
  vine.object({
    id: vine.number(),
  })
)
