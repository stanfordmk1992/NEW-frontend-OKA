

const topBtn = $('#ooc-top');
addEventListener('scroll', () => { if (topBtn) topBtn.hidden = scrollY < 400; }, { passive: true });
topBtn && (topBtn.onclick = () => scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
setInterval(() => {
  $$('[data-countdown]').forEach(el => { el.textContent = mmss(+el.dataset.countdown); });
  $$('[data-cd-btn]').forEach(el => { el.textContent = `Continue Payment · ${mmss(+el.dataset.cdBtn)}`; });
  const holdGone = S.draft?.holdExpires && !S.draft.expired && Date.now() > S.draft.holdExpires && (S.draft.expired = true);
  if ((expireOrders() || holdGone) && !$('#ooc-layer').innerHTML) refresh();
}, 1000);

const cats = ['scat', 'dcat', 'wcat', 'shcat', 'pcat', 'bkcat', 'ptcat', 'rctier', 'rwtab', 'ivtab', 'wtab', 'btab', 'ttab', 'patab'];
document.addEventListener('click', e => {
  if ($('#ooc-pop').innerHTML && !e.target.closest('#ooc-pop, .ooc-lang-trigger')) closePop();

  if (browseOpen() && !e.target.closest('#ooc-layer [role=dialog], #ooc-pop')) {
    const inFooter = e.target.closest('footer[class*="MobileFooter_"]');
    closeLayer();
    if (!inFooter || e.target.closest('[data-action="browse"]')) { e.preventDefault(); return; }
  }
  const li = e.target.closest('#ooc-pop li[data-lang]'); if (li) { setLang(li.dataset.lang, li); return; }
  const lt = e.target.closest('.ooc-lang-trigger'); if (lt) { e.preventDefault(); langMenu(lt); return; }
  if (e.target.closest('[data-lg-close]')) { const tgLedger = $('#tgLedger'); if (tgLedger) tgLedger.checked = false; const ledger = $('#ooc-ledger'); if (ledger) ledger.hidden = true; return; }
  const demoBtn = e.target.closest('.ooc-demo'); if (demoBtn) { e.preventDefault(); launchGame(demoBtn.dataset.demo, demoBtn.dataset.provider, 'demo'); return; }

  const g = e.target.closest('.gameTile[data-game]') || (!e.target.closest('button, a') && e.target.closest('.ooc-game')?.querySelector('.gameTile[data-game]')); if (g) { e.preventDefault(); launchGame(g.dataset.game, g.dataset.provider, 'real'); return; }

  const cw = e.target.closest('#ooc-layer [data-close]');
  if (cw && e.target === cw && !cw.matches('button') && cw.querySelector('section[role=dialog] button[data-close]') && !$('.ooc-gw')) { e.preventDefault(); closeLayer(); return; }
  const t = e.target.closest('button, a, [data-act]'); if (!t) return;
  const d = t.dataset;
  if (d.close !== undefined && (e.target === t || t.tagName === 'BUTTON' || e.target.closest('button[data-close]'))) { e.preventDefault(); closeLayer(); return; }
  if (d.gw) { gwAction(d.gw); return; }
  if (d.playReal) { closeLayer(); launchGame(d.playReal, d.provider, 'real'); return; }
  if (d.action === 'browse') { e.preventDefault(); browse(); return; }
  if (d.action === 'support') { e.preventDefault(); closeLayer(); supportModal(); return; }
  if (d.cs) { closeLayer(); toast(d.cs === 'chat' ? 'Connecting to live chat… (mock)' : 'Message form opens here (mock)'); return; }
  if (d.action === 'signup') { e.preventDefault(); goLogin(); return; }
  if (d.action === 'login') { e.preventDefault(); loginModal(); }
  if (d.action === 'drawer') { e.preventDefault(); drawer(); }
  if (d.action === 'deposit') { e.preventDefault(); depositModal(); return; }
  if (d.action === 'account') { e.preventDefault(); S.login ? go('account') : accountGuide(); }
  if (d.action === 'profile-save') { toast('Profile saved'); }
  if (d.rgo) { e.preventDefault(); go(d.rgo); return; }
  if (d.action === 'logout') { S.login = false; const tgLogin = $('#tgLogin'); if (tgLogin) tgLogin.checked = false; closeLayer(); refresh(); }
  if (t.matches('.ooc-drawer a[href^="#"]')) closeLayer();
  if (d.act?.startsWith('go:')) location.hash = d.act.slice(3);
  if (d.act?.startsWith('rsv:')) { const id = d.act.slice(4); if (requireLogin(() => reserveModal(id))) reserveModal(id); return; }
  if (d.act?.startsWith('rdm:')) { const [, id, why] = d.act.split(':'); if (why) { toast(why, true); return; } if (requireLogin(() => redeemModal(id))) redeemModal(id); return; }
  if (d.act?.startsWith('prod:')) { const id = d.act.slice(5); if (requireLogin(() => productModal(id))) productModal(id); return; }
  if (d.trip) {
    S.tripOpen = S.tripOpen === d.trip ? null : d.trip;
    $$('.ooc-trip').forEach(c => { const h = c.querySelector('[data-trip]'), on = h.dataset.trip === S.tripOpen;
      c.classList.toggle('is-open', on); h.setAttribute('aria-expanded', on); c.querySelector('.ooc-trip-b').hidden = !on; });
    return;
  }
  if (d.room) {
    S.roomOpen = S.roomOpen === d.room ? null : d.room;
    $$('#ooc-rooms .ooc-room').forEach(c => { const h = c.querySelector('[data-room]'), on = h.dataset.room === S.roomOpen;
      c.classList.toggle('is-open', on); h.setAttribute('aria-expanded', on); c.querySelector('.ooc-rates').hidden = !on; });
    if (S.roomOpen) t.closest('.ooc-room').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return;
  }
  if (d.route && t.tagName === 'BUTTON') location.hash = d.route;
  const ck = cats.find(k => d[k] !== undefined); if (ck) { e.preventDefault(); S[ck] = d[ck]; refresh(); pageEnter(true); setTimeout(() => $('[role=tab][aria-selected="true"]')?.focus({ preventScroll: true }), 0); }
  if (d.retry) loadHighlights(d.retry);
  if (t.disabled) return;
  if (d.redeem && requireLogin(() => redeemModal(d.redeem))) redeemModal(d.redeem);
  if (d.rate) { const [rm, code] = d.rate.split(':'); if (requireLogin(() => guestModal(rm, code))) guestModal(rm, code); }
  if (d.reserve && requireLogin(() => reserveModal(d.reserve))) reserveModal(d.reserve);
  if (d.prod && requireLogin(() => productModal(d.prod))) productModal(d.prod);
  if (d.promo) promoAction(d.promo);
  if (d.coMax !== undefined) { const r = $('#coPts'); r.value = r.max; updateCheckout(); }
  if (d.coPay !== undefined) placeOrder();
  if (d.oact) {
    const [act, id, m] = d.oact.split(':'), o = S.orders.find(x => x.id === id); if (!o) return;
    if (act === 'pay') { if (o.status === 'PENDING_PAYMENT') gateway(o); }
    if (act === 'abort') { o.status = 'CANCELLED'; returnPoints(o); if (o.kind === 'stay') ledger(o.id, 'SYNXIS', 0, { label: 'ReleaseHold' }); renderAuth(); toast('Order cancelled'); refresh(); }
    if (act === 'retry') retryPay(o, m);
    if (act === 'res') go('result', o.id);
    if (act === 'receipt') receiptModal(o);
    if (act === 'cancel') cancelModal(o);
    if (act === 'change') changeModal(o);
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('#ooc-pop').innerHTML) { closePop(); langAnchor?.focus(); return; }
  if (e.key === 'Escape' && $('#ooc-layer').innerHTML && !$('.ooc-gw')) closeLayer();
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-act], .gameTile[data-game], #ooc-pop li[data-lang]')) { e.preventDefault(); e.target.click(); }
  if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && e.target.matches('#ooc-pop li[data-lang]')) {
    e.preventDefault(); const items = [...$$('#ooc-pop li[data-lang]')], i = items.indexOf(e.target);
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus();
  }
  if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.matches('[role=tab]')) {
    e.preventDefault(); const tabsEl = [...e.target.parentElement.querySelectorAll('[role=tab]')], i = tabsEl.indexOf(e.target);
    tabsEl[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabsEl.length) % tabsEl.length].click();
  }
  if (e.key === 'Tab') {
    const layer = $('#ooc-layer [role=dialog]'); if (!layer) return;
    const f = [...layer.querySelectorAll('button:not(:disabled), input, select, a[href]')]; if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
  }
});
document.addEventListener('submit', async e => {
  if (e.target.id !== 'ooc-stay') return; e.preventDefault();
  const ci = $('#ci').value, co = $('#co').value, err = $('#stayErr'); err.textContent = '';
  if (!ci || !co) { err.textContent = 'Please choose check-in and check-out dates.'; return; }
  const n = nightsOf(ci, co);
  if (n <= 0) { err.textContent = 'Check-out must be after check-in.'; return; }
  if (n > 30) { err.textContent = 'Maximum stay is 30 nights.'; return; }
  if (ci < dayPlus(0)) { err.textContent = 'Check-in can\'t be in the past.'; return; }
  S.stayQ = { ci, co, rooms: +$('#rm').value, ad: +$('#ad').value, ch: +$('#ch').value };
  $('#ooc-rooms').innerHTML = skeleton(4); await sleep(700); refresh();
});

$('aside.sticky')?.insertAdjacentHTML('beforeend', sideFoot());

$$('aside.sticky a.sidebarButton[data-route] .ooc-navicon').forEach(ic => { const r = ic.closest('[data-route]').dataset.route; const d = SOLID[r] || SOLID[{ ent: 'ent' }[r]]; if (d) ic.innerHTML = solidI(d); });
window.addEventListener('hashchange', route);
renderAuth(); route();
