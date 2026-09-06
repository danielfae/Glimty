'use strict';

const GIFTS = [
  {
    id: 'linen-throw',
    name: 'Sunset linen throw',
    price: 68,
    category: 'interior',
    blurb: 'A heavyweight linen blanket in warm terracotta — the kind of home gift people actually keep out.',
    why: 'Feels considered, not generic. Works for housewarmings and “just because.”',
    tags: ['home', 'interior', 'cozy', 'neutral', 'adult'],
    occasions: ['birthday', 'housewarming', 'holiday', 'just-because', 'thank-you'],
    recipients: ['partner', 'parent', 'friend', 'colleague']
  },
  {
    id: 'ceramic-pourer',
    name: 'Hand-thrown pour-over set',
    price: 54,
    category: 'interior',
    blurb: 'A stoneware dripper and two cups from a small Oslo studio.',
    why: 'For anyone who treats morning coffee like a ritual.',
    tags: ['coffee', 'home', 'craft', 'food'],
    occasions: ['birthday', 'thank-you', 'holiday', 'just-because'],
    recipients: ['partner', 'friend', 'colleague', 'parent']
  },
  {
    id: 'wildflower-bundle',
    name: 'Seasonal wildflower wrap',
    price: 42,
    category: 'flowers',
    blurb: 'A loosely tied bouquet of whatever is in season — no stiff supermarket roses.',
    why: 'Romantic without trying too hard. Arrives looking freshly gathered.',
    tags: ['flowers', 'romantic', 'fresh'],
    occasions: ['anniversary', 'just-because', 'thank-you', 'birthday'],
    recipients: ['partner', 'parent', 'friend']
  },
  {
    id: 'dinner-voucher',
    name: 'Chef’s table for two',
    price: 160,
    category: 'experiences',
    blurb: 'A tasting-menu evening at a neighborhood restaurant, booked for them.',
    why: 'The gift is a night together, not another object on a shelf.',
    tags: ['experience', 'romantic', 'food', 'dinner'],
    occasions: ['anniversary', 'birthday', 'holiday'],
    recipients: ['partner']
  },
  {
    id: 'cabin-night',
    name: 'Fjord cabin night',
    price: 190,
    category: 'experiences',
    blurb: 'One night in a small waterside cabin with breakfast waiting in a hamper.',
    why: 'A reset button. Easy to give, hard to forget.',
    tags: ['experience', 'outdoors', 'travel', 'romantic'],
    occasions: ['anniversary', 'birthday', 'holiday'],
    recipients: ['partner', 'friend', 'parent']
  },
  {
    id: 'wool-scarf',
    name: 'Undyed merino scarf',
    price: 78,
    category: 'clothing',
    blurb: 'Soft Norwegian merino, no logo, a color that works with everything they already own.',
    why: 'Wearable, warm, and not a trend they will outgrow in a season.',
    tags: ['style', 'clothing', 'winter', 'neutral'],
    occasions: ['birthday', 'holiday', 'thank-you'],
    recipients: ['partner', 'parent', 'friend', 'colleague']
  },
  {
    id: 'leather-card',
    name: 'Vegetable-tanned card sleeve',
    price: 46,
    category: 'clothing',
    blurb: 'A slim sleeve that ages dark where their hands touch it.',
    why: 'Small enough for a colleague, handsome enough for someone you love.',
    tags: ['style', 'leather', 'practical'],
    occasions: ['birthday', 'thank-you', 'holiday'],
    recipients: ['partner', 'friend', 'colleague', 'parent']
  },
  {
    id: 'record-player',
    name: 'Compact vinyl player',
    price: 145,
    category: 'electronics',
    blurb: 'A clean, living-room player that does not look like a gadget.',
    why: 'For the friend who still talks about albums, not playlists.',
    tags: ['music', 'tech', 'home'],
    occasions: ['birthday', 'holiday'],
    recipients: ['partner', 'friend']
  },
  {
    id: 'ebook-light',
    name: 'Paper-warm reading lamp',
    price: 52,
    category: 'electronics',
    blurb: 'A clip lamp with a paper-like glow for late chapters in bed.',
    why: 'Quiet luxury for readers. Useful the first night they unwrap it.',
    tags: ['books', 'tech', 'home', 'cozy'],
    occasions: ['birthday', 'holiday', 'just-because'],
    recipients: ['partner', 'parent', 'friend']
  },
  {
    id: 'spice-set',
    name: 'Nordic pantry spice chest',
    price: 38,
    category: 'gifts',
    blurb: 'Six small-batch spices with a handwritten card on how to use them this week.',
    why: 'A host gift that does not become another candle.',
    tags: ['food', 'home', 'practical'],
    occasions: ['housewarming', 'thank-you', 'holiday', 'just-because'],
    recipients: ['friend', 'colleague', 'parent', 'partner']
  },
  {
    id: 'sketch-kit',
    name: 'Pocket watercolor kit',
    price: 36,
    category: 'gifts',
    blurb: 'Travel tins, a brush that holds water, and a stitched sketch book.',
    why: 'For the person who doodles on receipts and never buys art supplies for themselves.',
    tags: ['art', 'creative', 'travel'],
    occasions: ['birthday', 'just-because', 'thank-you'],
    recipients: ['friend', 'partner', 'kid']
  },
  {
    id: 'kids-fort',
    name: 'Canvas fort kit',
    price: 64,
    category: 'gifts',
    blurb: 'Poles, clips, and a washable canvas that turns a living room into a hideout.',
    why: 'A gift kids use the same afternoon — and parents do not hate looking at.',
    tags: ['kids', 'play', 'home'],
    occasions: ['birthday', 'holiday'],
    recipients: ['kid']
  },
  {
    id: 'tea-ritual',
    name: 'Evening tea ritual',
    price: 32,
    category: 'gifts',
    blurb: 'Three loose teas, a strainer, and a short note on slowing down after dinner.',
    why: 'Gentle, inexpensive, and hard to get wrong.',
    tags: ['wellness', 'food', 'cozy'],
    occasions: ['thank-you', 'just-because', 'birthday', 'holiday'],
    recipients: ['colleague', 'friend', 'parent', 'partner']
  },
  {
    id: 'garden-shears',
    name: 'Japanese garden shears',
    price: 58,
    category: 'gifts',
    blurb: 'Carbon-steel snips in a canvas holster for the person always pruning something.',
    why: 'Specific, useful, and nicer than another pot plant.',
    tags: ['outdoors', 'garden', 'practical'],
    occasions: ['birthday', 'housewarming', 'thank-you'],
    recipients: ['parent', 'friend', 'partner']
  },
  {
    id: 'scent-cedar',
    name: 'Cedar & smoke candle',
    price: 28,
    category: 'gifts',
    blurb: 'A small-batch soy candle that smells like a cabin, not a bakery.',
    why: 'When the budget is tight but the note still needs to feel personal.',
    tags: ['home', 'scent', 'cozy'],
    occasions: ['thank-you', 'just-because', 'holiday', 'housewarming'],
    recipients: ['colleague', 'friend', 'parent', 'partner']
  },
  {
    id: 'watch-cap',
    name: 'Fisherman watch cap',
    price: 34,
    category: 'clothing',
    blurb: 'A dense knit beanie that holds its shape after a winter of pockets and rain.',
    why: 'Everyday, unfussy, and a safe hit for almost any adult.',
    tags: ['style', 'winter', 'practical'],
    occasions: ['birthday', 'holiday', 'just-because'],
    recipients: ['partner', 'friend', 'parent', 'colleague']
  }
];

