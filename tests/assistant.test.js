'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const assistant = require('../lib/assistant');
const catalog = require('../lib/catalog');

describe('extractBrief', () => {
  it('reads recipient, occasion, and budget from a sentence', () => {
    const brief = assistant.extractBrief('I need a gift for my girlfriend, anniversary, around $160');
    assert.equal(brief.recipient, 'partner');
    assert.equal(brief.occasion, 'anniversary');
    assert.equal(brief.budget, 'open');
  });

  it('detects wrapping and planner intents', () => {
    assert.equal(assistant.detectIntent('Can you wrap this and send it?'), 'wrapping');
    assert.equal(assistant.detectIntent('Add this to my gift planner'), 'planner');
    assert.equal(assistant.detectIntent('I need a present'), 'need_gift');
  });
});

describe('catalog.recommend', () => {
  it('prefers partner anniversary gifts inside a high budget', () => {
    const picks = catalog.recommend({
      recipient: 'partner',
      occasion: 'anniversary',
      budget: 'open',
      interests: ['experience', 'food']
    }, 3);
    assert.ok(picks.length === 3);
    assert.ok(picks.some((gift) => gift.id === 'dinner-voucher' || gift.id === 'cabin-night'));
  });

  it('keeps modest picks under $40', () => {
    const picks = catalog.recommend({
      recipient: 'colleague',
      occasion: 'thank-you',
      budget: 'modest',
      interests: ['home']
    }, 3);
    assert.ok(picks.every((gift) => gift.price < 40));
  });
});

describe('assistant conversation', () => {
  it('opens with a welcome and does not loop it on the next turn', () => {
    const first = assistant.handle({});
    assert.ok(first.session.id);
    assert.match(first.messages[0].text, /personal gift assistant/);
    assert.ok(first.messages[0].buttons.length >= 3);

    const second = assistant.handle({
      sessionId: first.session.id,
      message: 'I need a gift for my girlfriend'
    });
    assert.ok(second.messages.every((msg) => !/What do you need today/.test(msg.text)));
    assert.equal(second.session.brief.recipient, 'partner');
    assert.ok(second.messages[0].text.includes('occasion') || second.messages[0].gifts);
  });

  it('walks button payloads through to recommendations', () => {
    let state = assistant.handle({});
    const id = state.session.id;
    state = assistant.handle({ sessionId: id, payload: 'intent:need_gift' });
    state = assistant.handle({ sessionId: id, payload: 'recipient:parent' });
    state = assistant.handle({ sessionId: id, payload: 'occasion:birthday' });
    state = assistant.handle({ sessionId: id, payload: 'budget:mid' });
    state = assistant.handle({ sessionId: id, payload: 'interest:home' });
    state = assistant.handle({ sessionId: id, payload: 'interests:done' });
    assert.equal(state.session.step, 'recommend');
    assert.ok(state.messages[0].gifts.length >= 1);
    assert.ok(state.messages[0].gifts.length <= 3);
  });

  it('skips ahead when a single message already has the brief', () => {
    const opened = assistant.handle({});
    const result = assistant.handle({
      sessionId: opened.session.id,
      message: 'Gift for my dad, birthday, budget $50, he loves gardening'
    });
    assert.equal(result.session.brief.recipient, 'parent');
    assert.equal(result.session.brief.occasion, 'birthday');
    assert.equal(result.session.brief.budget, 'mid');
    assert.ok(result.session.brief.interests.includes('outdoors'));
    assert.ok(result.messages[0].gifts?.length);
  });

  it('records a planner entry from a short line', () => {
    const opened = assistant.handle({});
    assistant.handle({ sessionId: opened.session.id, payload: 'intent:planner' });
    const result = assistant.handle({
      sessionId: opened.session.id,
      message: 'Mom, birthday, June 12'
    });
    assert.equal(result.session.planner.length, 1);
    assert.equal(result.session.planner[0].who, 'Mom');
    assert.match(result.session.planner[0].when, /June 12/);
  });

  it('chooses a gift and can take a wrapping note', () => {
    const opened = assistant.handle({});
    const id = opened.session.id;
    assistant.handle({
      sessionId: id,
      message: 'Gift for my girlfriend, anniversary, $160, dinner'
    });
    const chosen = assistant.handle({ sessionId: id, payload: 'choose:dinner-voucher' });
    assert.equal(chosen.session.selectedGiftId, 'dinner-voucher');
    assistant.handle({ sessionId: id, payload: 'intent:wrapping' });
    assistant.handle({ sessionId: id, payload: 'wrap:recipient' });
    const wrapped = assistant.handle({ sessionId: id, message: 'Happy anniversary — table for two is on me.' });
    assert.equal(wrapped.session.wrapping.note, 'Happy anniversary — table for two is on me.');
    assert.match(wrapped.messages[0].text, /Card noted/);
  });

  it('reset returns a new welcome on the same session id', () => {
    const opened = assistant.handle({});
    assistant.handle({ sessionId: opened.session.id, payload: 'recipient:friend' });
    const reset = assistant.handle({ sessionId: opened.session.id, payload: 'reset' });
    assert.equal(reset.session.brief.recipient, null);
    assert.equal(reset.session.step, 'welcome');
    assert.match(reset.messages[0].text, /personal gift assistant/);
  });
});
