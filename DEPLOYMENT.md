# 部署指南

本项目使用 Cloudflare Workers 部署，环境变量分为敏感和非敏感两类。

## 环境变量分类

### 🔒 敏感变量（Secrets）

这些变量包含敏感信息，**绝不能提交到 Git**：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `OPENAI_API_KEY` | OpenAI/XAI API密钥 | `xai-xxx...` |

### ✅ 非敏感变量（Public Config）

这些变量是公开配置，存储在 `wrangler.json` 中，可以安全地提交到 Git：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `APP_ENV` | 环境名称 | `local` |
| `OPENAI_BASE_URL` | OpenAI API端点 | `https://api.x.ai/v1` |
| `OPENAI_MODEL` | 使用的模型 | `grok-4-1-fast-non-reasoning` |
| `RATE_LIMIT_MAX` | 速率限制次数 | `60` |
| `RATE_LIMIT_WINDOW_SECONDS` | 速率限制窗口（秒） | `60` |
| `MAX_BODY_BYTES` | 请求体最大字节数 | `4096` |
| `CORS_ORIGIN` | CORS来源（可选） | `*` |

## 本地开发设置

### 1. 安装依赖

```bash
npm install
```

### 2. 配置敏感环境变量

```bash
# 复制示例文件
cp .dev.vars.example .dev.vars

# 编辑 .dev.vars 并填入真实的密钥
# OPENAI_API_KEY: 从 https://console.x.ai 获取
```

### 3. 启动开发服务器

```bash
npm run dev
```

开发服务器会自动读取：
- `.dev.vars` 中的敏感变量
- `wrangler.json` 中的非敏感变量

## 生产环境部署

### 方法1: 使用 Wrangler CLI（推荐）

#### 步骤1: 登录 Cloudflare

```bash
npx wrangler login
```

#### 步骤2: 设置敏感变量（Secrets）

```bash
# 设置 OPENAI_API_KEY
npx wrangler secret put OPENAI_API_KEY
# 提示时输入密钥

# 验证设置
npx wrangler secret list
```

#### 步骤3: 部署

```bash
npm run deploy
```

部署时会自动使用：
- Cloudflare Secrets 中的敏感变量
- `wrangler.json` 中的非敏感变量

### 方法2: 使用 Cloudflare Dashboard

#### 步骤1: 部署项目

```bash
npm run deploy
```

#### 步骤2: 在 Dashboard 中设置 Secrets

1. 访问 https://dash.cloudflare.com
2. Workers & Pages → 选择 `bussiness-flow`
3. Settings → Variables and Secrets
4. 点击 "Add variable"
5. 添加以下变量（选择 "Encrypt"）:
   - `OPENAI_API_KEY`
6. 点击 "Save and Deploy"

## 更新环境变量

### 更新非敏感变量

直接编辑 `wrangler.json` 中的 `vars` 部分，然后重新部署：

```bash
npm run deploy
```

### 更新敏感变量

**CLI 方式：**
```bash
npx wrangler secret put OPENAI_API_KEY
```

**Dashboard 方式：**
1. Workers & Pages → `bussiness-flow` → Settings
2. Variables and Secrets
3. 编辑对应变量
4. Save and Deploy

## 安全检查清单

部署前确认：

- [ ] `.dev.vars` 已添加到 `.gitignore`
- [ ] `.dev.vars` 没有被提交到 Git
- [ ] `wrangler.json` 不包含敏感信息
- [ ] 生产环境的 Secrets 已在 Cloudflare 中设置
- [ ] 已从 Git 历史中移除泄露的密钥（如有）

## 多环境管理

如需区分生产和预览环境：

```bash
# 为生产环境设置
npx wrangler secret put OPENAI_API_KEY --env production

# 为预览环境设置
npx wrangler secret put OPENAI_API_KEY --env preview
```

## 常见问题

### Q: 更新 Secret 后何时生效？

Secrets 更新后会立即生效，无需重新部署。

### Q: 如何查看当前设置的 Secrets？

```bash
npx wrangler secret list
```

注意：出于安全考虑，这只会显示 Secret 名称，不会显示值。

### Q: 本地开发时如何测试生产配置？

```bash
# 使用 wrangler dev 的远程模式
npx wrangler dev --remote
```

这会使用 Cloudflare 上设置的 Secrets，而不是本地的 `.dev.vars`。

## 相关文件

- `wrangler.json` - 非敏感配置
- `.dev.vars` - 本地开发敏感变量（不提交）
- `.dev.vars.example` - 敏感变量示例（可提交）
- `.gitignore` - 确保敏感文件不被提交
