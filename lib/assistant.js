'use strict';

const catalog = require('./catalog');
const sessions = require('./sessions');
const i18n = require('./i18n');

const RECIPIENTS = {
  partner: { id: 'partner', key: 'recipient_partner', aliases: ['girlfriend', 'boyfriend', 'wife', 'husband', 'spouse', 'partner', 'fiancé', 'fiance', 'fiancée', 'significant other', 'kjæreste', 'samboer', 'kone', 'mann', 'ektemann', 'kone'] },
  parent: { id: 'parent', key: 'recipient_parent', aliases: ['mom', 'dad', 'mother', 'father', 'mum', 'parent', 'parents', 'mamma', 'pappa', 'mor', 'far', 'forelder', 'foreldre'] },
  friend: { id: 'friend', key: 'recipient_friend', aliases: ['friend', 'best friend', 'buddy', 'mate', 'venn', 'venninne', 'kompis'] },
  colleague: { id: 'colleague', key: 'recipient_colleague', aliases: ['colleague', 'coworker', 'co-worker', 'boss', 'client', 'kollega', 'sjef', 'kunde'] },
  kid: { id: 'kid', key: 'recipient_kid', aliases: ['kid', 'child', 'son', 'daughter', 'nephew', 'niece', 'barn', 'sønn', 'datter', 'nevø', 'niese'] },
  other: { id: 'other', key: 'recipient_other', aliases: ['someone', 'other', 'noen andre', 'noen'] }
};

const OCCASIONS = {
  birthday: { id: 'birthday', key: 'occasion_birthday', aliases: ['birthday', 'bday', 'bursdag', 'fødselsdag'] },
  anniversary: { id: 'anniversary', key: 'occasion_anniversary', aliases: ['anniversary', 'jubileum', 'årsdag'] },
  holiday: { id: 'holiday', key: 'occasion_holiday', aliases: ['christmas', 'holiday', 'hanukkah', 'jul', 'xmas', 'høytid'] },
  housewarming: { id: 'housewarming', key: 'occasion_housewarming', aliases: ['housewarming', 'new home', 'moved', 'innflytting', 'ny leilighet', 'nytt hus'] },
  'thank-you': { id: 'thank-you', key: 'occasion_thank_you', aliases: ['thank you', 'thanks', 'appreciation', 'takk', 'takknem'] },
  'just-because': { id: 'just-because', key: 'occasion_just_because', aliases: ['just because', 'no reason', 'thinking of', 'bare fordi', 'uten grunn'] }
};

const INTERESTS = {
  style: { id: 'style', key: 'interest_style' },
  home: { id: 'home', key: 'interest_home' },
  food: { id: 'food', key: 'interest_food' },
  outdoors: { id: 'outdoors', key: 'interest_outdoors' },
  music: { id: 'music', key: 'interest_music' },
  books: { id: 'books', key: 'interest_books' },
  wellness: { id: 'wellness', key: 'interest_wellness' },
  experience: { id: 'experience', key: 'interest_experience' },
  flowers: { id: 'flowers', key: 'interest_flowers' }
};

const BUDGET_KEYS = {
  modest: 'budget_modest',
  mid: 'budget_mid',
  generous: 'budget_generous',
  open: 'budget_open'
};

function localeOf(session) {
  return i18n.normalizeLocale(session?.locale);
}

function tx(session, key, vars) {
  return i18n.t(localeOf(session), key, vars);
}

function recipientLabel(session, id) {
  return tx(session, RECIPIENTS[id]?.key || 'chat_who_them');
}

