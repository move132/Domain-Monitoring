import whois from 'whois'
import {getConfig, type Config} from '../config'
import {getTlds, type TldInfo} from '../tlds'
import {notify} from '../notify'
import {log, success, error, info} from '../utils'
import {registerDomain} from '../api'

// 读取配置文件
const config: Config = getConfig()
const tlds: TldInfo[] = getTlds()

// 配置
const AUTO_REGISTER = config.auto_register // 是否开启自动注册
const DYNADOT_API_KEY = config.dynadot_api_key // dynadot_api_key
const DOMAINS = config.domains || []
const CHECK_INTERVAL: number = config.check_interval || 5 * 60 * 1000 // 每5分钟检查一次
let MAX_SEND_COUNT: number = config.max_send_count || 5 // 通知成功发送次数，超过此数则不再通知

// 存储每个域名的通知次数
let domainNotifCounts: Record<string, number> = {}
let interval: number = null

// 检查域名状态
async function checkDomains() {
  // 正确的域名格式
  const regex = /^(?!\\-)(?:[a-zA-Z0-9-]{1,63}(?<!-))\.([a-zA-Z]{2,63})$/
  const domains = DOMAINS.filter((v) => regex.test(v))
  if (domains.length === 0) {
    info(`🍋 没有要监听的的域名`)
    info(`🍋 退出监控服务`)
    process.exit(0)
  }
  for (const domain of domains) {
    try {
      whois.lookup(domain, async (err: Error | null, data: string) => {
        if (err) {
          error(`检查 ${domain} 时出错: ${err}`)
          return
        }
        const suffix = domain.split('.').pop()
        const tldInfo = tlds.find((v) => v.domainSuffix === suffix)
        const statusMessage = tldInfo ? tldInfo.statusMessage : null
        if (!statusMessage) {
          error(`${domain}，不支持此域名后缀`)
          return
        }
        if (!data.includes(statusMessage)) {
          log(`域名 ${domain} 不可注册`)
          return
        }
        if (interval && domains.length === Object.keys(domainNotifCounts).length) {
          clearInterval(interval)
          success(`🎉 所有域名都已可注册，退出监控服务`)
          return
        }
        success(`${domain} 可注册`)
        sendNotify(domain)

        if (AUTO_REGISTER && DYNADOT_API_KEY) {
          const res = await registerDomain(domain)
          res && info(`🍊 ${JSON.stringify(res)}`)
        }
      })
    } catch (e) {
      error(`检查 ${domain} 时出错: ${e}`)
    }
  }
}

async function sendNotify(domain: string) {
  // 检查该域名是否已经达到通知次数上限
  if (domainNotifCounts[domain] && domainNotifCounts[domain] > MAX_SEND_COUNT) {
    info(`🍊 域名 ${domain} 已达到最大通知次数`)
    return
  }
  // 发送通知
  await notify(domain)

  // 更新通知次数
  domainNotifCounts[domain] = domainNotifCounts[domain] ? domainNotifCounts[domain] + 1 : 1
}

export function main() {
  if (CHECK_INTERVAL > 0 && CHECK_INTERVAL < 10 * 1000) {
    log(`❌ 时间间隔太短，请设置大于10秒的时间间隔`)
    log(`❌ 已经退出监控服务`)
    process.exit(0)
  }
  // 定时检查
  interval = setInterval(checkDomains, CHECK_INTERVAL)
  checkDomains()
}
