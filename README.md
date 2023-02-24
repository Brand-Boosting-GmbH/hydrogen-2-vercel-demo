# Hydrogen template: Demo Store - Vercel Deployment

This repository shows how Hydrogen "2" (2023-01+) can be deployed on Vercel Edge Functions.

Try it here: https://hydrogen-2-vercel-demo.vercel.app/

### Modified files
* server.ts
* server-dev.ts (new)
* remix.config.ts
* remix.env.d.ts
* app/lib/session.server.ts

### Q & A

* *Why are there two server.ts/server-dev.ts files?*
  
  For local development the server-dev.ts is used to work with MiniOxygen.
* *Why is "cache" removed?*
  
  Vercel doesn't support the [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) present in Cloudflare Workers/Oxygen, so for now its removed.
* *Why is session.server.ts changed?*
  The Demo Store uses `createCookieSessionStorage()` from `@shopify/remix-oxygen` which wouldn't work on Vercel for me. It's replaced with a generic Cookie Session implementation.

### Vercel config
<img width="897" alt="image" src="https://user-images.githubusercontent.com/6160707/221168621-be8cf59e-b71a-43cb-87be-bd5069399ff9.png">