function occasionLabel(session, id) {
  return tx(session, OCCASIONS[id]?.key || 'chat_occasion_moment');
}

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
  if (/150\+|over 150|no limit|splurge|\bopen\b|ingen grense|åpent budsjett/.test(haystack)) return 'open';
  if (/under\s*40|modest|cheap|small budget|beskjedent/.test(haystack)) return 'modest';
  if (/40\s*[–-]\s*80|under\s*80|\bmid\b|middels/.test(haystack)) return 'mid';
  if (/80\s*[–-]\s*150|\bgenerous\b|sjenerøst/.test(haystack)) return 'generous';
  const kroner = haystack.match(/(\d{2,5})\s*(?:kr|kroner)\b/);
  if (kroner) {
    const usd = Math.round(Number(kroner[1]) / 10);
    if (usd < 40) return 'modest';
    if (usd < 80) return 'mid';
    if (usd < 150) return 'generous';
    return 'open';
  }
  const amount = haystack.match(/(?:\$|budsjett\s*(?:på\s*|er\s*)?|budget\s*(?:of\s*|is\s*)?)\s*(\d{2,4})/)
    || haystack.match(/(\d{2,4})\s*(?:dollars|dollar|usd)\b/);
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
  if (/wrap|packing|innpak|pakke inn|pakke gaven/.test(haystack)) return 'wrapping';
  if (/planner|remind|handlelist|list of gifts|calendar|huskeliste|gaveplan|påminn/.test(haystack)) return 'planner';
  if (/gift|gave|present|presang|buy|shop|need|trenger/.test(haystack)) return 'need_gift';
  return null;
}

