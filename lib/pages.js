'use strict';

const inventory = require('./inventory');
const i18n = require('./i18n');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function langSwitch(locale, path) {
  const t = (key, vars) => i18n.t(locale, key, vars);
  return `<div class="lang-switch" role="group" aria-label="${escapeHtml(t('lang_label'))}">
    <a href="${escapeHtml(i18n.langHref(path, 'nb'))}" class="${locale === 'nb' ? 'is-on' : ''}" hreflang="nb" lang="nb">NO</a>
    <a href="${escapeHtml(i18n.langHref(path, 'en'))}" class="${locale === 'en' ? 'is-on' : ''}" hreflang="en" lang="en">EN</a>
  </div>`;
}

function layout({ title, description, active, locale, path, body, extraNav, footerLeft, footerRight, after }) {
  const t = (key, vars) => i18n.t(locale, key, vars);
  const htmlLang = locale === 'en' ? 'en' : 'nb';
  return `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description || title)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/styles.css">
  <script>window.GLIMTY = { locale: ${JSON.stringify(locale)}, ui: ${JSON.stringify(i18n.uiPack(locale))} };</script>
</head>
<body${active === 'assistant' ? ' class="assistant-page"' : ''}>
  <a class="skip-link" href="#main">${escapeHtml(t('skip_link'))}</a>
  <div class="wrap">
    <header class="site-header">
      <a class="logo" href="/?lang=${locale}"><span class="mark">G</span> Glimty</a>
      <nav>
        <a class="${active === 'shop' ? 'is-on' : ''}" href="/shop?lang=${locale}">${escapeHtml(t('nav_shop'))}</a>
        <a class="hide-sm" href="/?lang=${locale}#how">${escapeHtml(t('nav_how'))}</a>
        ${extraNav || `<a class="btn btn-primary" href="/assistant?lang=${locale}">${escapeHtml(t('nav_talk'))}</a>`}
        ${langSwitch(locale, path)}
      </nav>
    </header>
    <main id="main">
    ${body}
    </main>
    <footer>
      <div class="footer-brand">
        <a class="logo" href="/?lang=${locale}"><span class="mark">G</span> Glimty</a>
        <p>${escapeHtml(footerLeft || t('footer_left'))}</p>
        <p>${footerRight || escapeHtml(t('footer_right'))}</p>
      </div>
      <nav aria-label="${escapeHtml(t('footer_shop'))}">
        <strong>${escapeHtml(t('footer_shop'))}</strong>
        ${inventory.listCategories(locale).map((cat) => `<a href="/shop/${cat.id}?lang=${locale}">${escapeHtml(cat.label)}</a>`).join('')}
      </nav>
      <nav aria-label="${escapeHtml(t('footer_help'))}">
        <strong>${escapeHtml(t('footer_help'))}</strong>
        <a href="/assistant?lang=${locale}">${escapeHtml(t('nav_talk'))}</a>
        <a href="/?lang=${locale}#how">${escapeHtml(t('nav_how'))}</a>
        <a href="/?lang=${locale}#faq">${escapeHtml(t('nav_faq'))}</a>
      </nav>
    </footer>
  </div>
  ${after || ''}
</body>
</html>`;
}

// Swatch colours for the English colour keys used in inventory.
const SWATCHES = {
  White: '#ffffff', 'Steel grey': '#8d9196', Black: '#1c1a19', Navy: '#1f2c47', Olive: '#5c6446',
  Steel: '#b4b8bc', Grey: '#9a9a98', Red: '#c0392f', 'Safety yellow': '#e6d321', Natural: '#e6d9c3',
  Charcoal: '#3b3b3d', Tan: '#b98a5a', 'Vintage green': '#5f7560', Pink: '#ecb7c0', Blue: '#3e6aa8',
  Linen: '#d9cdb9', Crystal: '#e8eef1', Porcelain: '#f6f3ec', 'Stainless steel': '#c3c6c9', Onyx: '#22201f',
  Beige: '#d8c6a8', 'Dark Gray': '#4a4a4c', Orange: '#e2722e'
};

