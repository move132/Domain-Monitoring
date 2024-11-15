import axios from 'axios'
import {log} from '../utils'
import {sendMail} from './mail'

// 发送 email 通知
export {sendMail}

// 发送 Bark 通知
export function sendBark({BARK_URL, domain, message = ''}: {BARK_URL: string; domain: string; message?: string}) {
  const msg = message || `域名 ${domain} 可注册通知`
  axios
    .get(`${BARK_URL}/${encodeURIComponent(msg)}?group=域名监听服务`)
    .then((response: {statusText: any}) => {
      log(`🍓 域名 ${domain} 可注册，Bark 通知发送成功: ${response.statusText}`)
    })
    .catch((error: any) => {
      log(`❌ 发送 ${domain} Bark 通知时出错: ${error.message}`)
    })
}

// 发送 Telegram 通知
export function sendTg({TG_CHAT_ID, TG_BOT_TOKEN, domain, message = ''}: {TG_CHAT_ID: string; TG_BOT_TOKEN: string; domain: string; message?: string}) {
  const msg = message || `域名 ${domain} 可注册通知`
  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`
  const params = {
    chat_id: TG_CHAT_ID,
    text: msg
  }

  axios
    .post(url, params)
    .then((response: {statusText: any}) => {
      log(`🍓 域名 ${domain} 可注册，Telegram 通知发送成功: ${response.statusText}`)
    })
    .catch((error: any) => {
      log(`❌ 发送 ${domain} Telegram 通知时出错:${error.message}`)
    })
}
