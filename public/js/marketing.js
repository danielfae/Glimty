(() => {
  const widget = document.getElementById('chat-widget');
  const nudge = document.getElementById('nudge');
  const featured = document.getElementById('featured');
  const categories = document.getElementById('categories');

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

  fetch('/api/catalog')
    .then((res) => res.json())
    .then((data) => {
      if (categories) {
        categories.innerHTML = data.categories.map((cat) => (
          `<article class="cat"><span>${cat.hint}</span><strong>${cat.label}</strong></article>`
        )).join('');
      }
      if (featured) {
        featured.innerHTML = data.gifts.slice(0, 6).map((gift, index) => (
          `<article class="card gift">
            <div class="gift-art" data-tone="${(index % 3) + 1}"></div>
            <div class="meta">
              <h3>${gift.name}</h3>
              <p>${gift.blurb}</p>
              <p class="price">$${gift.price}</p>
            </div>
          </article>`
        )).join('');
      }
    })
    .catch(() => {});
})();
