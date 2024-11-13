import fs from 'fs'
import path from 'path'
import toml from '@iarna/toml'

export type Config = {
	domains: string[]
	check_interval: number
	bark_url: string
	tg_bot_token: string
	tg_chat_id: string
	max_send_count: number
}

export function getConfig(): Config {
	try {
		const configPath = path.resolve(__dirname, '../../config.toml')
		const fileContents: string = fs.readFileSync(configPath, 'utf8')
		const config: Config = toml.parse(fileContents) as unknown as Config
		console.log('🍊初始化的配置o((>ω< ))o:\n')
		console.log(JSON.stringify(config, null, 2))
		return config
	} catch (e) {
		console.error(e)
		throw new Error('Failed to load configuration')
	}
}
