import {sendMail} from './mail'
import {sendBark} from './bark'
import {sendTg} from './telegram'

export async function notify(domain: string, message?: string) {
  await sendBark({domain, message})
  await sendTg({domain, message})
  await sendMail({domain, message})
}
