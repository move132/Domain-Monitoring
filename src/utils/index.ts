import dayjs from 'dayjs'

export function log(message: string) {
  const date = new Date()
  const timezoneOffset = date.getTimezoneOffset() * 60000 // 将偏移量转换为毫秒
  const beijingTime = new Date(date.getTime() + timezoneOffset + 8 * 60 * 60000) // 东八区，加上8小时
  const formattedTime = dayjs(beijingTime).format('YYYY-MM-DD HH:mm:ss')
  console.log(`${formattedTime} ${message}`)
}
