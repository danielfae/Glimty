'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const inventory = require('../lib/inventory');

describe('inventory', () => {
  it('holds at least 25 distinct gifts with photos on disk', () => {
    assert.ok(inventory.ITEMS.length >= 25);
    const ids = new Set(inventory.ITEMS.map((item) => item.id));
    assert.equal(ids.size, inventory.ITEMS.length);
    for (const item of inventory.ITEMS) {
      assert.ok(item.image.startsWith('/images/gifts/'));
      const file = path.join(__dirname, '..', 'public', item.image);
      assert.ok(fs.existsSync(file), `missing ${item.image}`);
      assert.ok(fs.statSync(file).size > 10000, `tiny ${item.image}`);
      assert.ok(item.stock >= 0);
      assert.ok(item.category);
      assert.ok(item.brand);
    }
  });

  it('groups gifts into named categories', () => {
    const cats = inventory.listCategories();
    assert.ok(cats.every((cat) => cat.count > 0));
    assert.equal(
      cats.reduce((sum, cat) => sum + cat.count, 0),
      inventory.ITEMS.length
    );
    assert.ok(inventory.getByCategory('drinkware').length >= 5);
    assert.ok(inventory.getGift('almere').sourceUrl.includes('you.no'));
  });

  it('features one gift from each category first', () => {
    const featured = inventory.featuredByCategory('en', 6);
    const cats = featured.map((gift) => gift.category);
    assert.equal(new Set(cats).size, cats.length);
    assert.ok(cats.includes('drinkware'));
    assert.ok(cats.some((id) => id !== 'drinkware'));
  });
});
