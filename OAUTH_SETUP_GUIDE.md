# 🔐 OAuth登录配置指南

本指南将帮助您为梦境之书配置Google和GitHub第三方登录功能。

## 🎯 配置概览

OAuth登录需要在相应平台创建应用程序，并获取客户端ID和密钥。配置完成后，用户可以使用已有的Google或GitHub账户一键登录。

## 🚀 Google OAuth配置

### 1. 创建Google Cloud项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 登录您的Google账户
3. 创建新项目或选择现有项目

### 2. 启用必要的API

1. 在侧边栏选择 "API和服务" > "库"
2. 搜索并启用以下API：
   - Google+ API
   - Google Identity API

### 3. 配置OAuth同意屏幕

1. 转到 "API和服务" > "OAuth同意屏幕"
2. 选择用户类型：
   - **外部**: 适用于公开发布的应用
   - **内部**: 仅限组织内部用户
3. 填写应用信息：
   ```
   应用名称: 梦境之书
   用户支持电子邮件: your-email@gmail.com
   应用首页: https://yourdomain.com
   隐私政策链接: https://yourdomain.com/privacy
   服务条款链接: https://yourdomain.com/terms
   ```
4. 添加授权域名：
   ```
   yourdomain.com
   vercel.app (如果使用Vercel部署)
   ```
5. 保存并继续

### 4. 创建OAuth 2.0客户端ID

1. 转到 "API和服务" > "凭据"
2. 点击 "创建凭据" > "OAuth 2.0客户端ID"
3. 选择应用类型：**Web应用程序**
4. 配置客户端：
   ```
   名称: 梦境之书 Web Client

   授权的JavaScript来源:
   - http://localhost:3000 (开发环境)
   - https://yourdomain.com (生产环境)
   - https://yourdomain.vercel.app (Vercel部署)

   授权的重定向URI:
   - http://localhost:3000/api/auth/callback/google (开发环境)
   - https://yourdomain.com/api/auth/callback/google (生产环境)
   - https://yourdomain.vercel.app/api/auth/callback/google (Vercel部署)
   ```
5. 点击 "创建"
6. 复制 **客户端ID** 和 **客户端密钥**

### 5. 配置环境变量

将获取的凭据添加到 `.env.local`：

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## 🐙 GitHub OAuth配置

### 1. 创建GitHub OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"

### 2. 填写应用信息

```
Application name: 梦境之书
Homepage URL: https://yourdomain.com
Application description: AI驱动的梦境创作平台
Authorization callback URL: https://yourdomain.com/api/auth/callback/github
```

**重要**: 对于开发环境，您需要创建单独的OAuth App：
```
Application name: 梦境之书 (开发)
Homepage URL: http://localhost:3000
Authorization callback URL: http://localhost:3000/api/auth/callback/github
```

### 3. 获取客户端凭据

1. 创建应用后，复制 **Client ID**
2. 点击 "Generate a new client secret" 生成密钥
3. 复制 **Client Secret**（只显示一次，请立即保存）

### 4. 配置环境变量

将GitHub凭据添加到 `.env.local`：

```env
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 🔧 环境变量完整示例

您的 `.env.local` 文件应包含：

```env
# NextAuth配置
NEXTAUTH_URL="http://localhost:3000"  # 生产环境改为实际域名
NEXTAUTH_SECRET="your-secure-secret"

# Google OAuth
GOOGLE_CLIENT_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 🌐 生产环境配置

### 域名更新清单

部署到生产环境时，需要更新以下配置：

#### Google OAuth
1. 在Google Cloud Console中添加生产域名到授权来源
2. 添加生产环境的回调URL
3. 更新 `NEXTAUTH_URL` 环境变量

#### GitHub OAuth
1. 创建新的生产环境OAuth App
2. 或更新现有App的Homepage URL和Callback URL
3. 使用生产环境的客户端ID和密钥

### Vercel部署配置

如果使用Vercel部署：

1. **Google OAuth回调URL**:
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```

2. **GitHub OAuth回调URL**:
   ```
   https://your-project.vercel.app/api/auth/callback/github
   ```

3. **环境变量**:
   ```env
   NEXTAUTH_URL="https://your-project.vercel.app"
   ```

## 🧪 测试OAuth配置

### 本地测试

1. 启动开发服务器：
   ```bash
   bun dev
   ```

2. 访问 `http://localhost:3000`

3. 点击登录按钮

4. 测试Google和GitHub登录

### 验证步骤

- [ ] Google登录按钮显示正常
- [ ] 点击Google登录跳转到Google授权页面
- [ ] 授权后正确跳转回应用
- [ ] GitHub登录功能同样正常
- [ ] 用户信息正确显示
- [ ] 登出功能正常

## 🚨 常见问题

### 1. "Error 400: redirect_uri_mismatch"

**原因**: 回调URL不匹配

**解决方法**:
- 检查OAuth应用中配置的回调URL
- 确保URL完全匹配（包括协议、域名、端口、路径）
- 开发环境使用 `http://localhost:3000`
- 生产环境使用实际域名

### 2. "Error 401: invalid_client"

**原因**: 客户端ID或密钥错误

**解决方法**:
- 检查环境变量配置
- 确认复制的客户端ID和密钥正确
- 注意不要包含额外的空格或换行符

### 3. Google OAuth "This app isn't verified"

**原因**: 应用未通过Google验证

**解决方法**:
- 开发阶段可以点击 "Advanced" > "Go to [App Name] (unsafe)"
- 生产环境需要申请Google应用验证

### 4. GitHub OAuth权限范围问题

**原因**: 权限范围配置

**解决方法**:
- 默认权限已足够基本登录
- 如需更多用户信息，可在OAuth设置中调整

## 📋 生产部署检查清单

部署到生产环境前：

- [ ] Google OAuth应用已配置生产域名
- [ ] GitHub OAuth应用已配置生产域名
- [ ] 所有回调URL已更新
- [ ] 环境变量已在生产环境配置
- [ ] OAuth应用状态设为"生产"
- [ ] 测试生产环境登录功能

## 🔒 安全建议

1. **保护客户端密钥**
   - 永远不要在客户端代码中暴露密钥
   - 使用环境变量存储敏感信息
   - 生产环境和开发环境使用不同的密钥

2. **定期轮换密钥**
   - 建议每6-12个月更换一次密钥
   - 怀疑泄露时立即更换

3. **监控授权活动**
   - 定期检查OAuth应用的使用情况
   - 监控异常登录活动

4. **权限最小化**
   - 只请求必要的用户权限
   - 不要请求过多的用户数据

---

## 🎉 完成！

完成上述配置后，您的梦境之书就支持Google和GitHub第三方登录了！

用户现在可以：
- ✅ 使用Google账户一键登录
- ✅ 使用GitHub账户一键登录
- ✅ 享受无缝的登录体验

如果遇到问题，请参考常见问题部分或查看官方文档。
