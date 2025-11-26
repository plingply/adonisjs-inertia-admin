import { DateTime } from 'luxon'
export function dateFormart(input: any, format = 'yyyy-MM-dd HH:mm:ss') {
  let dt

  if (!input) {
    return ''
  }

  // 1. 如果是 Luxon DateTime 对象
  if (input instanceof DateTime) {
    dt = input
  }
  // 2. 如果是 JavaScript Date 对象
  else if (input instanceof Date) {
    dt = DateTime.fromJSDate(input)
  }
  // 3. 如果是数字（毫秒或秒）
  else if (typeof input === 'number') {
    // 判断是秒还是毫秒（通常大于 1000000000000 的是毫秒）
    if (input > 1000000000000) {
      dt = DateTime.fromMillis(input)
    } else {
      dt = DateTime.fromSeconds(input)
    }
  }
  // 4. 如果是字符串
  else if (typeof input === 'string') {
    // 尝试解析 ISO 格式
    dt = DateTime.fromISO(input)

    // 如果 ISO 解析失败，尝试其他格式
    if (!dt.isValid) {
      dt = DateTime.fromSQL(input) // SQL 格式
    }
    if (!dt.isValid) {
      dt = DateTime.fromRFC2822(input) // RFC2822 格式
    }
    if (!dt.isValid) {
      // 尝试解析时间戳字符串
      const num = Number(input)
      if (!Number.isNaN(num)) {
        if (num > 1000000000000) {
          dt = DateTime.fromMillis(num)
        } else {
          dt = DateTime.fromSeconds(num)
        }
      }
    }
  }
  // 5. 其他类型
  else {
    dt = DateTime.fromJSDate(new Date(input))
  }

  // 检查是否有效
  if (!dt || !dt.isValid) {
    console.warn('Invalid date input:', input)
    return ''
  }

  return dt.toFormat(format)
}

export function capitalizeFirst(str: string) {
  if (!str || typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
