import fs from 'fs'
import path from 'path'
import toml from '@iarna/toml'
import {info} from '../utils'
let isInit = false

export type Config = {
  domains: string[]
  check_interval: number
  max_send_count: number
} & BarkConfig &
  TelegramConfig &
  DynadotConfig &
  Mail

export type BarkConfig = {
  bark_url: string
}

export type TelegramConfig = {
  tg_bot_token: string
  tg_chat_id: string
}

export type DynadotConfig = {
  auto_register: boolean
  dynadot_api_key: string
}

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
    if (!isInit) {
      info('====================================================')
      info('https://github.com/move132/Domain-Monitoring')
      info('====================================================')
      info('✅ 启动成功o((>ω< ))o')
      info('🍊 初始化的配置')
      console.log(JSON.stringify(config, null, 2))
      isInit = true
    }
    return config
  } catch (e) {
    throw new Error('Failed to load configuration')
  }
}
