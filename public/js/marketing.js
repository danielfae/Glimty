(() => {
  const widget = document.getElementById('chat-widget');
  const nudge = document.getElementById('nudge');

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
})();
