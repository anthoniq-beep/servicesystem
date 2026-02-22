# 全栈部署指南：腾讯云轻量应用服务器 (Tencent Cloud Lighthouse)

本指南介绍如何将前端和后端同时部署到腾讯云轻量服务器上，并配置 Nginx 反向代理和 HTTPS。

## 1. 服务器准备

1.  **系统**: 推荐使用 `Ubuntu 20.04 LTS` 或 `CentOS 7.9`。
2.  **防火墙**: 在腾讯云控制台 -> 防火墙中，开放以下端口：
    *   `80` (HTTP)
    *   `443` (HTTPS)
    *   `22` (SSH)
    *   `3000` (后端API，可选，如果只通过 Nginx 转发则不需要开放)

## 2. 环境安装

连接到服务器 (SSH)，执行以下命令安装必要软件：

```bash
# Ubuntu
sudo apt update
sudo apt install -y nodejs npm nginx mysql-server git

# 安装 Node.js 18 (如果默认版本过低)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2 (进程管理)
sudo npm install -g pm2
```

## 3. 数据库配置 (MySQL)

```bash
# 登录 MySQL
sudo mysql

# 在 MySQL 命令行中执行：
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourStrongPassword';
CREATE DATABASE servicesystem;
FLUSH PRIVILEGES;
EXIT;
```

## 4. 代码部署

1.  **拉取代码**:
    ```bash
    cd /var/www
    sudo git clone https://github.com/anthoniq-beep/servicesystem.git
    sudo chown -R $USER:$USER servicesystem
    cd servicesystem
    ```

2.  **后端部署**:
    ```bash
    cd backend
    
    # 安装依赖
    npm install
    
    # 配置环境变量
    cp .env.example .env # 如果没有 example 就新建
    nano .env
    # 填入:
    # DATABASE_URL="mysql://root:YourStrongPassword@localhost:3306/servicesystem"
    # JWT_SECRET="your-secret"
    # FRONTEND_URL="http://your-domain.com" (或者 IP)
    # PORT=3000
    
    # 数据库迁移
    npx prisma migrate deploy
    npx prisma db seed (可选，初始化数据)
    
    # 构建
    npm run build
    
    # 启动
    pm2 start dist/main.js --name "backend-api"
    pm2 save
    ```

3.  **前端部署**:
    ```bash
    cd ../frontend
    
    # 配置环境变量
    nano .env
    # 填入: VITE_API_URL=http://your-domain.com/api (我们将在 Nginx 配置 /api 转发)
    # 或者直接填后端地址: http://your-server-ip:3000
    
    # 安装依赖并构建
    npm install
    npm run build
    
    # 此时会生成 dist 目录
    ```

## 5. Nginx 配置 (反向代理)

配置 Nginx 让前端和后端共用 80/443 端口，并解决跨域问题。

1.  **编辑配置**:
    ```bash
    sudo nano /etc/nginx/sites-available/servicesystem
    ```

2.  **填入内容**:
    ```nginx
    server {
        listen 80;
        server_name your-domain.com; # 替换为您的域名或公网IP

        # 前端静态文件
        location / {
            root /var/www/servicesystem/frontend/dist;
            index index.html;
            try_files $uri $uri/ /index.html;
        }

        # 后端 API 转发
        location /api/ {
            proxy_pass http://localhost:3000/; # 注意末尾斜杠，去除 /api 前缀
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **启用配置**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/servicesystem /etc/nginx/sites-enabled/
    sudo nginx -t # 检查语法
    sudo systemctl restart nginx
    ```

## 6. 数据备份策略 (备份到 NAS)

为了满足您的安全需求，我们可以编写一个脚本，每天将数据库备份并通过 SCP/FTP 传送到您的绿联 NAS。

1.  **创建备份脚本**: `backup_to_nas.sh`
    ```bash
    #!/bin/bash
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_DIR="/var/backups/mysql"
    FILENAME="db_backup_$TIMESTAMP.sql"
    
    # 1. 导出数据库
    mysqldump -u root -p'YourStrongPassword' servicesystem > $BACKUP_DIR/$FILENAME
    
    # 2. 传输到 NAS (假设 NAS 开了 SSH/SFTP)
    # 需要先配置 SSH Key 免密登录
    scp $BACKUP_DIR/$FILENAME user@nas-ip:/volume1/backups/
    
    # 3. 清理旧备份 (保留7天)
    find $BACKUP_DIR -type f -mtime +7 -name "*.sql" -delete
    ```

2.  **设置定时任务**:
    ```bash
    crontab -e
    # 每天凌晨 3 点执行
    0 3 * * * /bin/bash /path/to/backup_to_nas.sh
    ```
