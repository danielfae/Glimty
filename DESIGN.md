---
name: Glimty
description: Warm paper shop for a Norwegian gift concierge
colors:
  ink: "#2a1810"
  ink-soft: "#5a4036"
  cream: "#fbf4ec"
  paper: "#fff8f2"
  blush: "#f3c6b4"
  coral: "#a83b2a"
  coral-deep: "#8c3124"
  coral-bright: "#e36a4a"
  sand: "#ead7c8"
  line: "rgba(42, 24, 16, 0.12)"
  on-ink: "#fbf4ec"
typography:
  display:
    fontFamily: "Fraunces, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.875rem, 8vw, 5.5rem)"
    fontWeight: 560
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Fraunces, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Fraunces, Iowan Old Style, Georgia, serif"
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  sm: "12px"
  md: "22px"
  lg: "32px"
  pill: "999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "28px"
  xl: "72px"
components:
  button-primary:
    backgroundColor: "{colors.coral}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.coral-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "22px"
  chip:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  chip-on:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
  input:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 16px"
---

# Design System: Glimty

## Overview

**Creative North Star: "The Warm Shop Counter"**

Glimty should feel like a small Oslo gift counter at four in the afternoon: cream paper, coral enamel, and a serif that belongs on a shop front rather than a SaaS dashboard. The assistant is the person behind the counter, not a floating chatbot skin.

Density is editorial, not packed. Pages breathe with a single cream field; cards are paper on that field, not glass. The coral mark is scarce — logo, primary action, price — so the rest of the room can stay quiet.

This document records the incumbent implementation in `public/css/styles.css`. It does not inherit Messenger-blue chips, kickers above headings, or other leftovers the craft floor refuses.

**Key Characteristics:**

- Cream paper field, warm brown ink, one coral voice
- Fraunces for names and display; Source Sans 3 for reading and controls
- Pill buttons, softly rounded paper cards, no hard offset shadows
- Chat is the same room as the shop, not a blue messenger pane

## Colors

A warm paper palette with one enamel accent. No cool gray, no purple, no Facebook blue.

### Primary

- **Coral enamel** (`{colors.coral}` / `{colors.coral-deep}`): primary actions, prices, the logo mark, and focus. Deep coral is the pressed / emphasis stop.

### Neutral

- **Shop ink** (`{colors.ink}`): body text, selected chips, user chat bubbles, dark buttons.
- **Soft ink** (`{colors.ink-soft}`): supporting copy, footer, meta lines. Always a brown tint of the ink, never gray.
- **Cream field** (`{colors.cream}`): page background.
- **Paper** (`{colors.paper}`): cards, chat shell, FAQ rows.
- **Blush** (`{colors.blush}`): step numerals, brief tags, selection highlight.
- **Sand** (`{colors.sand}`): photo fallbacks and scrollbar track.
- **Hairline** (`{colors.line}`): 1px borders only.

**The One Coral Rule.** Coral appears on the mark, the primary button, the price, and focus. It is not a wash behind large text blocks.

**The No Messenger Blue Rule.** Assistant UI uses ink, cream, and coral. `#2f6dff` and cool chip blues are defects, not tokens.

## Typography

**Display Font:** Fraunces (Georgia / Iowan Old Style fallback)
**Body Font:** Source Sans 3 (Segoe UI fallback)

**Character:** A shop-front serif with a soft optical size, paired with a humanist sans that stays readable at 18px in both Norwegian and English.

### Hierarchy

- **Display** (weight 560, `clamp(46px, 8vw, 88px)`, line-height 0.95): the home wordmark hero only.
- **Headline** (weight 600, `clamp(32px, 5vw, 48px)`): section and product titles.
- **Title** (weight 600, 26px): card and category names.
- **Body** (400, 18px / 1.55): reading copy. Keep measure near 58–75ch.
- **Label** (700, 12px, slight tracking): language switcher and compact meta. Sentence case. Do not use an uppercase kicker above a heading.

