# Deployment Guide — prompt.dishine.it

> ⚠️ **This deployment guide describes the *legacy* static hosting of `viewer.html` on SiteGround.** The live **[prompt.dishine.it](https://prompt.dishine.it/)** is no longer served from `viewer.html` — it is now a full React SPA with Supabase-backed accounts, private chat, and multi-model Live Battle. **This file is retained for historical reference only.** Anyone forking the repo to self-host a static viewer can still follow the steps below, but the result will be the **v2.4.0 legacy experience**, not the current website.

Hosting: SiteGround | Domain: prompt.dishine.it (historical)

---

## Files to upload

| Local file | Upload as | Destination |
|---|---|---|
| `viewer.html` | `index.html` | `/public_html/` (subdomain root) |
| `robots.txt` | `robots.txt` | `/public_html/` |
| `sitemap.xml` | `sitemap.xml` | `/public_html/` |
| `.htaccess` | `.htaccess` | `/public_html/` |

> **That's it.** Everything else (`bin/`, `src/`, `prompts/`, `test/`, etc.) is development-only and stays off the server.

---

## Step-by-step on SiteGround

1. **Log in** to SiteGround → Site Tools
2. Go to **Files → File Manager**
3. Navigate to the subdomain folder (usually `prompt/public_html/` or as configured)
4. Upload and rename `viewer.html` → `index.html`
5. Upload `robots.txt`, `sitemap.xml`, `.htaccess`
6. SiteGround enables HTTPS automatically via Let's Encrypt — verify SSL is active in **Security → SSL Manager**

---

## After deployment — SEO checklist

- [ ] Verify https://prompt.dishine.it/ loads the app
- [ ] Verify https://prompt.dishine.it/robots.txt is reachable
- [ ] Verify https://prompt.dishine.it/sitemap.xml is reachable
- [ ] Submit sitemap to **Google Search Console**: https://search.google.com/search-console
  - Add property `https://prompt.dishine.it/`
  - Submit sitemap URL: `https://prompt.dishine.it/sitemap.xml`
- [ ] Submit sitemap to **Bing Webmaster Tools**: https://www.bing.com/webmasters
- [ ] Check page load via https://pagespeed.web.dev/

---

## Updating content

When new prompts or features are added, simply re-build `viewer.html` (run `node bin/prompt-lib.js` locally) and re-upload it as `index.html` — overwrite the old file.

Update the `<lastmod>` date in `sitemap.xml` and re-upload it too.
