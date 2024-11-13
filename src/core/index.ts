import whois from 'whois'
import {getConfig, type Config} from '../config'
import {getTlds, type TldInfo} from '../tlds'
import {sendBark, sendTg} from '../notify'
import {log} from '../utils'

// 读取配置文件
const config: Config = getConfig()
const tlds: TldInfo[] = getTlds()

// 配置
const DOMAINS: string[] = config.domains || []
const CHECK_INTERVAL: number = config.check_interval || 5 * 60 * 1000 // 每5分钟检查一次
const BARK_URL: string = config.bark_url || ''
const TG_BOT_TOKEN: string = config.tg_bot_token || ''
const TG_CHAT_ID: string = config.tg_chat_id || ''
let interval: number = null
let MAX_SEND_COUNT: number = config.max_send_count || 5
// 存储每个域名的通知次数
let domainNotifCounts: Record<string, number> = {}
// 检查域名状态
async function checkDomains() {
  // 正确的域名格式
  const regex = /^(?!\\-)(?:[a-zA-Z0-9-]{1,63}(?<!-))\.([a-zA-Z]{2,63})$/
  const domains = DOMAINS.filter((v) => regex.test(v))
  if (domains.length === 0) {
    log(`🍐 没有要监听的的域名`)
    process.exit(0)
  }
  for (const domain of domains) {
    try {
      whois.lookup(domain, (err: Error | null, data: string) => {
        if (err) {
          log(`❌ 检查 ${domain} 时出错: ${err}`)
          return
        }
        const suffix = domain.split('.').pop()
        const tldInfo = tlds.find((v) => v.domainSuffix === suffix)
        const statusMessage = tldInfo ? tldInfo.statusMessage : null
        if (!statusMessage) {
          log(`❌ ${domain}的TLD不存在`)
          return
        }
        if (data.includes(statusMessage)) {
          if (interval && domains.length === Object.keys(domainNotifCounts).length) {
            clearInterval(interval)
            return
          }
          // 检查该域名是否已经达到通知次数上限
          if (domainNotifCounts[domain] && domainNotifCounts[domain] > MAX_SEND_COUNT) {
            log(`🍊 域名 ${domain} 已达到最大通知次数`)
            return
          }
          if (BARK_URL) {
            sendBark({BARK_URL, domain})
          }
          if (TG_BOT_TOKEN && TG_CHAT_ID) {
            sendTg({TG_BOT_TOKEN, TG_CHAT_ID, domain})
          }
          // 更新通知次数
          if (domainNotifCounts[domain]) {
            domainNotifCounts[domain] = domainNotifCounts[domain] + 1
          } else {
            domainNotifCounts[domain] = 1
          }
        } else {
          log(`🍍 域名 ${domain} 不可注册`)
        }
      })
    } catch (error) {
      log(`❌ 检查 ${domain} 时出错: ${error}`)
    }
  }
}

export function main() {
  // 定时检查
  interval = setInterval(checkDomains, CHECK_INTERVAL)
  checkDomains()
}
