import nodemailer from 'nodemailer'
import {error} from '../utils'
import {getConfig, type Mail} from '../config'

// 读取配置文件
const {smtp_server, smtp_port, smtp_username, smtp_password, recipient_email}: Mail = getConfig()

async function sendMail({domain, message = ''}: {domain: string; message?: string}) {
  if (!smtp_server || !smtp_port || !smtp_username || !smtp_password || !recipient_email) return

  const transporter = nodemailer.createTransport({
    host: smtp_server,
    port: smtp_port,
    secure: smtp_port === 465,
    auth: {
      user: smtp_username,
      pass: smtp_password
    }
  })

  const mailOptions = {
    from: smtp_username,
    to: recipient_email,
    subject: '域名状态变更提醒',
    html: generateEmailBody({domain, message})
  }
  try {
    await transporter.sendMail(mailOptions)
  } catch (e) {
    error(`${domain} 邮件发送失败：${e}`)
  }
}

function generateEmailBody({domain, message = ''}: {domain: string; message?: string}) {
  const domainName = domain || '未知域名'
  const body = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            :root {
              font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
              line-height: 1.5;
              font-weight: 400;

              color-scheme: light dark;
              color: rgba(255, 255, 255, 0.87);
              background-color: #242424;

              font-synthesis: none;
              text-rendering: optimizeLegibility;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            .email-container {
              background-color: #1a1a1a;
              color: #ffffff;
              padding: 20px;
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
            }

            .header {
              padding: 20px 0;
            }

            .header h1 {
              margin: 0;
              font-size: 22px;
            }

            .content {
              background-color: #2a2a2a;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              font-size: 14px;
            }

            .content p {
              margin: 10px 0;
              margin-bottom: 15px;
            }

            .domain-info {
              background-color: #333333;
              padding: 15px;
              border-radius: 4px;
              margin: 15px 0;
            }

            .domain-name {
              color: #ff6b6b;
              font-weight: bold;
            }

            .action-text {
              margin: 15px 0;
              line-height: 1.6;
            }

            .detection-time {
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #444444;
            }

            .detection-time p {
              margin: 5px 0;
              color: #888888;
            }

            .footer {
              padding: 15px;
              font-size: 14px;
              color: #666666;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
          <div class="header">
            <h1>域名状态变更提醒</h1>
          </div>
          
          <div class="content">
            <p>尊敬的用户，</p>
            <p>检测到以下域名状态发生了变化：</p>
            
            <div class="domain-info">
              <div class="domain-name">${domainName}</div>
            </div>
            
            <p class="action-text">
              该域名目前可以重新注册。如果您对这些域名感兴趣，请尽快采取相应的行动。
            </p>

            <div class="detection-time">
              <p>检测时间：${new Date().toLocaleString()}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>此邮件为系统自动发送，请勿直接回复</p>
          </div>
        </div>
    </body>
    </html>
  `
  return body
}

export {sendMail, generateEmailBody}
