import axios from 'axios'
import {error, success} from '../utils'
import {getConfig} from '../config'

// 读取配置文件
const {tg_chat_id, tg_bot_token} = getConfig()
// 发送 Telegram 通知
export function sendTg({domain, message = ''}: {domain: string; message?: string}) {
  if (!tg_bot_token || !tg_chat_id) return

  const msg = message || `域名 ${domain} 可注册`
  const url = `https://api.telegram.org/bot${tg_bot_token}/sendMessage`
  const params = {
    chat_id: tg_chat_id,
    text: msg
  }

  axios
    .post(url, params)
    .then((response: {statusText: any}) => {
      success(`${msg}，Telegram 通知发送成功: ${response.statusText}`)
    })
    .catch((e: any) => {
      error(`发送 ${domain} Telegram 通知时出错:${e.message}`)
    })
}
