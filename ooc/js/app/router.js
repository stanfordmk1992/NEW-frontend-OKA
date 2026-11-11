

const RESORT_SET = ['stay', 'dine', 'wellness', 'ent', 'shop'];
const ACCOUNT_SET = ['account', 'bookings', 'vouchers', 'points', 'payments', 'cards', 'profile', 'kyc', 'wallet', 'spending', 'bets', 'withdraw', 'payout-accounts', 'freeplay', 'rg'];
const LOGIN_ONLY = ['tasks'];

const ALIAS = { 'payout-accounts': ['cards']  , payments: ['spending']  , resort: ['stay'], experience: ['ent'], events: ['ent'], entertainment: ['ent'], cart: ['shop'] };
function go(r, param) { const h = '#' + r + (param ? '/' + param : ''); if (location.hash === h) route(); else location.hash = h; }

const DRAFT_PAGE = { stay: 'stay', dine: 'dine', wellness: 'wellness', shop: 'shop', event: 'ent' };
const PARENT = {
  providers: () => ['#lobby', 'Home'], fav: () => ['#lobby', 'Home'], recent: () => ['#lobby', 'Home'], leaderboard: () => ['#lobby', 'Home'],
  invite: () => S.login ? ['#account', 'My Account'] : ['#lobby', 'Home'],
  tasks: () => ['#lobby', 'Home'],
  rewards: () => ['#lobby', 'Home'],
  withdraw: () => ['#wallet', 'Wallet'], 'payout-accounts': () => ['#account', 'My Account'],
  kyc: () => ['#account', 'My Account'], result: () => ['#bookings', 'My Bookings'],
  checkout: () => { const k = S.draft && DRAFT_PAGE[S.draft.kind]; return k ? ['#' + k, TITLES[k]] : ['#stay', 'Stay']; },
};
const backLink = backBtn;
function render(r) {
  let head = '';
  if (r === 'promo' && S.param) { const e = PROMOS.find(x => x.id === S.param); head = pageHead(e ? e.title : 'Promotion', promoBack(e)); }

  else if (RESORT_SET.includes(r)) head = `<div class="ooc-landscape-only">${pageHead(TITLES[r])}</div>`;
  else if (TITLES[r]) head = pageHead(TITLES[r], ACCT_SUB.includes(r) ? ['#account', 'My Account'] : PARENT[r]?.() || null);
  else if (PARENT[r]) head = `<header class="ooc-pagehead ooc-pagehead-back">${backLink(PARENT[r]())}</header>`;
  $('#ooc-main').innerHTML = head + PAGES[r]();
  $$('#ooc-main [role=tablist]').forEach(l => { const t = l.querySelector('[aria-selected="true"]'); if (t) l.scrollLeft = t.offsetLeft - (l.clientWidth - t.clientWidth) / 2; });
  $$('#ooc-main .ooc-rct-row').forEach(l => { const t = l.querySelector('.is-sel'); if (t) l.scrollLeft = t.offsetLeft - (l.clientWidth - t.clientWidth) / 2; });
  if (r === 'checkout') updateCheckout();
  if (r === 'games') watchSentinel();
}
function route() {
  let [r0, param] = (location.hash || '#lobby').slice(1).split('/');

  if (r0 === 'vouchers' || r0 === 'points') { param = r0 === 'points' ? 'history' : 'vouchers'; r0 = 'rewards'; history.replaceState(null, '', '#rewards/' + param); }
  let r = r0;
  if (r === 'login') {
    if (S.login) { const back = S.returnHash || '#lobby'; S.returnHash = null; history.replaceState(null, '', back); return route(); }
    if ($('#ooc-layer').innerHTML) closeLayer(); $('#ooc-main').dataset.page = 'login'; showLogin(); return;
  }
  hideLogin();
  if (ALIAS[r]) { const [to] = ALIAS[r]; if (r === 'payout-accounts') { S.patab = 'withdraw'; } history.replaceState(null, '', '#' + to); r = to; }

  if ((ACCOUNT_SET.includes(r) || LOGIN_ONLY.includes(r)) && !S.login) { S.returnHash = '#' + r + (param ? '/' + param : ''); history.replaceState(null, '', '#login'); return route(); }
  if (!PAGES[r]) r = 'lobby';
  if (r === 'invite' && isUnverified()) { history.replaceState(null, '', '#account'); r = 'account'; setTimeout(inviteKycGate, 0); }
  if (['vouchers', 'points', 'payments', 'wallet', 'spending', 'bets', 'withdraw', 'payout-accounts', 'freeplay'].includes(r) && isUnverified())   { history.replaceState(null, '', '#account'); r = 'account'; }
  if (r === 'rewards' && !param && $('#ooc-main').dataset.page !== 'rewards') S.rwtab = 'overview';
  S.param = param || null;
  if ($('#ooc-layer').innerHTML && !$('.ooc-gw')) closeLayer();
  expireOrders();
  $('#ooc-main').dataset.page = r;
  render(r); pageEnter();
  $$('a.sidebarButton[data-route]').forEach(a => a.classList.toggle('active', a.dataset.route === r));
  $$('[data-route]:not(.sidebarButton)').forEach(a => a.classList.toggle('ooc-on', a.dataset.route === r || (a.dataset.route === 'resort' && RESORT_SET.includes(r))));
  $$('[data-action="account"]').forEach(a => a.classList.toggle('ooc-on', ACCOUNT_SET.includes(r) || (r === 'invite' && S.login)));
  if (r === 'lobby') loadHighlights('#ooc-hl-lobby');
  kycAfterRoute(r);
  window.scrollTo(0, 0);
}

function pageEnter(soft) { const m = $('#ooc-main'); m.classList.remove('ooc-enter', 'ooc-enter-soft'); void m.offsetWidth; m.classList.add(soft ? 'ooc-enter-soft' : 'ooc-enter'); }
function refresh() {
  if (ACCOUNT_SET.includes($('#ooc-main').dataset.page) && !S.login) { go('lobby'); renderAuth(); return; }
  renderAuth();
  const p = $('#ooc-main').dataset.page; if (!p || p === 'lobby') return;
  const y = scrollY; render(p); scrollTo(0, y);
}
