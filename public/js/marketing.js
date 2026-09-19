(() => {
  const widget = document.getElementById('chat-widget');
  const nudge = document.getElementById('nudge');

  const opened = { current: false };
  let chat;

  function openChat() {
    dismissNudge();
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

  // The nudge waits a few seconds, and stays away once dismissed.
  let nudgeSeen = false;
  try { nudgeSeen = window.sessionStorage.getItem('glimty.nudge') === 'off'; } catch (err) { /* private mode */ }
  if (nudge && !nudgeSeen) {
    window.setTimeout(() => { if (!opened.current) nudge.hidden = false; }, 5000);
  }
  function dismissNudge() {
    if (nudge) nudge.hidden = true;
    try { window.sessionStorage.setItem('glimty.nudge', 'off'); } catch (err) { /* private mode */ }
  }
  document.querySelectorAll('[data-close-nudge]').forEach((el) => {
    el.addEventListener('click', dismissNudge);
  });

  document.querySelectorAll('[data-open-chat]').forEach((el) => {
    el.addEventListener('click', openChat);
  });
  document.querySelectorAll('[data-close-chat]').forEach((el) => {
    el.addEventListener('click', closeChat);
  });
})();
