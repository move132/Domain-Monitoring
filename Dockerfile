# 使用多阶段构建
# 第一阶段：构建应用
FROM node:alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制应用代码
COPY . .

# 第二阶段：创建最终镜像
FROM node:alpine

# 设置工作目录
WORKDIR /app

# 从 builder 阶段复制 node_modules 和应用代码
COPY --from=builder /app .

# 暴露应用的端口（如果需要）
# EXPOSE 3000

# 运行应用
CMD ["node", "index.js"]
# docker run -v $(pwd)/config.json:/app/config.json domain-monitor

# docker build -t domain-monitor .

# https://notify.mxcscss.com/ZWds67544o/域名监听/内容内容内容内容内容?grounp=域名监听服务