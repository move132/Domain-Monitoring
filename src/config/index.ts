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
} & Mail

export type Mail = {
  smtp_server: string
  smtp_port: number
  smtp_username: string
  smtp_password: string
  recipient_email: string
}
export function getConfig(): Config {
  try {
    const configPath = path.resolve(__dirname, '../config.toml')
    const fileContents: string = fs.readFileSync(configPath, 'utf8')
    const config: Config = toml.parse(fileContents) as unknown as Config
    console.log('✅ 启动成功o((>ω< ))o')
    console.log('🍊 初始化的配置')
    console.log(JSON.stringify(config, null, 2))
    return config
  } catch (e) {
    throw new Error('Failed to load configuration')
  }
}