const CATEGORIES = [
  { id: 'clothing', label: 'Clothes', hint: 'Pieces they will actually wear' },
  { id: 'interior', label: 'Home', hint: 'Objects that settle into a room' },
  { id: 'flowers', label: 'Flowers', hint: 'Seasonal, loosely wrapped' },
  { id: 'experiences', label: 'Experiences', hint: 'Tables, cabins, nights out' },
  { id: 'electronics', label: 'Sound & light', hint: 'Quiet tech, not gadgets' },
  { id: 'gifts', label: 'Small gifts', hint: 'Host presents and just-because' }
];

const BUDGETS = {
  modest: { id: 'modest', label: 'Under $40', max: 40 },
  mid: { id: 'mid', label: '$40–80', min: 40, max: 80 },
  generous: { id: 'generous', label: '$80–150', min: 80, max: 150 },
  open: { id: 'open', label: '$150+', min: 150 }
};

function listGifts() {
  return GIFTS.map(publicGift);
}

function listCategories() {
  return CATEGORIES;
}

function getGift(id) {
  const gift = GIFTS.find((item) => item.id === id);
  return gift ? publicGift(gift) : null;
}

function publicGift(gift) {
  return {
    id: gift.id,
    name: gift.name,
    price: gift.price,
    category: gift.category,
    blurb: gift.blurb,
    why: gift.why
  };
}

function scoreGift(gift, brief) {
  let score = 0;
  if (brief.recipient && gift.recipients.includes(brief.recipient)) score += 4;
  if (brief.occasion && gift.occasions.includes(brief.occasion)) score += 3;
  if (brief.interests && brief.interests.length) {
    const hits = brief.interests.filter((tag) => gift.tags.includes(tag)).length;
    score += hits * 2;
  }
  if (brief.budget) {
    const band = BUDGETS[brief.budget];
    if (band) {
      const min = band.min ?? 0;
      const max = band.max ?? Infinity;
      if (gift.price >= min && gift.price <= max) score += 3;
      else score -= 2;
    }
  }
  return score;
}

function recommend(brief, limit = 3, excludeIds = []) {
  const excluded = new Set(excludeIds);
  return GIFTS
    .filter((gift) => !excluded.has(gift.id))
    .map((gift) => ({ gift, score: scoreGift(gift, brief) }))
    .sort((a, b) => b.score - a.score || a.gift.price - b.gift.price)
    .slice(0, limit)
    .map((entry) => publicGift(entry.gift));
}

module.exports = {
  GIFTS,
  CATEGORIES,
  BUDGETS,
  listGifts,
  listCategories,
  getGift,
  recommend
};