function swatchStyle(color) {
  const tones = [...new Set(String(color).split('/').map((part) => SWATCHES[part.trim()] || '#d9cdb9'))];
  if (tones.length === 1) return `background:${tones[0]}`;
  return `background:linear-gradient(135deg, ${tones[0]} 50%, ${tones[1]} 50%)`;
}

// Horizontal focal point (%) for cropping the 2.6:1 catalogue photos into tiles.
// Several are two-frame diptychs, so a centred crop would land on the seam.
const PHOTO_FOCUS = {
  wabasca: 0, waco: 85, 'rotterdam-cup': 90, eindhoven: 20, 'thorn-cup': 80,
  flanderen: 0, bree: 0, 'liege-cup': 0, 'gots-tote-basic': 40, 'k2-urban': 40, 'travel-toiletry': 75,
  'transitt-backpack': 0, 'transfer-duffel': 0, 'rocky-backpack': 0, 'canvas-tote': 0, 'gerber-spork': 30,
  'bernadotte-plate': 100, 'bernadotte-wine': 100, 'bernadotte-carafe': 75, 'bernadotte-flutes': 100,
  'teema-mug': 60, 'lexington-towel': 100
};

// Diptychs whose product frame is narrower than a tile get zoomed into that frame.
const PHOTO_ZOOM = { 'transitt-backpack': 1.06, flanderen: 1.06, bree: 1.06, 'bernadotte-plate': 1.15, 'bernadotte-wine': 1.35, 'bernadotte-flutes': 1.35 };

function focusStyle(item) {
  const focus = PHOTO_FOCUS[item.id];
  if (focus == null) return '';
  const zoom = PHOTO_ZOOM[item.id];
  return ` style="object-position:${focus}% 50%;transform-origin:${focus}% 50%${zoom ? `;--zoom:${zoom}` : ''}"`;
}

function giftCard(item, locale) {
  const gift = inventory.publicGift(item, locale);
  const status = inventory.stockStatus(item);
  const badge = status === 'out'
    ? `<span class="badge badge-out">${escapeHtml(i18n.t(locale, 'stock_out'))}</span>`
    : status === 'low'
      ? `<span class="badge">${escapeHtml(i18n.t(locale, 'stock_low', { count: item.stock }))}</span>`
      : '';
  return `<a class="gift${status === 'out' ? ' is-out' : ''}" href="/gift/${escapeHtml(gift.id)}?lang=${locale}">
    <div class="gift-media">
      <img src="${escapeHtml(gift.image)}" alt="" loading="lazy" decoding="async" width="1100" height="424"${focusStyle(item)}>
      ${badge}
    </div>
    <div class="gift-body">
      <p class="gift-brand">${escapeHtml(gift.brand)}</p>
      <h3>${escapeHtml(gift.name)}</h3>
      <p class="gift-blurb">${escapeHtml(gift.blurb)}</p>
      <p class="price">$${gift.price}</p>
    </div>
  </a>`;
}

function categoryTile(cat, locale) {
  const cover = inventory.getByCategory(cat.id)[0];
  return `<a class="cat" href="/shop/${escapeHtml(cat.id)}?lang=${locale}">
    ${cover ? `<img src="${escapeHtml(cover.image)}" alt="" loading="lazy" decoding="async" width="1100" height="424"${focusStyle(cover)}>` : ''}
    <span class="cat-text"><strong>${escapeHtml(cat.label)}</strong><span>${escapeHtml(i18n.t(locale, 'home_cat_gifts', { count: cat.count, hint: cat.hint }))}</span></span>
  </a>`;
}

