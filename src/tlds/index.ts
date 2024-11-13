import fs from 'fs'
import path from 'path'

export interface TldInfo {
  domainSuffix: string
  whoisServer: string
  statusMessage: string
}

export function getTlds(): TldInfo[] {
  const configPath = path.resolve(__dirname, '../tld')
  const tlds: string = fs.readFileSync(configPath, 'utf8')
  const lines: string[] = tlds.split('\n')
  const results: TldInfo[] = []

  lines.forEach((line) => {
    const match = line.match(/[^=]+/g)
    if (match) {
      const domainSuffix = match[0]
      const whoisServer = match[1]
      const statusMessage = match[2]
      results.push({domainSuffix, whoisServer, statusMessage})
    }
  })
  return results
}
