'use strict';

const crypto = require('crypto');

const STORE = new Map();
const MAX_AGE_MS = 1000 * 60 * 60 * 12;

function createId() {
  return crypto.randomBytes(16).toString('hex');
}

function freshSession(id, locale) {
  return {
    id,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    locale: locale || 'nb',
    step: 'welcome',
    intent: null,
    brief: {
      recipient: null,
      occasion: null,
      budget: null,
      interests: [],
      notes: ''
    },
    recommendedIds: [],
    selectedGiftId: null,
    wrapping: {
      note: '',
      delivery: null
    },
    planner: [],
    messages: []
  };
}

function get(id, locale) {
  prune();
  if (!id || !STORE.has(id)) {
    const session = freshSession(createId(), locale);
    STORE.set(session.id, session);
    return session;
  }
  const session = STORE.get(id);
  session.updatedAt = Date.now();
  return session;
}

function save(session) {
  session.updatedAt = Date.now();
  STORE.set(session.id, session);
  return session;
}

function reset(id, locale) {
  const prev = id ? STORE.get(id) : null;
  const session = freshSession(id || createId(), locale || prev?.locale || 'nb');
  STORE.set(session.id, session);
  return session;
}

function prune() {
  const now = Date.now();
  for (const [id, session] of STORE) {
    if (now - session.updatedAt > MAX_AGE_MS) STORE.delete(id);
  }
}

module.exports = { get, save, reset, createId };
