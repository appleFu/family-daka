# 🌟 全家好习惯打卡 App — Cloudflare 全球全托管版

本目录是专为 **Cloudflare Pages + Cloudflare KV** 设计的一键部署包：
- **真正的零服务器（Zero Server）**：无需买任何服务器、无需运行 `node server.js`。
- **无需等待任何审批**：Cloudflare KV 即开即用，秒级创建。
- **终身免费**：Cloudflare Pages 免费无限流量，KV 每日免费 10 万次读取。
- **全端 PWA 原生质感**：支持 iPhone / iPad Safari「添加到主屏幕」，全屏运行无浏览器边框。
- **全家实时双向同步**：爸爸、妈妈、孩子多端打卡实时刷新。

---

## 🚀 部署只需 3 步（耗时约 2 分钟）

### 第一步：在 Cloudflare 创建 KV 数据库（秒建）
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)；
2. 在左侧菜单点击 **Storage & Databases（存储与数据库）** -> **KV**；
3. 点击 **Create Namespace（创建命名空间）**：
   - Namespace Name（名称）填入：`FAMILY_DAKA`
   - 点击 **Add（添加）** 保存。

---

### 第二步：上传项目到 Cloudflare Pages
1. 在左侧菜单点击 **Compute (Workers) -> Workers & Pages**；
2. 点击 **Create application（创建应用程序）** -> 切换到 **Pages** 选项卡；
3. 选择 **Upload assets（上传资源）**；
4. 给项目起个名字（例如 `fute-clockin`）；
5. 点击上传区域，将本地电脑上的 **`3-package-cloudflare` 整个文件夹** 直接拖拽或选中上传；
6. 点击 **Deploy site（部署站点）**。

---

### 第三步：绑定 KV 数据库变量（最关键一步）
站点首次上传后，需要告诉 Cloudflare Pages 使用哪一个 KV 数据库：
1. 在刚创建的 Pages 项目页面，点击顶部的 **Settings（设置）** 选项卡；
2. 在左侧栏点击 **Functions（函数）**；
3. 向下滚动找到 **KV namespace bindings（KV 命名空间绑定）**，点击 **Add binding（添加绑定）**：
   - **Variable name（变量名）**：必须精准填入 `DAKA_KV`
   - **KV namespace（KV 命名空间）**：下拉选择刚才创建的 `FAMILY_DAKA`
4. 点击 **Save（保存）**。
5. 切换回 **Deployments（部署）** 选项卡，在最新的部署右侧点击三点图标选择 **Retry deployment（重新部署）** 即可生效！

---

## 📱 手机端使用指南（iPhone / iPad）

1. 用 iPhone 自带的 **Safari 浏览器** 打开 Cloudflare 提供的网址（例如 `https://fute-clockin.pages.dev`）；
2. 点击 Safari 底部的 **分享按钮**（向上箭头的方框）；
3. 向下滑动选择 **【添加到主屏幕】**（Add to Home Screen）；
4. 手机桌面上会生成专属的 **「好习惯打卡」高清 App 图标**，全屏启动，操作体验与原生 App 完全一致！

---

## 🌐 关于中国大陆境内免 VPN 访问（最佳实践）

* Cloudflare 默认赠送的 `xxx.pages.dev` 二级域名在部分国内运营商（尤其是移动/电信）偶有不稳定。
* **终极建议**：
  在 Cloudflare Pages 项目的 **Custom domains（自定义域名）** 选项卡中，绑定一个您自己的域名（例如 `daka.yourdomain.com`）。绑定后，国内网络无需 VPN 即可稳定访问！