function homePage(locale) {
  const t = (key, vars) => i18n.t(locale, key, vars);
  const heroItems = ['groningen', 'luxembourg', 'sky-thermo-cup'].map((id) => inventory.getGift(id)).filter(Boolean);
  // Category tiles use each category's first photo, so the edit starts from the second.
  const inStock = inventory.ITEMS.filter((item) => item.stock > 0);
  const seconds = inventory.CATEGORIES.map((cat) => inStock.filter((item) => item.category === cat.id)[1]).filter(Boolean);
  const featured = seconds.concat(inStock.filter((item) => !seconds.includes(item)).slice(4)).slice(0, 8);
  return layout({
    title: t('home_title'),
    description: t('home_description'),
    active: 'home',
    locale,
    path: '/',
    footerLeft: t('footer_home_left'),
    footerRight: escapeHtml(t('footer_home_right')),
    body: `
    <section class="hero">
      <div class="hero-inner">
        <p class="eyebrow">${escapeHtml(t('home_eyebrow'))}</p>
        <h1>Glimty</h1>
        <p class="lede">${escapeHtml(t('home_lede'))}</p>
        <p>${escapeHtml(t('home_intro'))}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="/assistant?lang=${locale}">${escapeHtml(t('home_cta_gift'))}</a>
          <a class="btn btn-ghost" href="/shop?lang=${locale}">${escapeHtml(t('home_hero_shop'))}</a>
        </div>
      </div>
      <div class="hero-photos" aria-hidden="true">
        ${heroItems.map((item) => `<img src="${escapeHtml(item.image)}" alt="" width="1100" height="424">`).join('')}
      </div>
    </section>

    <section class="section" id="how">
      <h2>${escapeHtml(t('home_how_title'))}</h2>
      <p class="intro">${escapeHtml(t('home_how_intro'))}</p>
      <div class="steps">
        <article class="card">
          <div class="num">1</div>
          <h3>${escapeHtml(t('home_step1_title'))}</h3>
          <p>${escapeHtml(t('home_step1_body'))}</p>
        </article>
        <article class="card">
          <div class="num">2</div>
          <h3>${escapeHtml(t('home_step2_title'))}</h3>
          <p>${escapeHtml(t('home_step2_body'))}</p>
        </article>
        <article class="card">
          <div class="num">3</div>
          <h3>${escapeHtml(t('home_step3_title'))}</h3>
          <p>${escapeHtml(t('home_step3_body'))}</p>
        </article>
      </div>
    </section>

    <section class="section">
      <h2>${escapeHtml(t('home_cats_title'))}</h2>
      <p class="intro">${escapeHtml(t('home_cats_intro'))}</p>
      <div class="cats">${inventory.listCategories(locale).map((cat) => categoryTile(cat, locale)).join('')}</div>
    </section>

    <section class="section" id="gifts">
      <div class="section-head">
        <h2>${escapeHtml(t('home_featured_title'))}</h2>
        <a href="/shop?lang=${locale}">${escapeHtml(t('see_all', { count: inventory.ITEMS.length }))}</a>
      </div>
      <p class="intro">${escapeHtml(t('home_featured_intro'))}</p>
      <div class="shop-grid">${featured.map((item) => giftCard(item, locale)).join('')}</div>
    </section>

    <section class="section">
      <div class="split">
        <div>
          <p class="eyebrow">${escapeHtml(t('home_split_eyebrow'))}</p>
          <h2>${escapeHtml(t('home_split_title'))}</h2>
          <p>${escapeHtml(t('home_split_p1'))}</p>
          <p>${escapeHtml(t('home_split_p2'))}</p>
          <a class="btn btn-primary" href="/assistant?lang=${locale}">${escapeHtml(t('home_split_cta'))}</a>
        </div>
        <div class="card">
          <h3>${escapeHtml(t('home_try_title'))}</h3>
          <p>${escapeHtml(t('home_try_p1'))}</p>
          <p>${escapeHtml(t('home_try_p2'))}</p>
        </div>
      </div>
    </section>

    <section class="section" id="faq">
      <h2>${escapeHtml(t('home_faq_title'))}</h2>
      <div class="faq">
        <details open>
          <summary>${escapeHtml(t('home_faq1_q'))}</summary>
          <p>${escapeHtml(t('home_faq1_a'))}</p>
        </details>
        <details>
          <summary>${escapeHtml(t('home_faq2_q'))}</summary>
          <p>${escapeHtml(t('home_faq2_a'))}</p>
        </details>
        <details>
          <summary>${escapeHtml(t('home_faq3_q'))}</summary>
          <p>${escapeHtml(t('home_faq3_a'))}</p>
        </details>
        <details>
          <summary>${escapeHtml(t('home_faq4_q'))}</summary>
          <p>${escapeHtml(t('home_faq4_a'))}</p>
        </details>
      </div>
    </section>

`
    ,
    after: `
    <aside class="chat-bubble" id="nudge" hidden>
      <button class="nudge-close" type="button" data-close-nudge aria-label="${escapeHtml(t('nudge_close'))}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg></button>
      ${escapeHtml(t('home_nudge'))}
      <div><button type="button" data-open-chat>${escapeHtml(t('home_nudge_btn'))}</button></div>
    </aside>
    <button class="chat-launch" type="button" data-open-chat aria-label="${escapeHtml(t('home_open_chat'))}">G</button>

    <section class="widget" id="chat-widget" hidden>
      <div class="chat-head">
        <div>
          <strong>${escapeHtml(t('widget_name'))}</strong>
          <span>${escapeHtml(t('widget_sub'))}</span>
        </div>
        <div class="chat-head-tools">
          ${langSwitch(locale, '/')}
          <button class="icon-btn" type="button" data-close-chat aria-label="${escapeHtml(t('widget_close'))}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button>
        </div>
      </div>
      <div class="brief" data-brief></div>
      <div class="transcript" data-transcript></div>
      <form class="composer" data-composer>
        <label class="visually-hidden" for="widget-input">${escapeHtml(t('widget_placeholder'))}</label>
        <input id="widget-input" name="message" autocomplete="off" placeholder="${escapeHtml(t('widget_placeholder'))}">
        <button class="btn btn-primary" type="submit">${escapeHtml(t('assistant_send'))}</button>
      </form>
    </section>
    <script src="/js/chat.js"></script>
    <script src="/js/marketing.js"></script>`
  });
}

