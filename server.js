'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const assistant = require('./lib/assistant');
const catalog = require('./lib/catalog');
const pages = require('./lib/pages');

const app = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(compression());
app.use(express.json({ limit: '32kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'glimty-assistant' });
});

app.get('/api/catalog', (_req, res) => {
  res.json({
    gifts: catalog.listGifts(),
    categories: catalog.listCategories()
  });
});

app.get('/api/inventory/:id', (req, res) => {
  const item = catalog.getGift(req.params.id);
  if (!item) return res.status(404).json({ error: 'Gift not found' });
  res.json({ gift: item });
});

app.post('/api/chat', (req, res) => {
  const { sessionId, message, payload } = req.body || {};
  if (message != null && typeof message !== 'string') {
    return res.status(400).json({ error: 'message must be a string' });
  }
  if (payload != null && typeof payload !== 'string') {
    return res.status(400).json({ error: 'payload must be a string' });
  }
  if (message && message.length > 2000) {
    return res.status(400).json({ error: 'message is too long' });
  }

  const result = assistant.handle({
    sessionId: typeof sessionId === 'string' ? sessionId : undefined,
    message,
    payload
  });
  res.json(result);
});

app.get('/assistant', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assistant.html'));
});

app.get('/shop', (_req, res) => {
  res.type('html').send(pages.shopPage());
});

app.get('/shop/:category', (req, res) => {
  const known = catalog.listCategories().some((cat) => cat.id === req.params.category);
  if (!known) return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  res.type('html').send(pages.shopPage(req.params.category));
});

app.get('/gift/:id', (req, res) => {
  const html = pages.productPage(req.params.id);
  if (!html) return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  res.type('html').send(html);
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
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
