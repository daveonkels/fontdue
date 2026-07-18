# Cloudflare deployment

This site is deployed as static assets on Cloudflare Workers.

```sh
env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx --yes wrangler@4.112.0 deploy
```

The custom domain is managed in Cloudflare. The repository contains no credentials or DNS records.
