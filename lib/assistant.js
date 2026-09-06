'use strict';

const catalog = require('./catalog');
const sessions = require('./sessions');

const RECIPIENTS = {
  partner: { id: 'partner', label: 'Partner', aliases: ['girlfriend', 'boyfriend', 'wife', 'husband', 'spouse', 'partner', 'fiancé', 'fiance', 'fiancée', 'significant other'] },
  parent: { id: 'parent', label: 'Parent', aliases: ['mom', 'dad', 'mother', 'father', 'mum', 'parent', 'parents'] },
  friend: { id: 'friend', label: 'Friend', aliases: ['friend', 'best friend', 'buddy', 'mate'] },
  colleague: { id: 'colleague', label: 'Colleague', aliases: ['colleague', 'coworker', 'co-worker', 'boss', 'client'] },
  kid: { id: 'kid', label: 'A child', aliases: ['kid', 'child', 'son', 'daughter', 'nephew', 'niece'] },
  other: { id: 'other', label: 'Someone else', aliases: ['someone', 'other'] }
};

const OCCASIONS = {
  birthday: { id: 'birthday', label: 'Birthday', aliases: ['birthday', 'bday'] },
  anniversary: { id: 'anniversary', label: 'Anniversary', aliases: ['anniversary'] },
  holiday: { id: 'holiday', label: 'Holiday', aliases: ['christmas', 'holiday', 'hanukkah', 'jul', 'xmas'] },
  housewarming: { id: 'housewarming', label: 'Housewarming', aliases: ['housewarming', 'new home', 'moved'] },
  'thank-you': { id: 'thank-you', label: 'Thank you', aliases: ['thank you', 'thanks', 'appreciation'] },
  'just-because': { id: 'just-because', label: 'Just because', aliases: ['just because', 'no reason', 'thinking of'] }
};

const INTERESTS = {
  style: { id: 'style', label: 'Style' },
  home: { id: 'home', label: 'Home' },
  food: { id: 'food', label: 'Food & drink' },
  outdoors: { id: 'outdoors', label: 'Outdoors' },
  music: { id: 'music', label: 'Music' },
  books: { id: 'books', label: 'Books' },
  wellness: { id: 'wellness', label: 'Wellness' },
  experience: { id: 'experience', label: 'Experiences' },
  flowers: { id: 'flowers', label: 'Flowers' }
};

function normalize(text) {
  return String(text || '').trim().toLowerCase();
}

function matchFromMap(text, map) {
  const haystack = normalize(text);
  let found = null;
  let foundLength = 0;
  for (const entry of Object.values(map)) {
    const aliases = entry.aliases || [entry.label.toLowerCase(), entry.id];
    for (const alias of aliases) {
      if (haystack.includes(alias) && alias.length > foundLength) {
        found = entry.id;
        foundLength = alias.length;
      }
    }
  }
  return found;
}

function detectBudget(text) {
  const haystack = normalize(text);
  if (/150\+|over 150|no limit|splurge|\bopen\b/.test(haystack)) return 'open';
  if (/under\s*40|modest|cheap|small budget/.test(haystack)) return 'modest';
  if (/40\s*[–-]\s*80|under\s*80|\bmid\b/.test(haystack)) return 'mid';
  if (/80\s*[–-]\s*150|\bgenerous\b/.test(haystack)) return 'generous';
  const amount = haystack.match(/(?:\$|budget\s*(?:of\s*|is\s*)?)\s*(\d{2,4})/)
    || haystack.match(/(\d{2,4})\s*(?:dollars|usd|kr)\b/);
  if (amount) {
    const n = Number(amount[1]);
    if (n < 40) return 'modest';
    if (n < 80) return 'mid';
    if (n < 150) return 'generous';
    return 'open';
  }
  return null;
}

function detectIntent(text) {
  const haystack = normalize(text);
  if (/wrap|packing|innpak/.test(haystack)) return 'wrapping';
  if (/planner|remind|handlelist|list of gifts|calendar/.test(haystack)) return 'planner';
  if (/gift|gave|present|buy|shop|need/.test(haystack)) return 'need_gift';
  return null;
}

