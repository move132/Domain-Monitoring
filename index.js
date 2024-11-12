const whois = require('whois');
const axios = require('axios');
const fs = require('fs');
const toml = require('@iarna/toml');

// 读取配置文件
const config = getConfig();

// 配置
const DOMAINS = config.domains || [];
const CHECK_INTERVAL = config.check_interval || 5 * 60 * 1000; // 每5分钟检查一次
const BARK_URL = config.bark_url || '';
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
        // console.log(data)
        if (data.includes('No entries found')) {
          if (MAX_SEND_COUNT <= 0) {
            clearInterval(interval);
            return;
          }
          sendBarkNotification(domain);
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

// 定时检查
interval = setInterval(checkDomains, CHECK_INTERVAL);
checkDomains();