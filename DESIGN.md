---
name: Glimty
description: A warm, photo-led gift shop where the assistant is the checkout.
colors:
  ink: "#2a1810"
  ink-soft: "#5a4036"
  cream: "#fbf4ec"
  paper: "#fff8f2"
  tile: "#efe4da"
  blush: "#f3c6b4"
  sand: "#ead7c8"
  coral: "#e36a4a"
  coral-deep: "#c44b36"
  coral-deep-hover: "#b04230"
  hero: "#7a3f31"
  moss: "#3f6b4f"
  line: "rgba(42, 24, 16, 0.12)"
typography:
  display:
    fontFamily: "Fraunces, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(34px, 5vw, 52px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  section:
    fontFamily: "Fraunces, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(30px, 4vw, 42px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  product-name:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.3
  label:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.04em"
rounded:
  tile: "16px"
  card: "22px"
  photo: "24px"
  hero: "32px"
  pill: "999px"
spacing:
  grid-gap: "20px"
  grid-row-gap: "32px"
  section: "72px"
  gutter: "24px"
  gutter-mobile: "16px"
components:
  button-primary:
    backgroundColor: "{colors.coral-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-primary-hover:
    backgroundColor: "{colors.coral-deep-hover}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
  filter:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  filter-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
  gift-tile:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.tile}"
  buybox:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "28px"
---

# Glimty design system

## Overview

Glimty sells a small, edited shelf of gifts and lets an assistant do the choosing, wrapping and remembering. The interface is warm paper and ink with one coral accent. Photography carries the pages; chrome stays out of its way. There is no cart: every commercial action ends in a conversation, so the primary button always leads to the assistant.

Pages are server-rendered strings in `lib/pages.js`, styled by one stylesheet, `public/css/styles.css`. Everything works without JavaScript except the chat itself and the recently-viewed row.

## Colors

- `cream` is the page, `paper` is any raised surface, `tile` sits behind photos while they load.
- `ink` is text and the "selected" state (active filter, user chat bubble, language switch). `ink-soft` is secondary text and must stay on cream or paper, where it clears 4.5:1.
- `coral-deep` is the single accent: primary buttons, the logo, low-stock notices, the active sort underline. `coral` is only a hover border. Do not introduce a second accent; the old Messenger blue was removed on purpose.
- `moss` means "in stock" and nothing else.
- `hero` is the home hero ground. On it, the primary button inverts to cream.
- Dark bands (`ink` background) are used once per page at most: the in-grid assistant prompt in the shop, the assistant section on home.

## Typography

Fraunces is the voice: page titles, section titles, prices in the buy box, the "why Glimty picks it" quote, and headings inside dark bands. Source Sans 3 does everything a shopper scans: product names, blurbs, prices in the grid, filters, buttons, details. Product names in grids are sans 700 at 17px, never serif, so a row of four stays scannable.

Prices and counts use `font-variant-numeric: tabular-nums`. Headings use `text-wrap: balance`. Small uppercase labels are reserved for the brand line above a product name and for sub-headings inside the product page; they are not used as kickers above page titles.

## Layout

- Content width is `min(1200px, 100% - 48px)`; 16px gutters under 860px.
- The product grid is 4 columns, 3 under 1040px, 2 under 860px. Gap is 20px across, 32px down.
- **Every catalogue photo is a 2.6:1 banner, and several are two-frame diptychs.** Tiles crop to 4:3, which is almost exactly one diptych frame. `PHOTO_FOCUS` in `lib/pages.js` sets a horizontal focal point per gift and `PHOTO_ZOOM` zooms into narrow frames. Add an entry whenever a new photo crops badly. The product page shows the photo uncropped at full width for the same reason, with the description and a sticky buy box beneath it.
- Tiles load a 720px copy from `public/images/gifts/sm/` through `srcset`; the full 1100px file is for the product page and high-density screens. When adding a photo, add its `sm/` copy (`sips -Z 720`).
- The shop bar (categories, budgets, count, sort) is sticky on desktop and static on phones, where category chips scroll horizontally.
- On phones the product page gets a fixed bottom bar with price, stock and the assistant button; the chat widget becomes a full-screen sheet.

## Elevation & Depth

Flat by default. Cards and tiles have no shadow; separation comes from the tile colour and 1px `line` borders. `shadow-soft` (0 6px 24px, 7% ink) is for things that float beside content: the buy box, the search field on focus, the assistant composer. `shadow` (0 18px 50px, 12% ink) is only for things that float above the page: the chat widget, launcher and nudge.

## Shapes

Pills for anything tappable (buttons, filters, swatches, search, composer). 16px for photo tiles, 22px for cards and dark bands, 24px for the product photo, 32px for the hero. Chat bubbles are 20px with one 6px corner pointing at the speaker.

## Components

- **Gift card** (`giftCard`): photo tile, brand label, name, two-line blurb, price pinned to the bottom. A badge appears on the photo only for low stock or sold out; "in stock" is not worth saying. Sold-out photos are desaturated. Hover zooms the photo 4% and underlines the name.
- **Filters**: category chips carry their count. Budget chips sit on a second row, are lighter weight, toggle off when tapped again, and render as inert text when their count is zero. All filters are plain links so state lives in the URL (`?q=`, `?sort=`, `?budget=`).
- **Empty state**: a serif sentence naming what was searched, one line of help, the assistant button first and "clear filters" second.
- **Buy box**: serif price, stock line with a status dot, colour swatches (two-tone colours split diagonally), primary button to the assistant with the gift handed over (`/assistant?gift=<id>`), quiet button back to the category.
- **Assistant page**: a centred 760px conversation with no box around it. Picks render as photo cards in a row; in the small widget they stay as compact rows. A typing indicator shows while a reply is pending and the send button is disabled.
- **Nudge**: appears after five seconds, can be dismissed, and stays dismissed for the session.
- **Icons** are inline SVG at 1.6–1.7 stroke with round caps. No glyph characters as icons.

## Do's and Don'ts

- Do lead with the photo and let the assistant be the way out of every dead end (empty search, 404, indecision in the grid).
- Do keep new copy in both `nb` and `en` in `lib/i18n.js`; Norwegian is the default.
- Do respect `prefers-reduced-motion`; motion is limited to hover zooms, the widget and nudge entrances, and the typing dots, all on the same ease-out curve.
- Don't add a cart, quantity steppers or ratings; the shop has none of those behind it.
- Don't put shadows on grid cards or wrap cards inside cards.
- Don't add a second accent colour or gradients on buttons.
- Don't centre-crop a new photo without checking whether it is a diptych.