function detectInterests(text) {
  const haystack = normalize(text);
  const hits = [];
  const synonyms = {
    style: ['style', 'fashion', 'clothes', 'clothing', 'wear'],
    home: ['home', 'interior', 'house', 'decor'],
    food: ['food', 'coffee', 'tea', 'cook', 'dinner', 'eat'],
    flowers: ['flower', 'bouquet', 'roses'],
    outdoors: ['outdoor', 'garden', 'hike', 'cabin', 'nature'],
    music: ['music', 'vinyl', 'record'],
    books: ['book', 'read', 'reading'],
    wellness: ['wellness', 'calm', 'spa', 'relax'],
    experience: ['experience', 'trip', 'night out', 'restaurant']
  };
  for (const [id, words] of Object.entries(synonyms)) {
    if (words.some((word) => haystack.includes(word))) hits.push(id);
  }
  return hits;
}

function extractBrief(text) {
  return {
    recipient: matchFromMap(text, RECIPIENTS),
    occasion: matchFromMap(text, OCCASIONS),
    budget: detectBudget(text),
    interests: detectInterests(text)
  };
}

function mergeBrief(session, extracted) {
  if (extracted.recipient) session.brief.recipient = extracted.recipient;
  if (extracted.occasion) session.brief.occasion = extracted.occasion;
  if (extracted.budget) session.brief.budget = extracted.budget;
  if (extracted.interests && extracted.interests.length) {
    session.brief.interests = Array.from(new Set(session.brief.interests.concat(extracted.interests)));
  }
}

function buttons(items) {
  return items.map((item) => (
    typeof item === 'string'
      ? { title: item, payload: item }
      : { title: item.title, payload: item.payload }
  ));
}

function recipientButtons() {
  return buttons(Object.values(RECIPIENTS).map((item) => ({ title: item.label, payload: `recipient:${item.id}` })));
}

function occasionButtons() {
  return buttons(Object.values(OCCASIONS).map((item) => ({ title: item.label, payload: `occasion:${item.id}` })));
}

function budgetButtons() {
  return buttons(Object.values(catalog.BUDGETS).map((item) => ({ title: item.label, payload: `budget:${item.id}` })));
}

function interestButtons() {
  return buttons(Object.values(INTERESTS).map((item) => ({ title: item.label, payload: `interest:${item.id}` })).concat([
    { title: 'Those are enough', payload: 'interests:done' }
  ]));
}

function welcomeMessage() {
  return {
    role: 'assistant',
    text: 'Hi — I am Glimty, your personal gift assistant. I find a gift that fits the person, not a generic “top 10” list. What do you need today?',
    buttons: buttons([
      { title: 'I need a gift', payload: 'intent:need_gift' },
      { title: 'Gift wrapping', payload: 'intent:wrapping' },
      { title: 'Gift planner', payload: 'intent:planner' }
    ])
  };
}

function nextCollectionStep(session) {
  if (!session.brief.recipient) {
    session.step = 'recipient';
    return {
      role: 'assistant',
      text: 'Who are we shopping for?',
      buttons: recipientButtons()
    };
  }
  if (!session.brief.occasion) {
    session.step = 'occasion';
    const who = RECIPIENTS[session.brief.recipient]?.label.toLowerCase() || 'them';
    return {
      role: 'assistant',
      text: `Got it — a gift for your ${who}. What’s the occasion?`,
      buttons: occasionButtons()
    };
  }
  if (!session.brief.budget) {
    session.step = 'budget';
    return {
      role: 'assistant',
      text: 'What budget feels comfortable? I will stay inside it.',
      buttons: budgetButtons()
    };
  }
  session.step = 'interests';
  return {
    role: 'assistant',
    text: session.brief.interests.length
      ? 'I have a sense of their taste. Add anything I missed, or tell me that’s enough.'
      : 'What are they into? Pick a few — or just write it in your own words.',
    buttons: interestButtons()
  };
}

