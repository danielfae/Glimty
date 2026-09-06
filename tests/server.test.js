'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const app = require('../server');

let server;
let base;

function request(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${base}${urlPath}`, {
      method,
      headers: body ? { 'content-type': 'application/json' } : {}
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed = data;
        try { parsed = JSON.parse(data); } catch (_err) { /* html */ }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

describe('http api', () => {
  before(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const { port } = server.address();
    base = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it('serves the marketing page', async () => {
    const res = await request('GET', '/');
    assert.equal(res.status, 200);
    assert.match(String(res.body), /Glimty/);
    assert.match(String(res.body), /gift assistant/i);
    assert.doesNotMatch(String(res.body), /messenger.com|Facebook Webhook/i);
  });

  it('serves the full assistant page', async () => {
    const res = await request('GET', '/assistant');
    assert.equal(res.status, 200);
    assert.match(String(res.body), /gift assistant/i);
  });

  it('returns the catalog', async () => {
    const res = await request('GET', '/api/catalog');
    assert.equal(res.status, 200);
    assert.ok(res.body.gifts.length >= 25);
    assert.ok(res.body.gifts.every((gift) => gift.image && gift.name && gift.price > 0));
    assert.ok(res.body.categories.length >= 5);
  });

  it('serves the shop and a product page with the you.no photo', async () => {
    const shop = await request('GET', '/shop');
    assert.equal(shop.status, 200);
    assert.match(String(shop.body), /The shop/);
    assert.match(String(shop.body), /Drinkware/);

    const drinkware = await request('GET', '/shop/drinkware');
    assert.equal(drinkware.status, 200);
    assert.match(String(drinkware.body), /Almere/);

    const product = await request('GET', '/gift/almere');
    assert.equal(product.status, 200);
    assert.match(String(product.body), /Almere recycled steel bottle/);
    assert.match(String(product.body), /\/images\/gifts\/5307-almere\.jpg/);
    assert.match(String(product.body), /you\.no/);
  });

  it('opens a chat session and continues it', async () => {
    const start = await request('POST', '/api/chat', {});
    assert.equal(start.status, 200);
    assert.ok(start.body.session.id);
    const next = await request('POST', '/api/chat', {
      sessionId: start.body.session.id,
      message: 'I need a gift for my mom'
    });
    assert.equal(next.status, 200);
    assert.equal(next.body.session.brief.recipient, 'parent');
    assert.ok(next.body.messages[0].text);
  });

  it('rejects a non-string message', async () => {
    const res = await request('POST', '/api/chat', { message: { nope: true } });
    assert.equal(res.status, 400);
  });
});
