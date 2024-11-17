import axios from 'axios'
import {error, success} from '../utils'
import {getConfig} from '../config'
// 读取配置文件
const {bark_url} = getConfig()

// 发送 Bark 通知
export function sendBark({domain, message = ''}: {domain: string; message?: string}) {
  if (!bark_url) return

  const msg = message || `域名 ${domain} 可注册`
  axios
    .get(`${bark_url}/${encodeURIComponent(msg)}?group=域名监听服务`)
    .then((response: {statusText: any}) => {
      success(`${msg}，Bark 通知发送成功: ${response.statusText}`)
    })
    .catch((e: any) => {
      error(`发送 ${domain} Bark 通知时出错: ${e.message}`)
    })
}