function recommendMessage(session, preface) {
  session.intent = 'need_gift';
  session.step = 'recommend';
  const picks = catalog.recommend(session.brief, 3, session.recommendedIds);
  session.recommendedIds = session.recommendedIds.concat(picks.map((gift) => gift.id));
  const who = RECIPIENTS[session.brief.recipient]?.label.toLowerCase() || 'them';
  const occasion = OCCASIONS[session.brief.occasion]?.label.toLowerCase() || 'this moment';
  return {
    role: 'assistant',
    text: preface || `Here are three gifts I would actually give your ${who} for a ${occasion}. Tap one to choose it, or ask me to look again.`,
    gifts: picks,
    buttons: buttons([
      { title: 'Show me others', payload: 'recommend:more' },
      { title: 'Change the brief', payload: 'recommend:edit' },
      { title: 'Start over', payload: 'reset' }
    ])
  };
}

function wrapConfirm(session) {
  const gift = session.selectedGiftId ? catalog.getGift(session.selectedGiftId) : null;
  session.step = 'wrap_confirm';
  return {
    role: 'assistant',
    text: gift
      ? `I can wrap the ${gift.name}, write a short card, and have it sent. Where should it go?`
      : 'I can wrap, write a card, and send a gift for you. Do you already have the gift, or should I find one first?',
    buttons: gift
      ? buttons([
        { title: 'Send to the recipient', payload: 'wrap:recipient' },
        { title: 'Send it to me', payload: 'wrap:self' },
        { title: 'Skip wrapping', payload: 'wrap:skip' }
      ])
      : buttons([
        { title: 'Find a gift first', payload: 'intent:need_gift' },
        { title: 'I already have a gift', payload: 'wrap:have_gift' }
      ])
  };
}

function plannerPrompt(session) {
  session.intent = 'planner';
  session.step = 'planner';
  const existing = session.planner.length
    ? `\n\nAlready on your list:\n${session.planner.map((item) => `• ${item.who} — ${item.when}`).join('\n')}`
    : '';
  return {
    role: 'assistant',
    text: `Tell me who you need a gift for and when you need it. I will keep a quiet list and can suggest ideas when the date gets close.${existing}`,
    buttons: buttons([
      { title: 'Add someone', payload: 'planner:add' },
      { title: 'Find a gift now', payload: 'intent:need_gift' },
      ...(session.planner.length ? [{ title: 'Clear the list', payload: 'planner:clear' }] : [])
    ])
  };
}

