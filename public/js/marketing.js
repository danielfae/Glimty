(() => {
  const widget = document.getElementById('chat-widget');
  const nudge = document.getElementById('nudge');
  const featured = document.getElementById('featured');
  const categories = document.getElementById('categories');
  const locale = window.GLIMTY?.locale || 'nb';

  const opened = { current: false };
  let chat;
  let lastFocus = null;

  function openChat() {
    lastFocus = document.activeElement;
    if (nudge) nudge.hidden = true;
    document.querySelectorAll('.chat-launch').forEach((el) => { el.hidden = true; });
    if (!widget) return;
    widget.hidden = false;
    if (!opened.current) {
      chat = window.GlimtyChat.mount(widget, { storageKey: 'glimty.session' });
      opened.current = true;
    }
    widget.querySelector('input')?.focus();
  }

  function closeChat() {
    if (widget) widget.hidden = true;
    document.querySelectorAll('.chat-launch').forEach((el) => { el.hidden = false; });
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.querySelectorAll('[data-open-chat]').forEach((el) => {
    el.addEventListener('click', openChat);
  });
  document.querySelectorAll('[data-close-chat]').forEach((el) => {
    el.addEventListener('click', closeChat);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && widget && !widget.hidden) {
      event.preventDefault();
      closeChat();
    }
  });

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  fetch(`/api/catalog?lang=${encodeURIComponent(locale)}`)
    .then((res) => res.json())
    .then((data) => {
      const copy = window.GLIMTY?.ui || {};
      if (categories && !categories.children.length) {
        categories.innerHTML = (data.categories || []).map((cat) => (
          `<a class="cat" href="/shop/${escapeHtml(cat.id)}?lang=${locale}"><span>${escapeHtml((copy.home_cat_gifts || '{count} · {hint}').replace('{count}', cat.count).replace('{hint}', cat.hint))}</span><strong>${escapeHtml(cat.label)}</strong></a>`
        )).join('') || `<p class="empty-note">${escapeHtml(copy.catalog_empty || '')}</p>`;
      }
      if (featured && !featured.children.length) {
        featured.innerHTML = (data.gifts || []).slice(0, 6).map((gift) => (
          `<a class="card gift" href="/gift/${escapeHtml(gift.id)}?lang=${locale}">
            <img class="gift-photo" src="${escapeHtml(gift.image)}" alt="${escapeHtml(gift.name)}" width="400" height="220">
            <div class="meta">
              <p class="gift-meta">${escapeHtml(gift.brand || '')}</p>
              <h3>${escapeHtml(gift.name)}</h3>
              <p>${escapeHtml(gift.blurb)}</p>
              <p class="price">$${escapeHtml(gift.price)}</p>
            </div>
          </a>`
        )).join('') || `<p class="empty-note">${escapeHtml(copy.catalog_empty || '')}</p>`;
      }
    })
    .catch(() => {
      const copy = window.GLIMTY?.ui || {};
      const note = `<p class="empty-note">${escapeHtml(copy.catalog_empty || '')}</p>`;
      if (categories) categories.innerHTML = note;
      if (featured) featured.innerHTML = note;
    });
})();
