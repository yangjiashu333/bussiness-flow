# React + Vite + Hono + Cloudflare Workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/vite-react-template)

This template provides a minimal setup for building a React application with TypeScript and Vite, designed to run on Cloudflare Workers. It features hot module replacement, ESLint integration, and the flexibility of Workers deployments.

![React + TypeScript + Vite + Cloudflare Workers](https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fc7b4b62-442b-4769-641b-ad4422d74300/public)

<!-- dash-content-start -->

🚀 Supercharge your web development with this powerful stack:

- [**React**](https://react.dev/) - A modern UI library for building interactive interfaces
- [**Vite**](https://vite.dev/) - Lightning-fast build tooling and development server
- [**Hono**](https://hono.dev/) - Ultralight, modern backend framework
- [**Cloudflare Workers**](https://developers.cloudflare.com/workers/) - Edge computing platform for global deployment

### ✨ Key Features

- 🔥 Hot Module Replacement (HMR) for rapid development
- 📦 TypeScript support out of the box
- 🛠️ ESLint configuration included
- ⚡ Zero-config deployment to Cloudflare's global network
- 🎯 API routes with Hono's elegant routing
- 🔄 Full-stack development setup
- 🔎 Built-in Observability to monitor your Worker

Get started in minutes with local development or deploy directly via the Cloudflare dashboard. Perfect for building modern, performant web applications at the edge.

<!-- dash-content-end -->

## Getting Started

To start a new project with this template, run:

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/vite-react-template
```

A live deployment of this template is available at:
[https://react-vite-template.templates.workers.dev](https://react-vite-template.templates.workers.dev)

## Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
# 复制环境变量示例文件
cp .dev.vars.example .dev.vars

# 编辑 .dev.vars 填入真实的密钥
# - OPENAI_API_KEY: 从 https://console.x.ai 获取
```

更多配置详情请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 3. Start the development server

```bash
npm run dev
```

Your application will be available at [http://localhost:5173](http://localhost:5173).

## Demo API (serverless-friendly)

This template includes a minimal echo endpoint that waits ~1ms and returns the input JSON with `processed: true`, plus an OpenAI-generated explanation when `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL` are configured.

Endpoint:

```bash
curl -X POST "http://localhost:5173/api/echo" \
  -H "content-type: application/json" \
  -d '{"message":"hello"}'
```

## Security & Cost Controls (best-practice defaults)

Serverless has no "always-on" app server, so protection lives inside the Worker:

- **Rate limit**: basic in-memory bucket to prevent bursts from single IPs.
- **Input limits**: body size + query length to stop oversized payloads.
- **Timeout + retry**: outbound calls are bounded so upstream slowness doesn't blow up cost.

In production, upgrade the rate limiter to a durable store (KV or Durable Objects) so limits are shared across all edge nodes.

## Production

### 1. Set production secrets

在部署前，需要在 Cloudflare 设置敏感环境变量：

```bash
# 登录 Cloudflare
npx wrangler login

# 设置敏感变量
npx wrangler secret put OPENAI_API_KEY
```

或者在 [Cloudflare Dashboard](https://dash.cloudflare.com) 中设置。详见 [DEPLOYMENT.md](./DEPLOYMENT.md)

### 2. Build and deploy

Build your project for production:

```bash
npm run build
```

Preview your build locally:

```bash
npm run preview
```

Deploy your project to Cloudflare Workers:

```bash
npm run deploy
```

### 3. Monitor your workers

```bash
npx wrangler tail
```

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/)
- [Hono Documentation](https://hono.dev/)
