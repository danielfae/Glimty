'use strict';

const inventory = require('./inventory');

module.exports = {
  GIFTS: inventory.ITEMS,
  CATEGORIES: inventory.CATEGORIES,
  BUDGETS: inventory.BUDGETS,
  listGifts: inventory.listGifts,
  listCategories: inventory.listCategories,
  getGift: (id, locale) => {
    const item = inventory.getGift(id);
    return item ? inventory.publicGift(item, locale) : null;
  },
  getByCategory: inventory.getByCategory,
  related: inventory.related,
  recommend: inventory.recommend,
  publicGift: inventory.publicGift,
  stockStatus: inventory.stockStatus,
  featuredByCategory: inventory.featuredByCategory
};
