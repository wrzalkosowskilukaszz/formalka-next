/* ── Boot ──────────────────────────────────────────────────────────────────── */
function reset() {
  RUN++; FLOW++;
  S = freshState();
  newChat();
  builderEl = null;
  BN.clear();
  ACTS.clear();
  $('#layer').innerHTML = '';
  $('#toast').innerHTML = '';
  render();
  later(1700, () => { if (S.screen === 'splash') { $('.splash')?.classList.add('out'); later(380, () => go('home', 'none')); } });
}
function boot() {
  if (!E) { document.body.textContent = 'Nie udało się wczytać silnika spraw.'; return; }
  $$('[data-travel]').forEach((b) => {
    const n = Number(b.dataset.travel);
    b.innerHTML = `${icon('fast-forward')} ${b.dataset.label || `+${n} ${plural(n, 'dzień', 'dni', 'dni')}`}`;
    b.setAttribute('aria-label', `Przewiń czas o ${n} ${plural(n, 'dzień', 'dni', 'dni')}`);
    b.onclick = () => travel(n);
  });
  $$('[data-reset]').forEach((b) => { b.innerHTML = `${icon('arrow-counter-clockwise')}${b.dataset.label ? ` ${b.dataset.label}` : ''}`; b.onclick = reset; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#layer').firstElementChild && !$('.lock')) closeLayer(); });
  document.documentElement.lang = 'pl';
  reset();
}
boot();
