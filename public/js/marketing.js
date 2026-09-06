(() => {
  const widget = document.getElementById('chat-widget');
  const nudge = document.getElementById('nudge');
  const featured = document.getElementById('featured');
  const categories = document.getElementById('categories');
  const locale = window.GLIMTY?.locale || 'nb';

  const opened = { current: false };
  let chat;

  function openChat() {
    if (nudge) nudge.hidden = true;
    document.querySelectorAll('.chat-launch').forEach((el) => { el.hidden = true; });
    if (!widget) return;
    widget.hidden = false;
    if (!opened.current) {
      chat = window.GlimtyChat.mount(widget, { storageKey: 'glimty.widget' });
      opened.current = true;
    }
    widget.querySelector('input')?.focus();
  }

  function closeChat() {
    if (widget) widget.hidden = true;
    document.querySelectorAll('.chat-launch').forEach((el) => { el.hidden = false; });
  }

  document.querySelectorAll('[data-open-chat]').forEach((el) => {
    el.addEventListener('click', openChat);
  });
  document.querySelectorAll('[data-close-chat]').forEach((el) => {
    el.addEventListener('click', closeChat);
  });

  fetch(`/api/catalog?lang=${encodeURIComponent(locale)}`)
    .then((res) => res.json())
    .then((data) => {
      const copy = window.GLIMTY?.ui || {};
      if (categories) {
        categories.innerHTML = data.categories.map((cat) => (
          `<a class="cat" href="/shop/${cat.id}?lang=${locale}"><span>${(copy.home_cat_gifts || '{count} · {hint}').replace('{count}', cat.count).replace('{hint}', cat.hint)}</span><strong>${cat.label}</strong></a>`
        )).join('');
      }
      if (featured) {
        featured.innerHTML = data.gifts.slice(0, 6).map((gift) => (
          `<a class="card gift" href="/gift/${gift.id}?lang=${locale}">
            <img class="gift-photo" src="${gift.image}" alt="">
            <div class="meta">
              <h3>${gift.name}</h3>
              <p>${gift.blurb}</p>
              <p class="price">$${gift.price}</p>
            </div>
          </a>`
        )).join('');
      }
    })
    .catch(() => {});
})();
