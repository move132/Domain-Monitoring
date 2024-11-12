# Domain-Monitoring

Domain Monitoring

## config

```yaml
# 监听的域名
domains = [] 
# bark通知的url
bark_url = "" 
# 成功发送次数，超过此数则不再通知
max_send_count = 5 
# 检测间隔
check_interval = 120000 

#https://notify.xxxxx.com/ZWQUfXkN3yG25BsV6yVj4o/域名监控服务


```
## run
```
docker run --name=domain -itd -v $(pwd)/config.toml:/app/config.toml move132/domain-monitor
```

##  License

[MIT](LICENSE)