**The Heading Speaks Rule.** No eyebrow, kicker, or uppercase label stacked above an `h1`/`h2`. Brand, stock, and breadcrumbs are meta beside or below the name, not a section slogan.

## Layout

A single centered column, `min(1120px, calc(100% - 40px))`, collapsing to 24px side gutters under 860px. Marketing sections use 72px bottom padding. Product and shop share a three-column card grid that becomes one column on small screens. The product stage is 1.1 / 0.9 until 860px.

The site header and footer are full-bleed on the cream field; their contents share the same wrap. Sticky header, cream at 86% over white, 14px blur, hairline only after scroll.

## Elevation & Depth

Tonal paper first. Shadows are ambient and offset, never a zero-blur sticker or a colored halo.

### Shadow Vocabulary

- **Resting paper** (`box-shadow: 0 18px 50px rgba(42, 24, 16, 0.12)`): cards, chat widget, launch control.
- **Lift** (`0 10px 28px rgba(42, 24, 16, 0.14)`): primary button hover.

**The Flat-at-Rest Rule.** Surfaces sit on the cream. Shadow answers hover or a floating tool (widget, launch), not every card equally screaming for attention.

## Shapes

Soft shop geometry: 22px paper cards, 16–24px chat chrome, 32–36px hero and split wells, pills for buttons, language switch, and the composer field. The logo mark is a circle. Hairlines only; no 4px accent bars.

## Components

### Buttons

- **Shape:** full pill (`999px`)
- **Primary:** coral enamel, white type, 12×20 padding. Hover lifts 1px and deepens the coral.
- **Dark:** ink fill, cream type — secondary commitments (start over, more in this category).
- **Ghost:** used only on the dark hero / split, 1px cream stroke.
- **Focus:** 3px coral ring, 3px offset, on every control.

### Chips

- **Style:** white paper, ink type, 1px hairline, 12px radius.
- **On:** ink fill, cream type.
- **Hover:** coral hairline, cream wash. Never cool blue.

### Cards / Containers

- **Corner:** 22px paper.
- **Background:** `{colors.paper}` on `{colors.cream}`.
- **Gift cards:** image full-bleed on top (220px, cover), 18–22px meta pad. Price in coral-deep.
- **Category tiles:** min-height 150px, name in Fraunces, count/hint in soft ink.

### Inputs / Fields

- **Style:** cream well, hairline, pill, 12×16 padding.
- **Focus:** coral ring. Caret is coral-deep.
- **Chat composer:** white bar, pill field, primary send.

### Navigation

- Wordmark: Fraunces 28px, coral-deep, circle mark to the left.
- Links: 16px soft ink, full ink on hover or current.
- Language switch: white pill, 12px bold NO / EN, ink fill on the active locale.

### Chat (signature)

The widget and `/assistant` shell are the same paper room: cream head, blush-tinted transcript, assistant bubbles as white paper, user bubbles as ink. Gift picks are a 56px photo + name + price row. Brief tags sit on blush pills.

## Do's and Don'ts

### Do:

- **Do** keep Fraunces for names and Source Sans 3 for reading.
- **Do** tint supporting text from ink (`#5a4036`), never gray.
- **Do** put coral on the action, the price, and the mark.
- **Do** theme selection, scrollbars, caret, and focus from this palette.
- **Do** write Norwegian first; English is the same layout, not a different skin.

### Don't:

- **Don't** put a kicker or uppercase eyebrow above a heading.
- **Don't** use Messenger blue, purple gradients, or Inter as the voice of the page.
- **Don't** nest cards inside cards, or stripe a card with a thick side border.
- **Don't** invent testimonials, partner logos, or stock photography outside `public/images/gifts/`.
- **Don't** treat emoji or random Unicode as the icon set. Draw a small SVG in the same stroke as the close and back arrows.