function detectInterests(text) {
  const haystack = normalize(text);
  const hits = [];
  const synonyms = {
    style: ['style', 'fashion', 'clothes', 'clothing', 'wear', 'stil', 'mote', 'klær'],
    home: ['home', 'interior', 'house', 'decor', 'hjem', 'interiør'],
    food: ['food', 'coffee', 'tea', 'cook', 'dinner', 'eat', 'mat', 'kaffe', 'middag', 'drikke'],
    flowers: ['flower', 'bouquet', 'roses', 'blomst', 'bukett'],
    outdoors: ['outdoor', 'garden', 'hike', 'cabin', 'nature', 'friluft', 'hage', 'tur', 'hytte'],
    music: ['music', 'vinyl', 'record', 'musikk'],
    books: ['book', 'read', 'reading', 'bok', 'bøker', 'lese'],
    wellness: ['wellness', 'calm', 'spa', 'relax', 'velvære', 'avslapp'],
    experience: ['experience', 'trip', 'night out', 'restaurant', 'opplevelse']
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

function recipientButtons(session) {
  return buttons(Object.values(RECIPIENTS).map((item) => ({ title: tx(session, item.key), payload: `recipient:${item.id}` })));
}

function occasionButtons(session) {
  return buttons(Object.values(OCCASIONS).map((item) => ({ title: tx(session, item.key), payload: `occasion:${item.id}` })));
}

function budgetButtons(session) {
  return buttons(Object.values(catalog.BUDGETS).map((item) => ({ title: tx(session, BUDGET_KEYS[item.id]), payload: `budget:${item.id}` })));
}

function interestButtons(session) {
  return buttons(Object.values(INTERESTS).map((item) => ({ title: tx(session, item.key), payload: `interest:${item.id}` })).concat([
    { title: tx(session, 'chat_interests_enough'), payload: 'interests:done' }
  ]));
}

function welcomeMessage(session) {
  return {
    role: 'assistant',
    text: tx(session, 'chat_welcome'),
    buttons: buttons([
      { title: tx(session, 'chat_need_gift'), payload: 'intent:need_gift' },
      { title: tx(session, 'chat_wrapping'), payload: 'intent:wrapping' },
      { title: tx(session, 'chat_planner'), payload: 'intent:planner' }
    ])
  };
}

function nextCollectionStep(session) {
  if (!session.brief.recipient) {
    session.step = 'recipient';
    return {
      role: 'assistant',
      text: tx(session, 'chat_who'),
      buttons: recipientButtons(session)
    };
  }
  if (!session.brief.occasion) {
    session.step = 'occasion';
    const who = recipientLabel(session, session.brief.recipient).toLowerCase();
    return {
      role: 'assistant',
      text: tx(session, 'chat_occasion', { who }),
      buttons: occasionButtons(session)
    };
  }
  if (!session.brief.budget) {
    session.step = 'budget';
    return {
      role: 'assistant',
      text: tx(session, 'chat_budget'),
      buttons: budgetButtons(session)
    };
  }
  session.step = 'interests';
  return {
    role: 'assistant',
    text: session.brief.interests.length
      ? tx(session, 'chat_interests_have')
      : tx(session, 'chat_interests_ask'),
    buttons: interestButtons(session)
  };
}

function recommendMessage(session, preface) {
  session.intent = 'need_gift';
  session.step = 'recommend';
  const picks = catalog.recommend(session.brief, 3, session.recommendedIds, localeOf(session));
  session.recommendedIds = session.recommendedIds.concat(picks.map((gift) => gift.id));
  const who = session.brief.recipient
    ? recipientLabel(session, session.brief.recipient).toLowerCase()
    : tx(session, 'chat_who_them');
  const occasion = session.brief.occasion
    ? occasionLabel(session, session.brief.occasion).toLowerCase()
    : tx(session, 'chat_occasion_moment');
  return {
    role: 'assistant',
    text: preface || tx(session, 'chat_recommend', { who, occasion }),
    gifts: picks,
    buttons: buttons([
      { title: tx(session, 'chat_show_others'), payload: 'recommend:more' },
      { title: tx(session, 'chat_change_brief'), payload: 'recommend:edit' },
      { title: tx(session, 'chat_start_over'), payload: 'reset' }
    ])
  };
}

function wrapConfirm(session) {
  const gift = session.selectedGiftId ? catalog.getGift(session.selectedGiftId, localeOf(session)) : null;
  session.step = 'wrap_confirm';
  return {
    role: 'assistant',
    text: gift
      ? tx(session, 'chat_wrap_with_gift', { name: gift.name })
      : tx(session, 'chat_wrap_no_gift'),
    buttons: gift
      ? buttons([
        { title: tx(session, 'chat_wrap_to_them'), payload: 'wrap:recipient' },
        { title: tx(session, 'chat_wrap_to_me'), payload: 'wrap:self' },
        { title: tx(session, 'chat_wrap_skip'), payload: 'wrap:skip' }
      ])
      : buttons([
        { title: tx(session, 'chat_find_first'), payload: 'intent:need_gift' },
        { title: tx(session, 'chat_have_gift'), payload: 'wrap:have_gift' }
      ])
  };
}

function plannerPrompt(session) {
  session.intent = 'planner';
  session.step = 'planner';
  const existing = session.planner.length
    ? tx(session, 'chat_planner_existing', {
      list: session.planner.map((item) => `• ${item.who} — ${item.when}`).join('\n')
    })
    : '';
  return {
    role: 'assistant',
    text: `${tx(session, 'chat_planner_intro')}${existing}`,
    buttons: buttons([
      { title: tx(session, 'chat_planner_add'), payload: 'planner:add' },
      { title: tx(session, 'chat_find_now'), payload: 'intent:need_gift' },
      ...(session.planner.length ? [{ title: tx(session, 'chat_clear_list'), payload: 'planner:clear' }] : [])
    ])
  };
}

function applyPayload(session, payload) {
  if (payload === 'reset') {
    const id = session.id;
    const next = sessions.reset(id, session.locale);
    return { session: next, replies: [welcomeMessage(next)] };
  }

  if (payload.startsWith('locale:')) {
    session.locale = i18n.normalizeLocale(payload.slice(7));
    const notice = {
      role: 'assistant',
      text: tx(session, session.locale === 'en' ? 'chat_locale_en' : 'chat_locale_nb')
    };
    return { replies: [notice, replayStep(session)] };
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
        text: tx(session, 'chat_interest_noted', { label: tx(session, INTERESTS[interest]?.key || 'interest_home') }),
        buttons: interestButtons(session)
      }]
    };
  }
  if (payload === 'interests:done') {
    return { replies: [recommendMessage(session)] };
  }
  if (payload === 'recommend:more') {
    return { replies: [recommendMessage(session, tx(session, 'chat_recommend_more'))] };
  }
  if (payload === 'recommend:edit') {
    session.step = 'recipient';
    session.brief = { recipient: null, occasion: null, budget: null, interests: [], notes: session.brief.notes };
    session.recommendedIds = [];
    return { replies: [nextCollectionStep(session)] };
  }
  if (payload.startsWith('choose:')) {
    session.selectedGiftId = payload.slice(7);
    const gift = catalog.getGift(session.selectedGiftId, localeOf(session));
    session.step = 'chosen';
    return {
      replies: [{
        role: 'assistant',
        text: gift
          ? tx(session, 'chat_chosen', { name: gift.name, price: gift.price })
          : tx(session, 'chat_chosen_fallback'),
        gifts: gift ? [gift] : [],
        buttons: buttons([
          { title: tx(session, 'chat_wrap_and_send'), payload: 'intent:wrapping' },
          { title: tx(session, 'chat_add_planner'), payload: 'planner:from_gift' },
          { title: tx(session, 'chat_thats_all'), payload: 'done' }
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
          text: tx(session, 'chat_wrap_skip_done'),
          buttons: buttons([{ title: tx(session, 'chat_another'), payload: 'reset' }])
        }]
      };
    }
    if (delivery === 'have_gift') {
      session.step = 'wrap_note';
      return {
        replies: [{
          role: 'assistant',
          text: tx(session, 'chat_wrap_have_prompt')
        }]
      };
    }
    session.wrapping.delivery = delivery === 'self' ? 'you' : 'recipient';
    session.step = 'wrap_note';
    return {
      replies: [{
        role: 'assistant',
        text: tx(session, 'chat_wrap_card_ask', {
          who: delivery === 'self' ? tx(session, 'chat_delivery_you') : tx(session, 'chat_delivery_them')
        })
      }]
    };
  }
  if (payload === 'planner:add') {
    session.step = 'planner_add';
    return {
      replies: [{
        role: 'assistant',
        text: tx(session, 'chat_planner_format')
      }]
    };
  }
  if (payload === 'planner:clear') {
    session.planner = [];
    return { replies: [plannerPrompt(session)] };
  }
  if (payload === 'planner:from_gift') {
    const gift = session.selectedGiftId ? catalog.getGift(session.selectedGiftId, localeOf(session)) : null;
    const who = session.brief.recipient ? recipientLabel(session, session.brief.recipient) : tx(session, 'chat_planner_someone');
    const when = session.brief.occasion ? occasionLabel(session, session.brief.occasion) : tx(session, 'chat_planner_soon');
    session.planner.push({
      who,
      when,
      gift: gift ? gift.name : tx(session, 'chat_planner_gift'),
      addedAt: Date.now()
    });
    return { replies: [plannerPrompt(session)] };
  }
  if (payload === 'done') {
    session.step = 'done';
    return {
      replies: [{
        role: 'assistant',
        text: tx(session, 'chat_done'),
        buttons: buttons([
          { title: tx(session, 'chat_find_another'), payload: 'reset' },
          { title: tx(session, 'chat_open_planner'), payload: 'intent:planner' }
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
      return [recommendMessage(session, tx(session, 'chat_recommend_from_text'))];
    }
    return [nextCollectionStep(session)];
  }

  if (session.step === 'recipient' && extracted.recipient) return [nextCollectionStep(session)];
  if (session.step === 'occasion' && extracted.occasion) return [nextCollectionStep(session)];
  if (session.step === 'budget' && extracted.budget) return [nextCollectionStep(session)];
  if (session.step === 'interests') {
    if (/enough|done|that’s all|thats all|go ahead|recommend|pick|holder|nok|velg/.test(normalize(text))) {
      return [recommendMessage(session)];
    }
    if (extracted.interests.length || text.trim()) {
      if (!extracted.interests.length) session.brief.notes = `${session.brief.notes} ${text}`.trim();
      return [recommendMessage(session)];
    }
    return [nextCollectionStep(session)];
  }

  if (session.step === 'recommend') {
    const chosen = catalog.listGifts(localeOf(session)).find((gift) => normalize(text).includes(normalize(gift.name)));
    if (chosen) {
      return applyPayload(session, `choose:${chosen.id}`).replies;
    }
    if (/more|other|else|another|andre|flere/.test(normalize(text))) {
      return [recommendMessage(session, tx(session, 'chat_recommend_more'))];
    }
    mergeBrief(session, extracted);
    return [recommendMessage(session, tx(session, 'chat_recommend_updated'))];
  }

  if (session.step === 'wrap_note') {
    session.wrapping.note = text.trim();
    session.step = 'done';
    const gift = session.selectedGiftId ? catalog.getGift(session.selectedGiftId, localeOf(session)) : null;
    const deliveryWho = session.wrapping.delivery === 'you'
      ? tx(session, 'chat_delivery_you')
      : tx(session, 'chat_delivery_them');
    return [{
      role: 'assistant',
      text: gift
        ? tx(session, 'chat_card_noted_gift', { name: gift.name, who: deliveryWho, note: session.wrapping.note })
        : tx(session, 'chat_card_noted', { note: session.wrapping.note }),
      buttons: buttons([
        { title: tx(session, 'chat_add_this_planner'), payload: 'planner:from_gift' },
        { title: tx(session, 'chat_another'), payload: 'reset' }
      ])
    }];
  }

  if (session.step === 'planner' || session.step === 'planner_add') {
    const parts = text.split(',').map((part) => part.trim()).filter(Boolean);
    if (parts.length >= 2) {
      session.planner.push({
        who: parts[0],
        when: parts.slice(1).join(', '),
        gift: tx(session, 'chat_planner_to_choose'),
        addedAt: Date.now()
      });
      return [plannerPrompt(session)];
    }
    return [{
      role: 'assistant',
      text: tx(session, 'chat_planner_almost'),
      buttons: buttons([{ title: tx(session, 'chat_find_instead'), payload: 'intent:need_gift' }])
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
    text: tx(session, 'chat_fallback'),
    buttons: welcomeMessage(session).buttons
  }];
}

function replayStep(session) {
  if (session.step === 'recipient' || session.step === 'occasion' || session.step === 'budget' || session.step === 'interests') {
    return nextCollectionStep(session);
  }
  if (session.step === 'recommend') {
    session.recommendedIds = session.recommendedIds.slice(0, Math.max(0, session.recommendedIds.length - 3));
    return recommendMessage(session);
  }
  if (session.step === 'chosen') {
    return applyPayload(session, `choose:${session.selectedGiftId}`).replies[0];
  }
  if (session.step === 'wrap_confirm' || session.step === 'wrap_note') {
    return wrapConfirm(session);
  }
  if (session.step === 'planner' || session.step === 'planner_add') {
    return plannerPrompt(session);
  }
  session.step = 'welcome';
  return welcomeMessage(session);
}

function publicSession(session) {
  return {
    id: session.id,
    locale: localeOf(session),
    step: session.step,
    intent: session.intent,
    brief: session.brief,
    selectedGiftId: session.selectedGiftId,
    planner: session.planner,
    wrapping: session.wrapping
  };
}

function handle({ sessionId, message, payload, locale }) {
  const requested = locale ? i18n.normalizeLocale(locale) : undefined;
  const session = sessions.get(sessionId, requested);
  const previousLocale = session.locale;
  if (requested) session.locale = requested;
  const replies = [];

  if (!message && !payload) {
    if (!session.messages.length) {
      const hello = welcomeMessage(session);
      session.messages.push(hello);
      sessions.save(session);
      return { session: publicSession(session), messages: [hello] };
    }
    if (requested && requested !== previousLocale) {
      const notice = {
        role: 'assistant',
        text: tx(session, requested === 'en' ? 'chat_locale_en' : 'chat_locale_nb')
      };
      const replay = replayStep(session);
      session.messages.push(notice, replay);
      sessions.save(session);
      return { session: publicSession(session), messages: session.messages };
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
