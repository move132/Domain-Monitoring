import dayjs from 'dayjs'

export function getCurrentBeijingTime() {
  const date = new Date()
  const timezoneOffset = date.getTimezoneOffset() * 60000 // 将偏移量转换为毫秒
  const beijingTime = new Date(date.getTime() + timezoneOffset + 8 * 60 * 60000) // 东八区，加上8小时
  const formattedTime = dayjs(beijingTime).format('YYYY-MM-DD HH:mm:ss')
  return formattedTime
}
function logWithEmoji(emoji: string, message: string) {
  const time = getCurrentBeijingTime()
  console.log(`${time} ${emoji} ${message}`)
}
export function info(message: string) {
  logWithEmoji('', message)
}
export function log(message: string) {
  logWithEmoji(' 🍓', message)
}

export function success(message: string) {
  logWithEmoji(' ✅', message)
}

export function error(message: string) {
  logWithEmoji(' ❌', message)
}
