# StaticFile - 文件快捷分享平台

一个功能完整的静态文件快捷分享网站，支持文件上传、短链接生成、文件管理等功能。

## 功能特性

### 核心功能
- ✅ 文件上传：支持拖拽上传和点击选择文件
- ✅ 短链接生成：自动生成8-12字符的短链接
- ✅ 文件管理：查看、删除、搜索上传的文件
- ✅ 访问控制：支持设置访问密码和有效期
- ✅ 用户认证：完整的注册和登录系统
- ✅ 数据统计：文件数量、存储空间、下载次数统计

### 界面特性
- 🎨 现代简洁的UI设计
- 📱 响应式布局，支持桌面端和移动端
- 🌓 深色/浅色主题切换
- ✨ 流畅的动画和过渡效果
- 🔍 文件搜索功能

### 安全特性
- 🔒 JWT身份认证
- 🛡️ 文件类型和大小限制
- ⏰ 文件有效期管理
- 🚫 访问频率限制
- 🧹 定期清理过期文件

### 额外功能
- 📋 一键复制分享链接
- 📱 二维码生成与分享
- 👁️ 文件预览功能
- 🔐 访问密码保护

## 技术栈

### 后端
- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- Multer (文件上传)
- JWT (身份认证)
- QRCode (二维码生成)

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide Icons

## 项目结构

```
staticFile/
├── backend/              # 后端服务
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── middleware/   # 中间件
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由
│   │   ├── utils/        # 工具函数
│   │   └── server.ts     # 服务器入口
│   ├── uploads/          # 上传文件存储
│   ├── data/             # 数据库文件
│   └── package.json
├── frontend/             # 前端应用
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── context/      # 上下文
│   │   ├── pages/        # 页面
│   │   ├── types/        # 类型定义
│   │   ├── utils/        # 工具函数
│   │   └── main.tsx      # 应用入口
│   └── package.json
└── README.md
```

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖

#### 后端
```bash
cd backend
npm install
```

#### 前端
```bash
cd frontend
npm install
```

### 配置环境变量

复制后端环境变量示例文件：
```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，配置必要的参数：
```
PORT=3001
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600
ALLOWED_FILE_TYPES=image/*,video/*,audio/*,application/pdf,...
BASE_URL=http://localhost:3001
```

### 启动服务

#### 启动后端服务
```bash
cd backend
npm run dev
```

后端服务将在 http://localhost:3001 启动

#### 启动前端服务
```bash
cd frontend
npm run dev
```

前端服务将在 http://localhost:3000 启动

### 访问应用

打开浏览器访问 http://localhost:3000

首次使用需要注册账户。

## API 接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 文件接口
- `POST /api/files/upload` - 上传文件
- `GET /api/files` - 获取文件列表
- `GET /api/files/stats` - 获取统计数据
- `GET /api/files/:id` - 获取文件详情
- `PUT /api/files/:id` - 更新文件信息
- `DELETE /api/files/:id` - 删除文件

### 分享接口
- `GET /api/share/:shortLink` - 获取分享文件信息
- `GET /api/share/download/:shortLink` - 下载文件
- `GET /api/share/qrcode/:shortLink` - 生成二维码

## 配置说明

### 文件上传限制
- 默认最大文件大小：100MB
- 支持的文件类型：图片、视频、音频、PDF、Word、Excel、文本文件

### 文件有效期
- 可设置1-365天的有效期
- 留空表示永久有效
- 系统每天凌晨2点自动清理过期文件

### 安全配置
- JWT密钥：生产环境请修改为强密码
- 访问频率限制：每IP每15分钟最多100次请求
- 文件类型过滤：根据ALLOWED_FILE_TYPES配置

## 开发指南

### 后端开发
```bash
cd backend
npm run dev        # 开发模式（热重载）
npm run build      # 构建生产版本
npm start          # 启动生产版本
npm run lint       # 代码检查
npm run typecheck  # 类型检查
```

### 前端开发
```bash
cd frontend
npm run dev        # 开发模式（热重载）
npm run build      # 构建生产版本
npm run preview    # 预览生产版本
npm run lint       # 代码检查
```

## 部署建议

### 生产环境配置
1. 修改JWT_SECRET为强密码
2. 设置NODE_ENV=production
3. 配置正确的BASE_URL
4. 使用HTTPS
5. 配置反向代理（Nginx）
6. 设置文件备份策略

### Docker部署
（待添加Docker配置）

## 常见问题

### 文件上传失败
- 检查文件大小是否超过限制
- 确认文件类型是否被允许
- 查看后端日志获取详细错误信息

### 无法访问文件
- 确认文件是否已过期
- 检查是否需要输入访问密码
- 验证短链接是否正确

### 数据库问题
- 检查data目录权限
- 确认better-sqlite3正确安装
- 查看数据库文件是否存在

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交Issue
- 发送邮件

---

**StaticFile** - 让文件分享更简单、更安全！
