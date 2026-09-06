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

  it('reads a Norwegian sentence', () => {
    const brief = assistant.extractBrief('Gave til pappa, bursdag, 50 dollar, han liker kaffe');
    assert.equal(brief.recipient, 'parent');
    assert.equal(brief.occasion, 'birthday');
    assert.equal(brief.budget, 'mid');
    assert.ok(brief.interests.includes('food'));
  });

  it('detects wrapping and planner intents', () => {
    assert.equal(assistant.detectIntent('Can you wrap this and send it?'), 'wrapping');
    assert.equal(assistant.detectIntent('Add this to my gift planner'), 'planner');
    assert.equal(assistant.detectIntent('I need a present'), 'need_gift');
    assert.equal(assistant.detectIntent('Kan du pakke inn gaven?'), 'wrapping');
    assert.equal(assistant.detectIntent('Legg den i gaveplanleggeren'), 'planner');
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
    assert.ok(picks.some((gift) => /bernadotte|sky-/.test(gift.id)));
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
    const first = assistant.handle({ locale: 'en' });
    assert.ok(first.session.id);
    assert.equal(first.session.locale, 'en');
    assert.match(first.messages[0].text, /personal gift assistant/);
    assert.ok(first.messages[0].buttons.length >= 3);

    const second = assistant.handle({
      sessionId: first.session.id,
      locale: 'en',
      message: 'I need a gift for my girlfriend'
    });
    assert.ok(second.messages.every((msg) => !/What do you need today/.test(msg.text)));
    assert.equal(second.session.brief.recipient, 'partner');
    assert.ok(second.messages[0].text.includes('occasion') || second.messages[0].gifts);
  });

  it('walks button payloads through to recommendations', () => {
    let state = assistant.handle({ locale: 'en' });
    const id = state.session.id;
    state = assistant.handle({ sessionId: id, locale: 'en', payload: 'intent:need_gift' });
    state = assistant.handle({ sessionId: id, locale: 'en', payload: 'recipient:parent' });
    state = assistant.handle({ sessionId: id, locale: 'en', payload: 'occasion:birthday' });
    state = assistant.handle({ sessionId: id, locale: 'en', payload: 'budget:mid' });
    state = assistant.handle({ sessionId: id, locale: 'en', payload: 'interest:home' });
    state = assistant.handle({ sessionId: id, locale: 'en', payload: 'interests:done' });
    assert.equal(state.session.step, 'recommend');
    assert.ok(state.messages[0].gifts.length >= 1);
    assert.ok(state.messages[0].gifts.length <= 3);
  });

  it('skips ahead when a single message already has the brief', () => {
    const opened = assistant.handle({ locale: 'en' });
    const result = assistant.handle({
      sessionId: opened.session.id,
      locale: 'en',
      message: 'Gift for my dad, birthday, budget $50, he loves gardening'
    });
    assert.equal(result.session.brief.recipient, 'parent');
    assert.equal(result.session.brief.occasion, 'birthday');
    assert.equal(result.session.brief.budget, 'mid');
    assert.ok(result.session.brief.interests.includes('outdoors'));
    assert.ok(result.messages[0].gifts?.length);
  });

  it('records a planner entry from a short line', () => {
    const opened = assistant.handle({ locale: 'en' });
    assistant.handle({ sessionId: opened.session.id, locale: 'en', payload: 'intent:planner' });
    const result = assistant.handle({
      sessionId: opened.session.id,
      locale: 'en',
      message: 'Mom, birthday, June 12'
    });
    assert.equal(result.session.planner.length, 1);
    assert.equal(result.session.planner[0].who, 'Mom');
    assert.match(result.session.planner[0].when, /June 12/);
    assert.equal(result.session.brief.budget, null);
    assert.equal(result.session.brief.recipient, null);
  });

  it('chooses a gift and can take a wrapping note', () => {
    const opened = assistant.handle({ locale: 'en' });
    const id = opened.session.id;
    assistant.handle({
      sessionId: id,
      locale: 'en',
      message: 'Gift for my girlfriend, anniversary, $160, dinner'
    });
    const chosen = assistant.handle({ sessionId: id, locale: 'en', payload: 'choose:bernadotte-carafe' });
    assert.equal(chosen.session.selectedGiftId, 'bernadotte-carafe');
    assistant.handle({ sessionId: id, locale: 'en', payload: 'intent:wrapping' });
    assistant.handle({ sessionId: id, locale: 'en', payload: 'wrap:recipient' });
    const wrapped = assistant.handle({ sessionId: id, locale: 'en', message: 'Happy anniversary — table for two is on me.' });
    assert.equal(wrapped.session.wrapping.note, 'Happy anniversary — table for two is on me.');
    assert.match(wrapped.messages[0].text, /Card noted/);
  });

  it('reset returns a new welcome on the same session id', () => {
    const opened = assistant.handle({ locale: 'en' });
    assistant.handle({ sessionId: opened.session.id, locale: 'en', payload: 'recipient:friend' });
    const reset = assistant.handle({ sessionId: opened.session.id, locale: 'en', payload: 'reset' });
    assert.equal(reset.session.brief.recipient, null);
    assert.equal(reset.session.step, 'welcome');
    assert.match(reset.messages[0].text, /personal gift assistant/);
  });

  it('defaults to Norwegian and can switch the chat to English', () => {
    const first = assistant.handle({});
    assert.equal(first.session.locale, 'nb');
    assert.match(first.messages[0].text, /gaveassistent/);
    const switched = assistant.handle({
      sessionId: first.session.id,
      payload: 'locale:en'
    });
    assert.equal(switched.session.locale, 'en');
    assert.match(switched.messages.map((msg) => msg.text).join(' '), /English/);
    assert.match(switched.messages[switched.messages.length - 1].text, /personal gift assistant|Who are we shopping|What do you need/);
  });
});
