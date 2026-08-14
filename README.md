# 00:13 / Night Index

A Chinese-language editorial index for films, series, animation, books, manga, and games. The public site is a static website: it has no accounts, no server database, and no playback or download service.

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

Cloudflare’s current references: [static HTML deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/), [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), and [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Image policy

See [NOTICE.md](NOTICE.md). The deployment uses a fixed cover manifest so visitors do not issue metadata API requests just to populate the catalogue. Only assets with a clear reusable licence should ever be committed locally.
