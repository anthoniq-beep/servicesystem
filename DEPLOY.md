# 分离部署指南：Vercel (前端) + 绿联 NAS (后端)

本指南介绍如何将前端部署到 Vercel，并将后端和数据库通过 Docker 部署到绿联 NAS。

## 1. 前端部署 (Vercel)

Vercel 非常适合部署像本项目这样的 React 单页应用。

### 步骤：

1.  **推送到 Git**:
    *   将您的完整项目代码推送到 GitHub、GitLab 或 Bitbucket。

2.  **导入到 Vercel**:
    *   登录 [Vercel](https://vercel.com/)。
    *   点击 "Add New..." -> "Project"。
    *   选择您刚才推送的 Git 仓库。

3.  **配置构建**:
    *   **Root Directory (根目录)**: 点击 Edit，选择 `frontend` 目录。
    *   **Framework Preset**: 选择 `Vite`。
    *   **Environment Variables (环境变量)**:
        *   添加变量名: `VITE_API_URL`
        *   变量值: `http://your-nas-ip:3000` (如果您的 NAS 有公网 IP 或域名) 或者 `http://localhost:3000` (如果您只在局域网内使用)。
        *   *注意：如果要在公网访问，您需要为 NAS 配置 DDNS 和端口转发，或者使用内网穿透（如 Cloudflare Tunnel）。*

4.  **部署**:
    *   点击 "Deploy"。
    *   部署完成后，Vercel 会提供一个访问域名（例如 `https://sevicesystem.vercel.app`）。

5.  **记录域名**:
    *   复制这个 Vercel 域名，下一步配置后端时需要用到。

---

## 2. 后端部署 (绿联 NAS)

我们将使用 Docker Compose 在 NAS 上一键启动 MySQL 和后端 API。

### 前置条件：
*   绿联 NAS 已开启 Docker 功能。
*   您可以通过 SSH 连接到 NAS，或者使用 NAS 的文件管理功能上传文件。

### 步骤：

1.  **准备文件**:
    *   在 NAS 上创建一个文件夹，例如 `service-system`。
    *   将项目中的 `backend` 文件夹完整上传到该目录。
    *   将项目根目录下的 `docker-compose.yml` 上传到该目录。

    目录结构应如下：
    ```
    /service-system
      ├── docker-compose.yml
      └── backend/
          ├── Dockerfile
          ├── package.json
          ├── src/
          ├── prisma/
          └── ...
    ```

2.  **配置 Docker Compose**:
    *   打开 `docker-compose.yml` 文件。
    *   修改 `MYSQL_ROOT_PASSWORD` 为您想要的数据库密码（两处都要改：mysql 服务和 backend 服务的 DATABASE_URL）。
    *   修改 `FRONTEND_URL` 为您第一步获得的 Vercel 域名（例如 `https://sevicesystem.vercel.app`），这将允许跨域请求。

3.  **启动服务**:
    
    **方式 A: 使用 SSH (推荐)**
    *   SSH 连接到 NAS。
    *   进入目录: `cd /path/to/service-system`
    *   运行命令: 
        ```bash
        docker-compose up -d --build
        ```
    
    **方式 B: 使用绿联 Docker UI**
    *   如果绿联系统支持通过 UI 导入项目，选择 "创建项目" 或 "Docker Compose"，上传 `docker-compose.yml`。
    *   注意：如果 UI 不支持本地构建 (build)，您可能需要在本地电脑先构建好镜像推送到 Docker Hub，然后修改 docker-compose.yml 使用镜像而非 build。**推荐使用 SSH 方式**，因为配置了本地构建。

4.  **验证**:
    *   查看容器日志，确认 `service-system-api` 容器启动成功且没有报错。
    *   首次启动会自动运行数据库迁移，可能需要几秒钟。

## 3. 网络连通性说明

*   **局域网访问**:
    *   如果您的电脑和 NAS 在同一 WiFi 下，前端配置 `VITE_API_URL=http://NAS_IP:3000` 即可正常使用。
*   **公网访问**:
    *   如果您希望在外网访问（例如手机 4G），您需要将 NAS 的 `3000` 端口映射到公网（通过路由器端口转发），并将 `VITE_API_URL` 设置为公网 IP 或域名。
    *   **安全提示**: 公网暴露端口有风险，建议配置 HTTPS (Nginx 反向代理) 或使用 VPN/内网穿透。

## 4. 常见问题

*   **数据库连接失败**: 检查 `docker-compose.yml` 中的密码是否一致。
*   **CORS 错误**: 检查后端的 `FRONTEND_URL` 环境变量是否与您访问的前端域名完全一致（包括 https://）。
