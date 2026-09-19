(() => {
  const KEY = 'glimty.recent';
  const section = document.querySelector('[data-recent]');
  if (!section) return;
  const current = section.getAttribute('data-current');

  let ids = [];
  try { ids = JSON.parse(window.localStorage.getItem(KEY) || '[]').filter((id) => typeof id === 'string'); } catch (err) { ids = []; }

  const others = ids.filter((id) => id !== current);
  if (current) {
    try { window.localStorage.setItem(KEY, JSON.stringify([current, ...others].slice(0, 8))); } catch (err) { /* private mode */ }
  }
  if (!others.length) return;

  const locale = window.GLIMTY?.locale || 'nb';
  fetch(`/fragments/gifts?lang=${encodeURIComponent(locale)}&ids=${encodeURIComponent(others.slice(0, 4).join(','))}`)
    .then((res) => (res.ok ? res.text() : ''))
    .then((html) => {
      if (!html.trim()) return;
      section.querySelector('[data-recent-grid]').innerHTML = html;
      section.hidden = false;
    })
    .catch(() => {});
})();
