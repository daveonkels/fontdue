# Cloudflare deployment

This no-build static site is deployed directly from `public/`.

- Production URL: `https://fontdue.onk.io`
- Worker: `fontdue-onk-io`
- Routing: the production custom domain is declared in `wrangler.jsonc`

## Validate and deploy

```sh
env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx --yes wrangler@4.112.0 deploy --dry-run
env -u CF_API_TOKEN -u CLOUDFLARE_API_TOKEN npx --yes wrangler@4.112.0 deploy
```

Wrangler uses its local OAuth login. Do not add credentials to the repository.
Cloudflare Web Analytics is managed in the Cloudflare dashboard. To roll back,
run `npx wrangler rollback <version-id>`.
