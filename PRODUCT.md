# Product

<!-- impeccable:product-schema 1 -->

> **Inferred record.** This Cloud Agent session has no interview tool and no live product owner in the loop. Every fact below is labeled from repository evidence (README, `lib/`, routes, and existing copy). Treat unlabeled invention as out of scope; undecided facts stay open.

## Platform

web

## Users

**Primary (inferred from copy and flows):** a Norwegian-speaking person who needs a gift now — partner, parent, colleague, friend, or child — and would rather talk than browse a catalog. They arrive with a recipient, an occasion, and often a budget in one sentence.

**Secondary (inferred):** the same person switching to English, or an English speaker using `?lang=en` / the NO·EN control.

**Not a user (inferred):** a warehouse operator, a Facebook Messenger contact, or a checkout clerk. There is no staff console and no payment flow.

## Product Purpose

Glimty is a web gift shop with its own on-site assistant. The visitor describes who the gift is for; the assistant builds a brief, recommends three gifts from Glimty’s You Brands inventory, and can continue into wrapping or a date planner.

Success (inferred): the visitor reaches a specific gift they would actually give, without leaving the site for Messenger, a form, or a third-party inbox.

## Positioning

The mechanism a neighboring catalog could not copy: one assistant that already knows this inventory, keeps the brief across turns, understands a full Norwegian or English sentence (`gave til pappa, bursdag, 50 dollar`), and only asks for what is missing. The shop is the same catalog, photographed, not a search box over you.no.

## Operating Context

- Browser on the marketing page, shop, product page, widget chat, or full-page `/assistant`.
- Locale is Norwegian (`nb`) by default; English is the second language. Cookie `glimty_lang`, `?lang=`, and the header/chat NO·EN switch all set it. Chat replies continue in the new language.
- Sessions live in server memory; the browser stores the session id in `localStorage`.
- Inventory photos and product text are sourced from the You Brands catalog at you.no; Glimty holds its own stock counts and USD price estimates.
- Wrapping and sending are simulated in this preview. There is no cart, payment, or account.

## Capabilities and Constraints

Confirmed in code:

- Routes: `/`, `/shop`, `/shop/:category`, `/gift/:id`, `/assistant`, `/api/catalog`, `/api/chat`, `/api/health`.
- 36 gifts in six categories: drinkware, travel, bags, home, tableware, outdoors.
- Assistant paths: find a gift, wrap a gift, keep a planner.
- Language: Norwegian default, English second. Product names and blurbs have Norwegian overrides in `lib/locales/products.js`.
- No Messenger, Facebook, MongoDB, or secrets remain in the app.
- Stack (existing codebase, not a greenfield choice): Node, Express, server-rendered HTML, static CSS/JS in `public/`. Run with `npm install && npm start` (port 3000). Tests: `npm test`.

Open / undecided:

- Whether checkout, accounts, or real fulfillment will ship.
- Whether more locales than `nb` / `en` will exist.
- Brand legal owner and trademark usage beyond the name “Glimty” used in the repo.

## Brand Commitments

- Name: **Glimty**.
- Voice (inferred from shipped copy): warm, direct, slightly dry. Speaks as “we” / the assistant, not as a luxury house or a coupon site. Norwegian copy is the default voice; English is a faithful second, not a rewrite into US retail slang.
- Inventory commitment: You Brands / you.no photography and catalog descriptions. Future work must not invent brands, testimonials, press, or stock that is not in `lib/inventory.js`.
- Visual identity is already implemented (cream paper, coral, Fraunces + Source Sans 3). That world is recorded in DESIGN.md; it is not invented here.

## Evidence on Hand

- Live copy in `lib/i18n.js` and `lib/locales/products.js`.
- 36 product JPEGs in `public/images/gifts/`.
- Inventory facts in `lib/inventory.js` (SKU, stock, colors, source URL, price).
- No testimonials, case studies, press quotes, or customer names exist. Do not fabricate them.

## Product Principles

1. Stay on the site. The assistant never hands the visitor to Messenger, Typeform, or another inbox.
2. Ask only for the missing piece. A full sentence should skip questions already answered.
3. Recommend from this inventory, with a reason, not a dump of the catalog.
4. Norwegian is the product language; English is a second language, not a fork.
5. Do not invent proof, partners, or fulfillment the preview does not perform.

## Accessibility & Inclusion

No formal standard was committed in the repo. Inferred expectation: the site must remain usable in both Norwegian and English, on a phone, with a keyboard, and with visible focus. Prices stay in USD in this preview.