function applyPayload(session, payload) {
  if (payload === 'reset') {
    const id = session.id;
    const next = sessions.reset(id);
    return { session: next, replies: [welcomeMessage()] };
  }

  if (payload.startsWith('intent:')) {
    session.intent = payload.slice(7);
    if (session.intent === 'need_gift') {
      return { replies: [nextCollectionStep(session)] };
    }
    if (session.intent === 'wrapping') {
      return { replies: [wrapConfirm(session)] };
    }
    if (session.intent === 'planner') {
      return { replies: [plannerPrompt(session)] };
    }
  }

  if (payload.startsWith('recipient:')) {
    session.brief.recipient = payload.slice(10);
    return { replies: [nextCollectionStep(session)] };
  }
  if (payload.startsWith('occasion:')) {
    session.brief.occasion = payload.slice(9);
    return { replies: [nextCollectionStep(session)] };
  }
  if (payload.startsWith('budget:')) {
    session.brief.budget = payload.slice(7);
    return { replies: [nextCollectionStep(session)] };
  }
  if (payload.startsWith('interest:')) {
    const interest = payload.slice(9);
    if (!session.brief.interests.includes(interest)) session.brief.interests.push(interest);
    session.step = 'interests';
    return {
      replies: [{
        role: 'assistant',
        text: `Noted — ${INTERESTS[interest]?.label || interest}. Anything else, or shall I pick gifts?`,
        buttons: interestButtons()
      }]
    };
  }
  if (payload === 'interests:done') {
    return { replies: [recommendMessage(session)] };
  }
  if (payload === 'recommend:more') {
    return { replies: [recommendMessage(session, 'A few more, still inside your brief.')] };
  }
  if (payload === 'recommend:edit') {
    session.step = 'recipient';
    session.brief = { recipient: null, occasion: null, budget: null, interests: [], notes: session.brief.notes };
    session.recommendedIds = [];
    return { replies: [nextCollectionStep(session)] };
  }
  if (payload.startsWith('choose:')) {
    session.selectedGiftId = payload.slice(7);
    const gift = catalog.getGift(session.selectedGiftId);
    session.step = 'chosen';
    return {
      replies: [{
        role: 'assistant',
        text: gift
          ? `Good eye. The ${gift.name} is $${gift.price}. I can wrap it, add it to your planner, or leave you with this pick.`
          : 'I have that one marked.',
        gifts: gift ? [gift] : [],
        buttons: buttons([
          { title: 'Wrap and send it', payload: 'intent:wrapping' },
          { title: 'Add to planner', payload: 'planner:from_gift' },
          { title: 'That’s all I needed', payload: 'done' }
        ])
      }]
    };
  }
  if (payload.startsWith('wrap:')) {
    const delivery = payload.slice(5);
    if (delivery === 'skip') {
      session.step = 'done';
      return {
        replies: [{
          role: 'assistant',
          text: 'No wrapping — the gift itself is enough. Come back when you need the next one.',
          buttons: buttons([{ title: 'Start another gift', payload: 'reset' }])
        }]
      };
    }
    if (delivery === 'have_gift') {
      session.step = 'wrap_note';
      return {
        replies: [{
          role: 'assistant',
          text: 'Tell me what the gift is, and the line you want on the card. I will take it from there.'
        }]
      };
    }
    session.wrapping.delivery = delivery === 'self' ? 'you' : 'the recipient';
    session.step = 'wrap_note';
    return {
      replies: [{
        role: 'assistant',
        text: `Sending to ${session.wrapping.delivery}. What should the card say? A short line is better than a speech.`
      }]
    };
  }
  if (payload === 'planner:add') {
    session.step = 'planner_add';
    return {
      replies: [{
        role: 'assistant',
        text: 'Write it like this: “Mom, birthday, June 12” — name, occasion, date.'
      }]
    };
  }
  if (payload === 'planner:clear') {
    session.planner = [];
    return { replies: [plannerPrompt(session)] };
  }
  if (payload === 'planner:from_gift') {
    const gift = session.selectedGiftId ? catalog.getGift(session.selectedGiftId) : null;
    const who = RECIPIENTS[session.brief.recipient]?.label || 'Someone';
    const when = OCCASIONS[session.brief.occasion]?.label || 'Soon';
    session.planner.push({
      who,
      when,
      gift: gift ? gift.name : 'Gift to choose',
      addedAt: Date.now()
    });
    return { replies: [plannerPrompt(session)] };
  }
  if (payload === 'done') {
    session.step = 'done';
    return {
      replies: [{
        role: 'assistant',
        text: 'I will be here whenever the next gift comes up. No rush.',
        buttons: buttons([
          { title: 'Find another gift', payload: 'reset' },
          { title: 'Open the planner', payload: 'intent:planner' }
        ])
      }]
    };
  }

  return null;
}

