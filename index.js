const whois = require('whois');
const axios = require('axios');
const fs = require('fs');
const toml = require('@iarna/toml');

// 读取配置文件
const config = getConfig();
const tlds = getTlds()
// 配置
const DOMAINS = config.domains || [];
const CHECK_INTERVAL = config.check_interval || 5 * 60 * 1000; // 每5分钟检查一次
const BARK_URL = config.bark_url || '';
const TG_BOT_TOKEN = config.tg_bot_token || '';
const TG_CHAT_ID = config.tg_chat_id || '';

let interval = null;
let MAX_SEND_COUNT = config.max_send_count || 5;


// 检查域名状态
async function checkDomains() {
  if (DOMAINS.length === 0) {
    console.log('没有要检查的域名');
    return;
  }
  for (const domain of DOMAINS) {
    try {
      whois.lookup(domain, (err, data) => {
        if (err) {
          console.error(`检查 ${domain} 时出错:`, err);
          return;
        }
        const suffix = domain.split('.').pop()
        const { statusMessage } = tlds.find(v => v.domainSuffix === suffix) || {}
        if (!statusMessage) {
          console.log(`tld不存在`);
          return
        }
        // console.log(data)
        if (data.includes(statusMessage)) {
          if (MAX_SEND_COUNT <= 0) {
            clearInterval(interval);
            return;
          }
          if (TG_BOT_TOKEN && TG_CHAT_ID) {
            sendTelegramNotification(domain)
          }
          if (BARK_URL) {
            sendBarkNotification(domain);
          }
          MAX_SEND_COUNT--;
        } else {
          console.log(`域名 ${domain} 不可注册`);
        }
      });
    } catch (error) {
      console.error(`检查 ${domain} 时出错:`, error);
    }
  }
}

function getTlds() {

  const tlds = fs.readFileSync('tld', 'utf8');
  // 按行分割文本
  const lines = tlds.split('\n');

  // 创建一个数组来存储结果
  const results = [];

  // 遍历每一行
  lines.forEach(line => {
    // 使用正则表达式匹配域名后缀、WHOIS 服务器和状态信息
    const match = line.match(/[^=]+/g);
    if (match) {
      // 提取域名后缀、WHOIS 服务器和状态信息
      const domainSuffix = match[0]; // 域名后缀
      const whoisServer = match[1];   // WHOIS 服务器
      const statusMessage = match[2]; // 状态信息
      results.push({ domainSuffix, whoisServer, statusMessage });
    }
  });
  return results
}


function getConfig() {
  try {
    // 读取 TOML 文件
    const fileContents = fs.readFileSync('config.toml', 'utf8');

    // 解析 TOML 内容
    const data = toml.parse(fileContents);

    console.log(data);
    return data
  } catch (e) {
    console.error(e);
  }
}
// 发送 Bark 通知
function sendBarkNotification(domain) {
  const message = `域名 ${domain} 可注册通知`;
  axios
    .get(`${BARK_URL}/${encodeURIComponent(message)}?grounp=域名监听服务`)
    .then((response) => {
      console.log(`Bark 通知发送成功: ${response.statusText}`);
    })
    .catch((error) => {
      console.error('发送 Bark 通知时出错:', error);
    });
}

// 发送 Telegram 通知
function sendTelegramNotification(domain) {
  const message = `域名 ${domain} 可注册通知`;
  const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
  const params = {
    chat_id: TG_CHAT_ID,
    text: message,
  };

  axios.post(url, params)
    .then((response) => {
      console.log(`Telegram 通知发送成功: ${response.statusText}`);
    })
    .catch((error) => {
      console.error('发送 Telegram 通知时出错:', error);
    });
}

// 定时检查
interval = setInterval(checkDomains, CHECK_INTERVAL);
checkDomains();