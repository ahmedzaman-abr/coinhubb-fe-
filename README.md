# CoinMobb

Money. Tech. Internet. Made in Pakistan.

A small, fast, static site built with [Astro](https://astro.build). Stories and guides are Markdown files in this repo, so there is no database or server to look after.

## Posting from your phone

1. Go to [pagescms.org](https://pagescms.org), sign in with GitHub and open this repo.
2. Pick **Stories** → **Add an entry**, fill in the headline, subheading, section and story, then save.
3. Untick **Draft** when it's ready to go live. Saving commits to GitHub and the site rebuilds by itself in about a minute.

Useful fields:

- **Pin as homepage lead**: puts the story at the top of the homepage. Only tick one at a time.
- **Hot Shit position**: 1 to 5 puts the story in the Hot Shit list at that spot.
- **Guide to plug**: the file name of a guide (for example `crypto-without-scams`) adds a "Level up" box at the end of the story.
- Stories without an image get generated pixel art, so you can post without one.

To add a "Bro, what?" glossary box inside a story, switch the editor to code view and paste:

```html
<aside class="gloss">
<strong>Ponzi scheme</strong>
<p>Your plain explanation here.</p>
</aside>
```

**Site settings** holds the price ticker, social links, the newsletter day and the newsletter form URL.

## What's sample content

Everything marked `draft: true` is a placeholder from the design mockup and does not appear on the live site. The lead story about family WhatsApp groups is live, but its regulation section still has a placeholder you need to fill in from primary sources before launch.

The three Mobb Guides are drafts with `Rs [PRICE]` and no checkout link. Set the price, paste the checkout link from your payment provider, and untick Draft to start selling.

## Still to connect

- **Domain**: change `site` in `astro.config.mjs` once the domain is registered.
- **Newsletter**: create a list with an email provider and paste its form URL into Site settings → `newsletterAction`. Until then the signup form says it isn't connected.
- **Guide payments**: each guide's `buyUrl` points at its checkout page.
- **Prices ticker**: edited by hand in Site settings for now.

## Hosting (free)

Cloudflare Pages or Netlify, connected to this repo:

- Build command: `npm run build`
- Output folder: `dist`

Every commit, including saves from the editor, redeploys the site.

## Running it on a computer

```sh
npm install
npm run dev      # http://localhost:4321, drafts visible
npm run build    # production build in dist/, drafts hidden
```
