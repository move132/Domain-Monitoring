import dayjs from 'dayjs'

export function log(message: string) {
	const formattedTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
	console.log(`${formattedTime} ${message}`)
}
