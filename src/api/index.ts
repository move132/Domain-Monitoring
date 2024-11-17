import axios from 'axios'
import {error, success, info} from 'src/utils'
import {getConfig} from '../config'
// 读取配置文件
const {dynadot_api_key} = getConfig()

export function getDynadotApi<T>(params: T) {
  const url = `https://api.dynadot.com/api3.json`
  return axios.get(url, {params})
}
// 注册域名
export async function registerDomain(domain: string) {
  try {
    // 查询账户余额
    info(`⚡️ 开始尝试注册：${domain}`)
    const {
      data: {GetAccountBalanceResponse, Response}
    } = await getDynadotApi({
      key: dynadot_api_key,
      command: 'get_account_balance'
    })
    if (Response) {
      info(`⚡️ Dynadot：${Response.Error}`)
      return
    }
    if (GetAccountBalanceResponse.ResponseCode !== 0) {
      info(`⚡️ 请检查您的 Dynadot 账户余额是否充足，${GetAccountBalanceResponse.Error}`)
      return
    }
    const {
      data: {RegisterResponse}
    } = await getDynadotApi({
      key: dynadot_api_key,
      command: 'register',
      domain,
      duration: '9',
      currency: 'CHY',
      premium: '1'
    })
    if (RegisterResponse.ResponseCode !== 0) {
      error(`注册失败, ${RegisterResponse.Error}`)
      return
    }
    success(`${domain} 注册成功，请赶紧去 dynadot.com 查看详情`)
    return true
  } catch (e: any) {
    error(`注册失败 ${e}`)
  }
}
