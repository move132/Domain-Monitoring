# Domain-Monitoring

域名监控服务：确保您不错过理想的域名

在数字时代，一个好的域名就像是一块黄金地产。但理想的域名往往一出现就被抢注，您是否担心错过注册完美域名的机会？

## configuration
       
**config.toml**

```toml

# 监听的域名
domains = [] 
# bark通知的url https://notify.xxxxx.com/ZWQUfXkN3yG25BsV6yVj4o/域名监控服务

bark_url = ""

# Telegram 通知
tg_bot_token = ""
tg_chat_id = ""

# 成功发送次数，超过此数则不再通知
max_send_count = 5 

# 检测间隔 5分钟 ( 5 * 60 * 1000 毫秒)
# 建议请设置大于1分钟的时间间隔，小于1分钟可能导致检测失败
check_interval = 300000 

```

## Use

```bash
# run
docker run --name=domain -itd -v $(pwd)/config.toml:/app/config.toml move132/domain-monitor

# log

docker logs <container-id> -f

```

当出现下图时，表示已经启动成功

![启动成功](1.png "可选标题")

## License

MIT

