# 00:13 / Night Index

A Chinese-language editorial index for films, series, animation, books, manga, and games. The public site has no accounts and no playback or download service. Its shared guestbook, public record comments, and community ratings use a Cloudflare D1 database through Pages Functions.

## Local preview

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Content workflow

`data/catalogue.js` holds the 80 editorial records. `data/covers.js` is generated, not hand-maintained.

```bash
node scripts/build-covers.mjs
node scripts/validate-catalogue.mjs
node scripts/build-site.mjs
```

The build output is `dist/`. Do not commit it.

## Cloudflare Pages

1. Create a public GitHub repository and push the `main` branch.
2. In Cloudflare, choose **Workers & Pages** → **Create application** → **Pages** → **Import an existing Git repository**.
3. Select this repository and use: Framework preset **None**, production branch `main`, build command `node scripts/build-site.mjs`, and build output directory `dist`.
4. Deploy to the generated `*.pages.dev` address. Git integration creates a production deploy for `main` and previews for pull requests.
5. When a custom domain is ready, add it first through the Pages project's **Custom domains** flow. For an external DNS provider, create the requested CNAME only after the domain is associated in Pages.

### Shared community data

The page will continue to work with browser-local storage before D1 is configured. To make guestbook posts, replies, likes, record comments, and star ratings visible to every visitor:

1. In **Workers & Pages** → **D1 SQL Database**, create a database named `night-maid-community`.
2. From this repository, authenticate Wrangler and apply the schema:

   ```bash
   npx wrangler login
   npx wrangler d1 execute night-maid-community --remote --file=migrations/0001_community.sql
   ```

3. In the Pages project, open **Settings** → **Bindings** → **Add** → **D1 database bindings**. Set the variable name to `NIGHT_MAID_DB`, select `night-maid-community`, and save.
4. Redeploy the latest `main` build. The generated `_routes.json` limits Functions execution to `/api/*`; the catalogue itself stays static.

The browser assigns each visitor a random local identifier so a star rating and a guestbook like can be updated rather than duplicated. Saved works and viewing status remain private to that browser.

Cloudflare’s current references: [static HTML deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/), [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), and [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Image policy

See [NOTICE.md](NOTICE.md). The deployment uses a fixed cover manifest so visitors do not issue metadata API requests just to populate the catalogue. Only assets with a clear reusable licence should ever be committed locally.
