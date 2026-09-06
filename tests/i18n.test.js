'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const i18n = require('../lib/i18n');
const inventory = require('../lib/inventory');

describe('i18n', () => {
  it('defaults to Norwegian', () => {
    assert.equal(i18n.DEFAULT_LOCALE, 'nb');
    assert.equal(i18n.normalizeLocale('no'), 'nb');
    assert.equal(i18n.normalizeLocale('en-US'), 'en');
    assert.match(i18n.t('nb', 'nav_shop'), /Butikk/);
    assert.match(i18n.t('en', 'nav_shop'), /Shop/);
  });

  it('localizes every gift into Norwegian', () => {
    for (const item of inventory.ITEMS) {
      const nb = inventory.publicGift(item, 'nb');
      const en = inventory.publicGift(item, 'en');
      assert.ok(nb.name);
      assert.ok(en.name);
      assert.equal(en.name, item.name);
      assert.ok(i18n.PRODUCTS[item.id], `missing nb copy for ${item.id}`);
    }
  });

  it('localizes category labels', () => {
    const cats = inventory.listCategories('nb');
    assert.ok(cats.some((cat) => cat.id === 'drinkware' && cat.label === 'Drikke'));
    const en = inventory.listCategories('en');
    assert.ok(en.some((cat) => cat.id === 'drinkware' && cat.label === 'Drinkware'));
  });
});
