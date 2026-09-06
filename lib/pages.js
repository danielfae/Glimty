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
  <div class="wrap">
    <header class="site-header">
      <a class="logo" href="/?lang=${locale}"><span class="mark">G</span> Glimty</a>
      <nav>
        <a class="${active === 'shop' ? 'is-on' : 'hide-sm'}" href="/shop?lang=${locale}">${escapeHtml(t('nav_shop'))}</a>
        <a class="hide-sm" href="/?lang=${locale}#how">${escapeHtml(t('nav_how'))}</a>
        ${extraNav || `<a class="btn btn-primary" href="/assistant?lang=${locale}">${escapeHtml(t('nav_talk'))}</a>`}
        ${langSwitch(locale, path)}
      </nav>
    </header>
    ${body}
    <footer>
      <div>${escapeHtml(footerLeft || t('footer_left'))}</div>
      <div>${footerRight || escapeHtml(t('footer_right'))}</div>
    </footer>
  </div>
  ${after || ''}
</body>
</html>`;
}

function giftCard(item, locale) {
  const gift = inventory.publicGift(item, locale);
  const status = inventory.stockStatus(item);
  const label = status === 'out'
    ? i18n.t(locale, 'stock_out')
    : status === 'low'
      ? i18n.t(locale, 'stock_low', { count: item.stock })
      : i18n.t(locale, 'stock_in');
  return `<a class="card gift" href="/gift/${escapeHtml(gift.id)}?lang=${locale}">
    <img class="gift-photo" src="${escapeHtml(gift.image)}" alt="${escapeHtml(gift.name)}">
    <div class="meta">
      <p class="eyebrow">${escapeHtml(gift.brand)} · ${escapeHtml(label)}</p>
      <h3>${escapeHtml(gift.name)}</h3>
      <p>${escapeHtml(gift.blurb)}</p>
      <p class="price">$${gift.price}</p>
    </div>
  </a>`;
}

function homePage(locale) {
  const t = (key, vars) => i18n.t(locale, key, vars);
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
          <button class="btn btn-ghost" type="button" data-open-chat>${escapeHtml(t('home_cta_hei'))}</button>
        </div>
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
      <div class="cats" id="categories"></div>
    </section>

    <section class="section" id="gifts">
      <h2>${escapeHtml(t('home_featured_title'))}</h2>
      <p class="intro">${escapeHtml(t('home_featured_intro'))}</p>
      <div class="cards" id="featured"></div>
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
        <div class="card" style="color: var(--ink);">
          <h3>${escapeHtml(t('home_try_title'))}</h3>
          <p>${escapeHtml(t('home_try_p1'))}</p>
          <p style="margin-top:14px">${escapeHtml(t('home_try_p2'))}</p>
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
    <aside class="chat-bubble" id="nudge">
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
          <button class="icon-btn" type="button" data-close-chat aria-label="${escapeHtml(t('widget_close'))}">×</button>
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

function shopPage(categoryId, locale) {
  const t = (key, vars) => i18n.t(locale, key, vars);
  const categories = inventory.listCategories(locale);
  const current = categoryId ? categories.find((cat) => cat.id === categoryId) : null;
  const items = current ? inventory.getByCategory(current.id) : inventory.ITEMS;
  const title = current ? t('shop_title_cat', { label: current.label }) : t('shop_title');
  const path = current ? `/shop/${current.id}` : '/shop';
  const chips = [`<a class="chip ${current ? '' : 'is-on'}" href="/shop?lang=${locale}">${escapeHtml(t('shop_all', { count: inventory.ITEMS.length }))}</a>`]
    .concat(categories.map((cat) => (
      `<a class="chip ${current && current.id === cat.id ? 'is-on' : ''}" href="/shop/${cat.id}?lang=${locale}">${escapeHtml(cat.label)} ${cat.count}</a>`
    )))
    .join('');

  return layout({
    title,
    description: current ? current.hint : t('shop_meta'),
    active: 'shop',
    locale,
    path,
    body: `
    <section class="section">
      <p class="eyebrow">${escapeHtml(t('shop_eyebrow'))}</p>
      <h2>${current ? escapeHtml(current.label) : escapeHtml(t('shop_heading'))}</h2>
      <p class="intro">${current ? escapeHtml(current.hint) : escapeHtml(t('shop_intro', { count: inventory.ITEMS.length }))}</p>
      <div class="replies shop-filters">${chips}</div>
      <div class="cards shop-grid">${items.map((item) => giftCard(item, locale)).join('')}</div>
    </section>`
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
  const more = inventory.related(item.id, 3);

  return layout({
    title: `${gift.name} — Glimty`,
    description: gift.blurb,
    active: 'shop',
    locale,
    path: `/gift/${item.id}`,
    body: `
    <article class="product">
      <p class="eyebrow"><a href="/shop?lang=${locale}">${escapeHtml(t('nav_shop'))}</a> / <a href="/shop/${item.category}?lang=${locale}">${escapeHtml(category.label)}</a></p>
      <div class="product-grid">
        <img class="product-photo" src="${escapeHtml(gift.image)}" alt="${escapeHtml(gift.name)}">
        <div>
          <p class="eyebrow">${escapeHtml(t('sku_line', { brand: gift.brand, sku: gift.sku }))}</p>
          <h1>${escapeHtml(gift.name)}</h1>
          <p class="lede">$${gift.price}</p>
          <p>${escapeHtml(gift.description)}</p>
          <p><strong>${escapeHtml(statusLabel)}</strong></p>
          <p>${escapeHtml(t('colors', { list: gift.colors.join(', ') }))}</p>
          <p class="intro">${escapeHtml(gift.why)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="/assistant?lang=${locale}">${escapeHtml(t('ask_about'))}</a>
            <a class="btn btn-dark" href="/shop/${item.category}?lang=${locale}">${escapeHtml(t('more_cat', { label: category.label.toLowerCase() }))}</a>
          </div>
          <p class="source-note">${t('source_note', { url: escapeHtml(item.sourceUrl) })}</p>
        </div>
      </div>
    </article>
    <section class="section">
      <h2>${escapeHtml(t('also_in', { label: category.label.toLowerCase() }))}</h2>
      <div class="cards shop-grid">${more.map((row) => giftCard(row, locale)).join('')}</div>
    </section>`
  });
}

function assistantPage(locale) {
  const t = (key, vars) => i18n.t(locale, key, vars);
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
          <a class="icon-btn" href="/?lang=${locale}" aria-label="${escapeHtml(t('assistant_back'))}">←</a>
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
      const chat = GlimtyChat.mount(document.getElementById('assistant-root'), { storageKey: 'glimty.full' });
      document.getElementById('start-over')?.addEventListener('click', () => {
        chat?.reset();
        window.location.reload();
      });
    </script>`
  });
}

function notFoundPage(locale) {
  const t = (key, vars) => i18n.t(locale, key, vars);
  return `<!DOCTYPE html>
<html lang="${locale === 'en' ? 'en' : 'nb'}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(t('not_found_title'))}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <div class="wrap" style="padding:80px 0">
    <a class="logo" href="/?lang=${locale}"><span class="mark">G</span> Glimty</a>
    <h1 style="font-family:Fraunces,serif">${escapeHtml(t('not_found_h1'))}</h1>
    <p>${escapeHtml(t('not_found_p'))}</p>
    <a class="btn btn-primary" href="/assistant?lang=${locale}">${escapeHtml(t('nav_talk'))}</a>
    ${langSwitch(locale, '/')}
  </div>
</body>
</html>`;
}

module.exports = { shopPage, productPage, giftCard, homePage, assistantPage, notFoundPage, langSwitch };
