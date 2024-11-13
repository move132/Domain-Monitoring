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

// 检查域名状态
async function checkDomains() {
	if (DOMAINS.length === 0) {
		log(`没有要监听的的域名`)
		process.exit(0)
	}
	for (const domain of DOMAINS) {
		try {
			whois.lookup(domain, (err: Error | null, data: string) => {
				if (err) {
					log(`检查 ${domain} 时出错: ${err}`)
					return
				}
				const suffix = domain.split('.').pop()
				const tldInfo = tlds.find((v) => v.domainSuffix === suffix)
				const statusMessage = tldInfo ? tldInfo.statusMessage : null
				if (!statusMessage) {
					log(`tld不存在`)
					return
				}
				if (data.includes(statusMessage)) {
					if (MAX_SEND_COUNT <= 0) {
						if (interval) {
							clearInterval(interval)
						}
						return
					}
					sendBark({BARK_URL, domain})
					sendTg({TG_BOT_TOKEN, TG_CHAT_ID, domain})
					MAX_SEND_COUNT--
				} else {
					log(`${new Date()}域名 ${domain} 不可注册`)
				}
			})
		} catch (error) {
			log(`检查 ${domain} 时出错: ${error}`)
		}
	}
}

export function main() {
	// 定时检查
	interval = setInterval(checkDomains, CHECK_INTERVAL)
	checkDomains()
}