function handleFreeText(session, text) {
  const extracted = extractBrief(text);
  const collectingGift = ['welcome', 'intent', 'recipient', 'occasion', 'budget', 'interests', 'recommend', 'chosen', 'done'].includes(session.step);
  if (collectingGift) {
    mergeBrief(session, extracted);
    if (extracted.recipient || extracted.occasion || extracted.budget || extracted.interests.length) {
      session.brief.notes = session.brief.notes
        ? `${session.brief.notes} ${text}`.trim()
        : text;
    }
  }

  if (session.step === 'welcome' || session.step === 'intent') {
    const intent = detectIntent(text) || (extracted.recipient || extracted.occasion ? 'need_gift' : null);
    if (intent === 'wrapping') {
      session.intent = 'wrapping';
      return [wrapConfirm(session)];
    }
    if (intent === 'planner') {
      return [plannerPrompt(session)];
    }
    session.intent = 'need_gift';
    if (session.brief.recipient && session.brief.occasion && session.brief.budget) {
      return [recommendMessage(session, 'I pulled a shortlist from what you just told me.')];
    }
    return [nextCollectionStep(session)];
  }

  if (session.step === 'recipient' && extracted.recipient) return [nextCollectionStep(session)];
  if (session.step === 'occasion' && extracted.occasion) return [nextCollectionStep(session)];
  if (session.step === 'budget' && extracted.budget) return [nextCollectionStep(session)];
  if (session.step === 'interests') {
    if (/enough|done|that’s all|thats all|go ahead|recommend|pick/.test(normalize(text))) {
      return [recommendMessage(session)];
    }
    if (extracted.interests.length || text.trim()) {
      if (!extracted.interests.length) session.brief.notes = `${session.brief.notes} ${text}`.trim();
      return [recommendMessage(session)];
    }
    return [nextCollectionStep(session)];
  }

  if (session.step === 'recommend') {
    const chosen = catalog.listGifts().find((gift) => normalize(text).includes(normalize(gift.name)));
    if (chosen) {
      return applyPayload(session, `choose:${chosen.id}`).replies;
    }
    if (/more|other|else|another/.test(normalize(text))) {
      return [recommendMessage(session, 'A few more, still inside your brief.')];
    }
    mergeBrief(session, extracted);
    return [recommendMessage(session, 'Updated the brief and looked again.')];
  }

  if (session.step === 'wrap_note') {
    session.wrapping.note = text.trim();
    session.step = 'done';
    const gift = session.selectedGiftId ? catalog.getGift(session.selectedGiftId) : null;
    return [{
      role: 'assistant',
      text: gift
        ? `Card noted. I will wrap the ${gift.name} and send it to ${session.wrapping.delivery || 'the address you share next'}. “${session.wrapping.note}” will be on the card.`
        : `Card noted: “${session.wrapping.note}”. Send me the gift details whenever you have them, and I will handle wrapping.`,
      buttons: buttons([
        { title: 'Add this to the planner', payload: 'planner:from_gift' },
        { title: 'Start another gift', payload: 'reset' }
      ])
    }];
  }

  if (session.step === 'planner' || session.step === 'planner_add') {
    const parts = text.split(',').map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      session.planner.push({
        who: parts[0],
        when: parts.slice(1).join(', '),
        gift: 'To choose',
        addedAt: Date.now()
      });
      return [plannerPrompt(session)];
    }
    return [{
      role: 'assistant',
      text: 'Almost — try “Alex, anniversary, March 3” so I can file it.',
      buttons: buttons([{ title: 'Find a gift instead', payload: 'intent:need_gift' }])
    }];
  }

  if (session.step === 'done' || session.step === 'chosen') {
    const intent = detectIntent(text);
    if (intent === 'planner') return [plannerPrompt(session)];
    if (intent === 'wrapping') return [wrapConfirm(session)];
    if (intent === 'need_gift' || extracted.recipient) {
      session.intent = 'need_gift';
      session.recommendedIds = [];
      return [nextCollectionStep(session)];
    }
  }

  if (session.intent === 'need_gift' && session.brief.recipient && session.brief.occasion && session.brief.budget) {
    return [recommendMessage(session)];
  }

  return [{
    role: 'assistant',
    text: 'I can find a gift, wrap one you already have, or keep a planner. Tell me who it is for, or pick a path below.',
    buttons: welcomeMessage().buttons
  }];
}

function publicSession(session) {
  return {
    id: session.id,
    step: session.step,
    intent: session.intent,
    brief: session.brief,
    selectedGiftId: session.selectedGiftId,
    planner: session.planner,
    wrapping: session.wrapping
  };
}

function handle({ sessionId, message, payload }) {
  const session = sessions.get(sessionId);
  const replies = [];

  if (!message && !payload) {
    if (!session.messages.length) {
      const hello = welcomeMessage();
      session.messages.push(hello);
      sessions.save(session);
      return { session: publicSession(session), messages: [hello] };
    }
    return { session: publicSession(session), messages: session.messages };
  }

  if (payload) {
    const applied = applyPayload(session, payload);
    const nextSession = applied.session || session;
    replies.push(...applied.replies);
    nextSession.messages.push(...replies);
    sessions.save(nextSession);
    return { session: publicSession(nextSession), messages: replies };
  }

  if (message && String(message).trim()) {
    replies.push(...handleFreeText(session, String(message)));
    session.messages.push(...replies);
    sessions.save(session);
    return { session: publicSession(session), messages: replies };
  }

  return { session: publicSession(session), messages: [] };
}

module.exports = {
  handle,
  extractBrief,
  detectIntent,
  detectBudget,
  RECIPIENTS,
  OCCASIONS,
  welcomeMessage
};
