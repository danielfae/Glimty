'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const assistant = require('./lib/assistant');
const catalog = require('./lib/catalog');
const pages = require('./lib/pages');
const i18n = require('./lib/i18n');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(compression());
app.use(express.json({ limit: '32kb' }));

function withLocale(req, res, next) {
  const locale = i18n.resolveLocale(req);
  req.locale = locale;
  res.setHeader('Set-Cookie', i18n.localeCookie(locale));
  next();
}

app.use(withLocale);

app.get('/', (req, res) => {
  res.type('html').send(pages.homePage(req.locale));
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'glimty-assistant' });
});

app.get('/api/catalog', (req, res) => {
  res.json({
    locale: req.locale,
    gifts: catalog.listGifts(req.locale),
    categories: catalog.listCategories(req.locale),
    ui: i18n.uiPack(req.locale)
  });
});

app.get('/api/inventory/:id', (req, res) => {
  const item = catalog.getGift(req.params.id, req.locale);
  if (!item) return res.status(404).json({ error: 'Gift not found' });
  res.json({ locale: req.locale, gift: item });
});

app.post('/api/chat', (req, res) => {
  const { sessionId, message, payload, locale } = req.body || {};
  if (message != null && typeof message !== 'string') {
    return res.status(400).json({ error: 'message must be a string' });
  }
  if (payload != null && typeof payload !== 'string') {
    return res.status(400).json({ error: 'payload must be a string' });
  }
  if (message && message.length > 2000) {
    return res.status(400).json({ error: 'message is too long' });
  }

  const resolved = locale ? i18n.normalizeLocale(locale) : req.locale;
  res.setHeader('Set-Cookie', i18n.localeCookie(resolved));

  const result = assistant.handle({
    sessionId: typeof sessionId === 'string' ? sessionId : undefined,
    message,
    payload,
    locale: resolved
  });
  res.json({ ...result, ui: i18n.uiPack(result.session.locale) });
});

app.get('/assistant', (req, res) => {
  res.type('html').send(pages.assistantPage(req.locale));
});

app.get('/shop', (req, res) => {
  res.type('html').send(pages.shopPage(undefined, req.locale));
});

app.get('/shop/:category', (req, res) => {
  const known = catalog.listCategories().some((cat) => cat.id === req.params.category);
  if (!known) return res.status(404).type('html').send(pages.notFoundPage(req.locale));
  res.type('html').send(pages.shopPage(req.params.category, req.locale));
});

app.get('/gift/:id', (req, res) => {
  const html = pages.productPage(req.params.id, req.locale);
  if (!html) return res.status(404).type('html').send(pages.notFoundPage(req.locale));
  res.type('html').send(html);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(404).type('html').send(pages.notFoundPage(req.locale || i18n.DEFAULT_LOCALE));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our side.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Glimty listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
