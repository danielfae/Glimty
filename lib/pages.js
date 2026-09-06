'use strict';

const inventory = require('./inventory');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function layout({ title, description, active, body }) {
  return `<!DOCTYPE html>
<html lang="en">
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
</head>
<body>
  <div class="wrap">
    <header class="site-header">
      <a class="logo" href="/"><span class="mark">G</span> Glimty</a>
      <nav>
        <a class="${active === 'shop' ? 'is-on' : 'hide-sm'}" href="/shop">Shop</a>
        <a class="hide-sm" href="/#how">How it works</a>
        <a class="btn btn-primary" href="/assistant">Talk to Glimty</a>
      </nav>
    </header>
    ${body}
    <footer>
      <div>Glimty — gifts from the You Brands catalog.</div>
      <div>Photos and product copy sourced from you.no. Inventory is held by Glimty.</div>
    </footer>
  </div>
</body>
</html>`;
}

function giftCard(item) {
  const status = inventory.stockStatus(item);
  const label = status === 'out' ? 'Sold out' : status === 'low' ? `${item.stock} left` : 'In stock';
  return `<a class="card gift" href="/gift/${escapeHtml(item.id)}">
    <img class="gift-photo" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
    <div class="meta">
      <p class="eyebrow">${escapeHtml(item.brand)} · ${escapeHtml(label)}</p>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.blurb)}</p>
      <p class="price">$${item.price}</p>
    </div>
  </a>`;
}

function shopPage(categoryId) {
  const categories = inventory.listCategories();
  const current = categoryId ? categories.find((cat) => cat.id === categoryId) : null;
  const items = current ? inventory.getByCategory(current.id) : inventory.ITEMS;
  const title = current ? `${current.label} — Glimty shop` : 'Shop — Glimty';
  const chips = [`<a class="chip ${current ? '' : 'is-on'}" href="/shop">All ${inventory.ITEMS.length}</a>`]
    .concat(categories.map((cat) => (
      `<a class="chip ${current && current.id === cat.id ? 'is-on' : ''}" href="/shop/${cat.id}">${escapeHtml(cat.label)} ${cat.count}</a>`
    )))
    .join('');

  return layout({
    title,
    description: current ? current.hint : 'Gifts from the You Brands catalog, held in Glimty inventory.',
    active: 'shop',
    body: `
    <section class="section">
      <p class="eyebrow">Inventory</p>
      <h2>${current ? escapeHtml(current.label) : 'The shop'}</h2>
      <p class="intro">${current ? escapeHtml(current.hint) : `${inventory.ITEMS.length} gifts photographed from you.no — bottles, packs, Lexington terry, Iittala, Georg Jensen, and Gerber.`}</p>
      <div class="replies shop-filters">${chips}</div>
      <div class="cards shop-grid">${items.map(giftCard).join('')}</div>
    </section>`
  });
}

function productPage(id) {
  const item = inventory.getGift(id);
  if (!item) return null;
  const status = inventory.stockStatus(item);
  const statusLabel = status === 'out' ? 'Sold out' : status === 'low' ? `Low stock — ${item.stock} left` : `${item.stock} in stock`;
  const category = inventory.CATEGORIES.find((cat) => cat.id === item.category);
  const more = inventory.related(item.id, 3);

  return layout({
    title: `${item.name} — Glimty`,
    description: item.blurb,
    active: 'shop',
    body: `
    <article class="product">
      <p class="eyebrow"><a href="/shop">Shop</a> / <a href="/shop/${item.category}">${escapeHtml(category.label)}</a></p>
      <div class="product-grid">
        <img class="product-photo" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
        <div>
          <p class="eyebrow">${escapeHtml(item.brand)} · SKU ${escapeHtml(item.sku)}</p>
          <h1>${escapeHtml(item.name)}</h1>
          <p class="lede">$${item.price}</p>
          <p>${escapeHtml(item.description)}</p>
          <p><strong>${escapeHtml(statusLabel)}</strong></p>
          <p>Colors: ${escapeHtml(item.colors.join(', '))}</p>
          <p class="intro">${escapeHtml(item.why)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="/assistant">Ask Glimty about this gift</a>
            <a class="btn btn-dark" href="/shop/${item.category}">More ${escapeHtml(category.label.toLowerCase())}</a>
          </div>
          <p class="source-note">From the You Brands catalog. <a href="${escapeHtml(item.sourceUrl)}">View on you.no</a></p>
        </div>
      </div>
    </article>
    <section class="section">
      <h2>Also in ${escapeHtml(category.label.toLowerCase())}</h2>
      <div class="cards shop-grid">${more.map(giftCard).join('')}</div>
    </section>`
  });
}

module.exports = { shopPage, productPage, giftCard };
