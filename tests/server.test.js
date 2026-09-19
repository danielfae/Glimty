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

  it('serves the marketing page in Norwegian by default', async () => {
    const res = await request('GET', '/');
    assert.equal(res.status, 200);
    assert.match(String(res.body), /Glimty/);
    assert.match(String(res.body), /gaveassistent/i);
    assert.match(String(res.body), /lang="nb"/);
    assert.doesNotMatch(String(res.body), /messenger.com|Facebook Webhook/i);
  });

  it('serves the marketing page in English when asked', async () => {
    const res = await request('GET', '/?lang=en');
    assert.equal(res.status, 200);
    assert.match(String(res.body), /gift assistant/i);
    assert.match(String(res.body), /lang="en"/);
  });

  it('serves the full assistant page', async () => {
    const res = await request('GET', '/assistant');
    assert.equal(res.status, 200);
    assert.match(String(res.body), /gaveassistent/i);
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
    assert.match(String(shop.body), /Butikken/);
    assert.match(String(shop.body), /Drikke/);

    const drinkware = await request('GET', '/shop/drinkware');
    assert.equal(drinkware.status, 200);
    assert.match(String(drinkware.body), /Almere/);

    const product = await request('GET', '/gift/almere');
    assert.equal(product.status, 200);
    assert.match(String(product.body), /Almere flaske i resirkulert stål/);
    assert.match(String(product.body), /\/images\/gifts\/5307-almere\.jpg/);
    assert.match(String(product.body), /you\.no/);

    const data = JSON.parse(String(product.body).match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(data['@type'], 'Product');
    assert.equal(data.offers.price, 38);
    assert.match(data.image, /^http.*5307-almere\.jpg$/);
    assert.match(String(product.body), /property="og:image" content="http/);
  });

  it('searches and sorts the shop', async () => {
    const hits = await request('GET', '/shop?q=georg+jensen');
    assert.equal(hits.status, 200);
    assert.match(String(hits.body), /Sky termokopp/);
    assert.doesNotMatch(String(hits.body), /Almere/);

    const none = await request('GET', '/shop?q=xyzzy');
    assert.equal(none.status, 200);
    assert.match(String(none.body), /Ingen gaver passer/);

    const modest = String((await request('GET', '/shop?budget=modest')).body);
    const modestPrices = [...modest.matchAll(/class="price">\$(\d+)/g)].map((m) => Number(m[1]));
    assert.ok(modestPrices.length > 0 && modestPrices.every((price) => price < 40));
    assert.equal((await request('GET', '/shop?budget=__proto__')).status, 200);

    const sorted = String((await request('GET', '/shop?sort=price-asc')).body);
    const prices = [...sorted.matchAll(/class="price">\$(\d+)/g)].map((m) => Number(m[1]));
    assert.ok(prices.length >= 25);
    assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
  });

  it('renders gift cards for the recently-viewed row', async () => {
    const res = await request('GET', '/fragments/gifts?ids=almere,nope,%3Cx%3E,bree');
    assert.equal(res.status, 200);
    assert.equal((String(res.body).match(/class="gift"/g) || []).length, 2);
    assert.doesNotMatch(String(res.body), /<x>/);
  });

  it('hands a product over to the assistant and ignores unknown gifts', async () => {
    const product = await request('GET', '/gift/almere');
    assert.match(String(product.body), /\/assistant\?lang=nb&gift=almere/);
    const handed = await request('GET', '/assistant?gift=almere');
    assert.match(String(handed.body), /initialGift: \{"id":"almere"/);
    const unknown = await request('GET', '/assistant?gift=%3Cscript%3E');
    assert.match(String(unknown.body), /initialGift: null/);
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
