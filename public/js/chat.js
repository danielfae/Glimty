(() => {
  function currentLocale() {
    return window.GLIMTY?.locale || 'nb';
  }

  function ui() {
    return window.GLIMTY?.ui || {};
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setLocaleCookie(locale) {
    document.cookie = `glimty_lang=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    if (window.GLIMTY) window.GLIMTY.locale = locale;
    document.documentElement.lang = locale === 'en' ? 'en' : 'nb';
  }

  async function apiChat(body) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ locale: currentLocale(), ...body })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: ui().chat_error || 'Request failed' }));
      throw new Error(err.error || ui().chat_error || 'Request failed');
    }
    return res.json();
  }

  function renderBrief(node, session) {
    if (!node || !session) return;
    const labels = ui();
    const tags = [];
    const recipients = {
      partner: labels.recipient_partner,
      parent: labels.recipient_parent,
      friend: labels.recipient_friend,
      colleague: labels.recipient_colleague,
      kid: labels.recipient_kid,
      other: labels.recipient_other
    };
    const occasions = {
      birthday: labels.occasion_birthday,
      anniversary: labels.occasion_anniversary,
      holiday: labels.occasion_holiday,
      housewarming: labels.occasion_housewarming,
      'thank-you': labels.occasion_thank_you,
      'just-because': labels.occasion_just_because
    };
    const budgets = {
      modest: labels.budget_modest,
      mid: labels.budget_mid,
      generous: labels.budget_generous,
      open: labels.budget_open
    };
    const interests = {
      style: labels.interest_style,
      home: labels.interest_home,
      food: labels.interest_food,
      outdoors: labels.interest_outdoors,
      music: labels.interest_music,
      books: labels.interest_books,
      wellness: labels.interest_wellness,
      experience: labels.interest_experience,
      flowers: labels.interest_flowers
    };
    if (session.brief.recipient) tags.push(recipients[session.brief.recipient] || session.brief.recipient);
    if (session.brief.occasion) tags.push(occasions[session.brief.occasion] || session.brief.occasion);
    if (session.brief.budget) tags.push(budgets[session.brief.budget] || session.brief.budget);
    (session.brief.interests || []).forEach((id) => tags.push(interests[id] || id));
    if (session.planner?.length) {
      tags.push((labels.planned_count || '{count}').replace('{count}', session.planner.length));
    }
    node.innerHTML = tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
  }

  function giftCard(gift) {
    const photo = gift.image
      ? `<img class="swatch" src="${escapeHtml(gift.image)}" alt="${escapeHtml(gift.name)}">`
      : '<span class="swatch" aria-hidden="true"></span>';
    const openLabel = ui().chat_open_gift || 'Open';
    return `
      <div class="gift-pick">
        <button type="button" class="gift-pick-choose" data-payload="choose:${escapeHtml(gift.id)}">
          ${photo}
          <span>
            <b>${escapeHtml(gift.name)}</b>
            <small>${escapeHtml(gift.why || gift.blurb)}</small>
          </span>
          <span class="price">$${gift.price}</span>
        </button>
        <a class="gift-pick-open" href="/gift/${escapeHtml(gift.id)}?lang=${currentLocale()}" data-payload="open:${escapeHtml(gift.id)}" aria-label="${escapeHtml(openLabel)}: ${escapeHtml(gift.name)}">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 17L17 7M10 7h7v7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    `;
  }

  function messageHtml(msg) {
    const buttons = (msg.buttons || []).map((btn) => (
      `<button type="button" class="chip" data-payload="${escapeHtml(btn.payload)}">${escapeHtml(btn.title)}</button>`
    )).join('');
    const gifts = (msg.gifts || []).map(giftCard).join('');
    return `
      <article class="msg ${msg.role}">
        <div>${escapeHtml(msg.text || '')}</div>
        ${gifts ? `<div class="gift-row">${gifts}</div>` : ''}
        ${buttons ? `<div class="replies">${buttons}</div>` : ''}
      </article>
    `;
  }

  function applyUi(root, pack) {
    if (!pack) return;
    if (window.GLIMTY) window.GLIMTY.ui = { ...window.GLIMTY.ui, ...pack };
    const input = root.querySelector('input[name="message"]');
    if (input && !input.dataset.lockPlaceholder) {
      const next = pack.widget_placeholder || pack.assistant_placeholder;
      if (next) input.placeholder = next;
    } else if (input && pack.assistant_placeholder) {
      input.placeholder = pack.assistant_placeholder;
    }
    const send = root.querySelector('.composer button[type="submit"]');
    if (send && pack.assistant_send) send.textContent = pack.assistant_send;
    root.querySelectorAll('.lang-switch a').forEach((link) => {
      const lang = new URL(link.href, window.location.origin).searchParams.get('lang');
      link.classList.toggle('is-on', lang === currentLocale());
    });
  }

  function mount(root, options = {}) {
    if (!root) return null;
    const transcript = root.querySelector('[data-transcript]');
    const brief = root.querySelector('[data-brief]');
    const form = root.querySelector('[data-composer]');
    const input = form?.querySelector('input');
    const storageKey = options.storageKey || 'glimty.session';
    let sessionId = window.localStorage.getItem(storageKey) || '';
    let sending = false;
    const sendBtn = form?.querySelector('button[type="submit"]');
    const idleLabel = sendBtn?.textContent || '';

    function append(messages, asUserText, replace) {
      if (replace) transcript.innerHTML = '';
      if (asUserText) {
        transcript.insertAdjacentHTML('beforeend', messageHtml({ role: 'user', text: asUserText }));
      }
      messages.forEach((msg) => {
        transcript.insertAdjacentHTML('beforeend', messageHtml(msg));
      });
      const latest = transcript.lastElementChild;
      if (latest) latest.scrollIntoView({ block: 'nearest' });
      else transcript.scrollTop = transcript.scrollHeight;
    }

    function setBusy(on) {
      sending = on;
      if (sendBtn) {
        sendBtn.disabled = on;
        sendBtn.textContent = on ? (ui().chat_sending || idleLabel) : idleLabel;
      }
      root.setAttribute('aria-busy', on ? 'true' : 'false');
    }

    async function send({ message, payload, silent, replace }) {
      if (sending) return;
      setBusy(true);
      try {
        const result = await apiChat({ sessionId, message, payload });
        sessionId = result.session.id;
        window.localStorage.setItem(storageKey, sessionId);
        if (result.session.locale) setLocaleCookie(result.session.locale);
        if (result.ui) applyUi(root, result.ui);
        renderBrief(brief, result.session);
        if (!silent) append(result.messages, message && !payload ? message : '', replace);
        else if (result.messages.length) append(result.messages, '', replace);
        return result;
      } catch (err) {
        append([{ role: 'assistant', text: err.message || ui().chat_error || 'Error' }]);
      } finally {
        setBusy(false);
        input?.focus();
      }
    }

    root.addEventListener('click', (event) => {
      const langLink = event.target.closest('.lang-switch a');
      if (langLink && root.contains(langLink)) {
        event.preventDefault();
        const next = new URL(langLink.href, window.location.origin).searchParams.get('lang') || 'nb';
        if (next === currentLocale() && !event.metaKey) return;
        setLocaleCookie(next);
        const title = next === 'en' ? 'English' : 'Norsk';
        const last = document.createElement('article');
        last.className = 'msg user';
        last.textContent = title;
        transcript.appendChild(last);
        send({ payload: `locale:${next}` });
        return;
      }

      const button = event.target.closest('[data-payload]');
      if (!button || !root.contains(button)) return;
      event.preventDefault();
      const payload = button.getAttribute('data-payload');
      if (payload && payload.startsWith('open:')) {
        const giftId = payload.slice(5);
        window.location.href = `/gift/${encodeURIComponent(giftId)}?lang=${currentLocale()}`;
        return;
      }
      const title = (button.querySelector('b')?.textContent || button.textContent).trim();
      const last = document.createElement('article');
      last.className = 'msg user';
      last.textContent = title;
      transcript.appendChild(last);
      send({ payload });
    });

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) return;
      input.value = '';
      send({ message });
    });

    const boot = send({ silent: true, replace: true });
    const pendingGift = new URLSearchParams(window.location.search).get('gift');
    if (pendingGift && /^[a-z0-9-]+$/i.test(pendingGift)) {
      boot.then(() => send({ payload: `choose:${pendingGift}` }));
    }
    return {
      send,
      reset: () => { window.localStorage.removeItem(storageKey); sessionId = ''; }
    };
  }

  window.GlimtyChat = { mount, apiChat };
})();