const SORTS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price
};

function matchesQuery(item, locale, needle) {
  const gift = inventory.publicGift(item, locale);
  const haystack = [gift.name, gift.blurb, gift.brand, gift.sku, i18n.categoryCopy(item.category, locale).label]
    .concat(gift.colors)
    .join(' ')
    .toLowerCase();
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

function shopPage(categoryId, locale, sort, search, budget) {
  const t = (key, vars) => i18n.t(locale, key, vars);
  const categories = inventory.listCategories(locale);
  const current = categoryId ? categories.find((cat) => cat.id === categoryId) : null;
  const sortId = SORTS[sort] ? sort : '';
  const q = typeof search === 'string' ? search.trim().slice(0, 60) : '';
  const inCategory = current ? inventory.getByCategory(current.id) : inventory.ITEMS;
  const band = Object.prototype.hasOwnProperty.call(inventory.BUDGETS, budget) ? inventory.BUDGETS[budget] : null;
  const inBand = (item, range) => item.price >= (range.min ?? 0) && item.price < (range.max ?? Infinity);
  const searched = q ? inCategory.filter((item) => matchesQuery(item, locale, q.toLowerCase())) : inCategory;
  const base = band ? searched.filter((item) => inBand(item, band)) : searched;
  const items = sortId ? [...base].sort(SORTS[sortId]) : base;
  const title = current ? t('shop_title_cat', { label: current.label }) : t('shop_title');
  const path = current ? `/shop/${current.id}` : '/shop';
  const query = (sortValue, keepSearch = true, budgetValue = band ? band.id : '') => (
    `?lang=${locale}${sortValue ? `&sort=${sortValue}` : ''}${budgetValue ? `&budget=${budgetValue}` : ''}${q && keepSearch ? `&q=${encodeURIComponent(q)}` : ''}`
  );
  const chip = (href, label, count, on) => (
    `<a class="filter${on ? ' is-on' : ''}" href="${href}"${on ? ' aria-current="page"' : ''}>${escapeHtml(label)} <span>${count}</span></a>`
  );
  const chips = [chip(`/shop${query(sortId)}`, t('shop_all', { count: '' }).trim(), inventory.ITEMS.length, !current)]
    .concat(categories.map((cat) => chip(`/shop/${cat.id}${query(sortId)}`, cat.label, cat.count, Boolean(current && current.id === cat.id))))
    .join('');
  // Tapping the active budget again clears it.
  const budgetChips = Object.values(inventory.BUDGETS).map((range) => {
    const on = Boolean(band && band.id === range.id);
    const count = searched.filter((item) => inBand(item, range)).length;
    if (!count && !on) return `<span class="filter filter-budget is-empty">${escapeHtml(t(`budget_${range.id}`))} <span>0</span></span>`;
    return `<a class="filter filter-budget${on ? ' is-on' : ''}" href="${path}${query(sortId, true, on ? '' : range.id)}"${on ? ' aria-current="true"' : ''}>${escapeHtml(t(`budget_${range.id}`))} <span>${count}</span></a>`;
  }).join('');
  const sortLink = (id, key) => (
    `<a class="${sortId === id ? 'is-on' : ''}" href="${path}${query(id)}"${sortId === id ? ' aria-current="true"' : ''}>${escapeHtml(t(key))}</a>`
  );
  const cards = items.map((item) => giftCard(item, locale));
  const help = `<aside class="shop-help">
      <h3>${escapeHtml(t('shop_help_title'))}</h3>
      <p>${escapeHtml(t('shop_help_body'))}</p>
      <a class="btn btn-primary" href="/assistant?lang=${locale}">${escapeHtml(t('nav_talk'))}</a>
    </aside>`;
  if (items.length) cards.splice(Math.min(6, cards.length), 0, help);
  const countLabel = q
    ? t('search_results', { count: items.length, q })
    : items.length === 1 ? t('shop_count_one') : t('shop_count', { count: items.length });
  const empty = `<div class="shop-empty">
      <h2>${escapeHtml(q ? t('search_none_title', { q }) : t('filter_none_title'))}</h2>
      <p>${escapeHtml(t('search_none_body'))}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/assistant?lang=${locale}">${escapeHtml(t('nav_talk'))}</a>
        <a class="btn btn-quiet" href="${path}${query(sortId, false, '')}">${escapeHtml(t('search_clear'))}</a>
      </div>
    </div>`;

  return layout({
    title,
    description: current ? current.hint : t('shop_meta'),
    active: 'shop',
    locale,
    path,
    body: `
    <section class="shop">
      <header class="shop-head">
        <h1>${current ? escapeHtml(current.label) : escapeHtml(t('shop_heading'))}</h1>
        <p class="intro">${current ? escapeHtml(current.hint) : escapeHtml(t('shop_intro', { count: inventory.ITEMS.length }))}</p>
        <form class="search" action="${path}" method="get" role="search">
          <input type="hidden" name="lang" value="${locale}">
          ${sortId ? `<input type="hidden" name="sort" value="${sortId}">` : ''}
          ${band ? `<input type="hidden" name="budget" value="${band.id}">` : ''}
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><path d="M13.5 13.5L17 17"/></svg>
          <label class="visually-hidden" for="shop-q">${escapeHtml(t('search_label'))}</label>
          <input id="shop-q" type="search" name="q" value="${escapeHtml(q)}" placeholder="${escapeHtml(t('search_placeholder'))}" autocomplete="off" maxlength="60">
          <button class="btn btn-dark" type="submit">${escapeHtml(t('search_submit'))}</button>
        </form>
      </header>
      <div class="shop-bar">
        <nav class="filters" aria-label="${escapeHtml(t('filters_label'))}">${chips}</nav>
        <nav class="filters filters-budget" aria-label="${escapeHtml(t('budget_label'))}">${budgetChips}</nav>
        <div class="sort">
          <span class="sort-count" aria-live="polite">${escapeHtml(countLabel)}</span>
          <span class="sort-links" role="group" aria-label="${escapeHtml(t('sort_label'))}">
            ${sortLink('', 'sort_featured')}${sortLink('price-asc', 'sort_price_asc')}${sortLink('price-desc', 'sort_price_desc')}
          </span>
        </div>
      </div>
      ${items.length ? `<div class="shop-grid">${cards.join('')}</div>` : empty}
    </section>`,
    after: `<script>document.querySelector('.filter.is-on')?.scrollIntoView({ inline: 'center', block: 'nearest' });</script>`
  });
}

function productPage(id, locale) {
  const item = inventory.getGift(id);
  if (!item) return null;
  const t = (key, vars) => i18n.t(locale, key, vars);
  const gift = inventory.publicGift(item, locale);
  const status = inventory.stockStatus(item);
  const statusLabel = status === 'out'
    ? t('stock_out')
    : status === 'low'
      ? t('stock_low_long', { count: item.stock })
      : t('stock_in_count', { count: item.stock });
  const category = i18n.categoryCopy(item.category, locale);
  const sameCategory = inventory.related(item.id, 4);
  // Small categories get topped up with the closest-priced gifts from the rest of the shop.
  const topUp = sameCategory.length >= 4 ? [] : inventory.ITEMS
    .filter((row) => row.id !== item.id && row.category !== item.category && row.stock > 0)
    .sort((a, b) => Math.abs(a.price - item.price) - Math.abs(b.price - item.price))
    .slice(0, 4 - sameCategory.length);
  const more = sameCategory.concat(topUp);
  // The English description already ends with the "why" line shown in its own block.
  const description = gift.description.endsWith(gift.why) && gift.description.length > gift.why.length
    ? gift.description.slice(0, -gift.why.length).trim()
    : gift.description;
  const swatches = item.colors.map((color, index) => (
    `<li><span class="swatch-dot" style="${swatchStyle(color)}"></span>${escapeHtml(gift.colors[index])}</li>`
  )).join('');

  return layout({
    title: `${gift.name} — Glimty`,
    description: gift.blurb,
    active: 'shop',
    locale,
    path: `/gift/${item.id}`,
    body: `
    <article class="product">
      <nav class="crumbs" aria-label="${escapeHtml(t('crumbs_label'))}">
        <a href="/shop?lang=${locale}">${escapeHtml(t('nav_shop'))}</a><span aria-hidden="true">/</span><a href="/shop/${item.category}?lang=${locale}">${escapeHtml(category.label)}</a>
      </nav>
      <img class="product-photo" src="${escapeHtml(gift.image)}" alt="${escapeHtml(gift.name)}" width="1100" height="424">
      <div class="product-grid">
        <div class="product-main">
          <p class="gift-brand">${escapeHtml(gift.brand)}</p>
          <h1>${escapeHtml(gift.name)}</h1>
          <p class="product-desc">${escapeHtml(description)}</p>
          <section class="why">
            <h2>${escapeHtml(t('why_title'))}</h2>
            <p>${escapeHtml(gift.why)}</p>
          </section>
          <section class="details">
            <h2>${escapeHtml(t('details_title'))}</h2>
            <dl>
              <div><dt>${escapeHtml(t('detail_brand'))}</dt><dd>${escapeHtml(gift.brand)}</dd></div>
              <div><dt>${escapeHtml(t('detail_sku'))}</dt><dd>${escapeHtml(gift.sku)}</dd></div>
              <div><dt>${escapeHtml(t('detail_category'))}</dt><dd><a href="/shop/${item.category}?lang=${locale}">${escapeHtml(category.label)}</a></dd></div>
              <div><dt>${escapeHtml(t('detail_source'))}</dt><dd class="source-note">${t('source_note', { url: escapeHtml(item.sourceUrl) })}</dd></div>
            </dl>
          </section>
        </div>
        <aside class="buybox">
          <p class="buybox-price">$${gift.price}</p>
          <p class="stock stock-${status}">${escapeHtml(statusLabel)}</p>
          ${swatches ? `<h2>${escapeHtml(t('colors_title'))}</h2><ul class="swatches">${swatches}</ul>` : ''}
          <a class="btn btn-primary btn-block" href="/assistant?lang=${locale}&gift=${encodeURIComponent(item.id)}">${escapeHtml(t('ask_about'))}</a>
          <a class="btn btn-quiet btn-block" href="/shop/${item.category}?lang=${locale}">${escapeHtml(t('more_cat', { label: category.label.toLowerCase() }))}</a>
        </aside>
      </div>
    </article>
    ${more.length ? `<section class="section">
      <h2>${escapeHtml(topUp.length ? t('also_like') : t('also_in', { label: category.label.toLowerCase() }))}</h2>
      <div class="shop-grid">${more.map((row) => giftCard(row, locale)).join('')}</div>
    </section>` : ''}
    <div class="buybar">
      <span><strong>$${gift.price}</strong><small class="stock stock-${status}">${escapeHtml(statusLabel)}</small></span>
      <a class="btn btn-primary" href="/assistant?lang=${locale}&gift=${encodeURIComponent(item.id)}">${escapeHtml(t('ask_short'))}</a>
    </div>`
  });
}

function assistantPage(locale, giftId) {
  const t = (key, vars) => i18n.t(locale, key, vars);
  const handed = giftId ? inventory.getGift(giftId) : null;
  const initialGift = handed ? { id: handed.id, name: inventory.publicGift(handed, locale).name } : null;
  return layout({
    title: t('assistant_title'),
    description: t('assistant_sub'),
    active: 'assistant',
    locale,
    path: '/assistant',
    extraNav: `<button class="btn btn-dark" type="button" id="start-over">${escapeHtml(t('nav_start_over'))}</button>`,
    body: `
    <section class="assistant-shell" id="assistant-root">
      <div class="chat-head">
        <div>
          <strong>${escapeHtml(t('assistant_head'))}</strong>
          <span>${escapeHtml(t('assistant_sub'))}</span>
        </div>
        <div class="chat-head-tools">
          ${langSwitch(locale, '/assistant')}
          <a class="icon-btn" href="/?lang=${locale}" aria-label="${escapeHtml(t('assistant_back'))}"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4"/></svg></a>
        </div>
      </div>
      <div class="brief" data-brief></div>
      <div class="transcript" data-transcript></div>
      <form class="composer" data-composer>
        <label class="visually-hidden" for="assistant-input">${escapeHtml(t('assistant_placeholder'))}</label>
        <input id="assistant-input" name="message" autocomplete="off" placeholder="${escapeHtml(t('assistant_placeholder'))}">
        <button class="btn btn-primary" type="submit">${escapeHtml(t('assistant_send'))}</button>
      </form>
    </section>
`,
    after: `
    <script src="/js/chat.js"></script>
    <script>
      const chat = GlimtyChat.mount(document.getElementById('assistant-root'), { storageKey: 'glimty.full', initialGift: ${JSON.stringify(initialGift).replace(/</g, '\\u003c')} });
      if (${Boolean(initialGift)}) history.replaceState(null, '', '/assistant?lang=${locale}');
      document.getElementById('start-over')?.addEventListener('click', () => {
        chat?.reset();
        window.location.reload();
      });
    </script>`
  });
}

function notFoundPage(locale) {
  const t = (key, vars) => i18n.t(locale, key, vars);
  const picks = inventory.CATEGORIES
    .map((cat) => inventory.getByCategory(cat.id).find((item) => item.stock > 0))
    .filter(Boolean)
    .slice(0, 4);
  return layout({
    title: t('not_found_title'),
    active: 'none',
    locale,
    path: '/',
    body: `
    <section class="lost">
      <h1>${escapeHtml(t('not_found_h1'))}</h1>
      <p>${escapeHtml(t('not_found_p'))}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/assistant?lang=${locale}">${escapeHtml(t('nav_talk'))}</a>
        <a class="btn btn-quiet" href="/shop?lang=${locale}">${escapeHtml(t('home_hero_shop'))}</a>
      </div>
    </section>
    <section class="section">
      <h2>${escapeHtml(t('not_found_popular'))}</h2>
      <div class="shop-grid">${picks.map((item) => giftCard(item, locale)).join('')}</div>
    </section>`
  });
}

module.exports = { shopPage, productPage, giftCard, homePage, assistantPage, notFoundPage, langSwitch };
