# 第一阶段：构建应用
FROM node:alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 安装 tsup 依赖
RUN npm install tsup

# 复制应用代码
#COPY . .
COPY src ./src
COPY tsup.config.ts ./
COPY config.toml ./
COPY tld ./
COPY tsconfig.json ./
COPY global.d.ts ./

# 打包应用
RUN npm run tsup

# 构建第二阶段所需的基础镜像
FROM node:alpine

# 设置工作目录
WORKDIR /app

# 从 builder 阶段复制 dist 目录和应用代码
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/config.toml /app/config.toml
COPY --from=builder /app/tld /app/tld
COPY --from=builder /app/package*.json ./
RUN npm install --production

# 暴露应用的端口（如果需要）
# EXPOSE 3000

# 运行应用
CMD ["node", "/app/dist/index.cjs"]
# docker run --name=domain -itd -v $(pwd)/config.toml:/app/config.toml domain-monitor

# docker build -t domain-monitor .
