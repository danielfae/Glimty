(() => {
  const RECIPIENTS = {
    partner: 'Partner',
    parent: 'Parent',
    friend: 'Friend',
    colleague: 'Colleague',
    kid: 'A child',
    other: 'Someone else'
  };
  const OCCASIONS = {
    birthday: 'Birthday',
    anniversary: 'Anniversary',
    holiday: 'Holiday',
    housewarming: 'Housewarming',
    'thank-you': 'Thank you',
    'just-because': 'Just because'
  };
  const BUDGETS = {
    modest: 'Under $40',
    mid: '$40–80',
    generous: '$80–150',
    open: '$150+'
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function apiChat(body) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(err.error || 'Request failed');
    }
    return res.json();
  }

  function renderBrief(node, session) {
    if (!node || !session) return;
    const tags = [];
    if (session.brief.recipient) tags.push(RECIPIENTS[session.brief.recipient] || session.brief.recipient);
    if (session.brief.occasion) tags.push(OCCASIONS[session.brief.occasion] || session.brief.occasion);
    if (session.brief.budget) tags.push(BUDGETS[session.brief.budget] || session.brief.budget);
    (session.brief.interests || []).forEach((id) => tags.push(id));
    if (session.planner?.length) tags.push(`${session.planner.length} planned`);
    node.innerHTML = tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
  }

  function giftCard(gift) {
    return `
      <button type="button" class="gift-pick" data-payload="choose:${escapeHtml(gift.id)}">
        <span class="swatch" aria-hidden="true"></span>
        <span>
          <b>${escapeHtml(gift.name)}</b>
          <small>${escapeHtml(gift.why || gift.blurb)}</small>
        </span>
        <span class="price">$${gift.price}</span>
      </button>
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

  function mount(root, options = {}) {
    if (!root) return null;
    const transcript = root.querySelector('[data-transcript]');
    const brief = root.querySelector('[data-brief]');
    const form = root.querySelector('[data-composer]');
    const input = form?.querySelector('input');
    const storageKey = options.storageKey || 'glimty.session';
    let sessionId = window.localStorage.getItem(storageKey) || '';
    let sending = false;

    function append(messages, asUserText) {
      if (asUserText) {
        transcript.insertAdjacentHTML('beforeend', messageHtml({ role: 'user', text: asUserText }));
      }
      messages.forEach((msg) => {
        transcript.insertAdjacentHTML('beforeend', messageHtml(msg));
      });
      transcript.scrollTop = transcript.scrollHeight;
    }

    async function send({ message, payload, silent }) {
      if (sending) return;
      sending = true;
      try {
        const result = await apiChat({ sessionId, message, payload });
        sessionId = result.session.id;
        window.localStorage.setItem(storageKey, sessionId);
        renderBrief(brief, result.session);
        if (!silent) append(result.messages, message && !payload ? message : '');
        else if (result.messages.length) append(result.messages);
        return result;
      } catch (err) {
        append([{ role: 'assistant', text: err.message || 'I could not reach the assistant just then.' }]);
      } finally {
        sending = false;
        input?.focus();
      }
    }

    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-payload]');
      if (!button || !root.contains(button)) return;
      const title = button.textContent.trim();
      const payload = button.getAttribute('data-payload');
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

    send({ silent: true });
    return { send, reset: () => { window.localStorage.removeItem(storageKey); sessionId = ''; } };
  }

  window.GlimtyChat = { mount, apiChat };
})();
