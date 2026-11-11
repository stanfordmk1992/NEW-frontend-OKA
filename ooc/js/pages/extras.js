

PAGES.leaderboard = function () {
  const rows = [...lobbyTpl().querySelectorAll('.topPayoutMarquee .payoutEntry')].map(e => ({
    player: e.querySelector('.playerName .value')?.textContent.trim() || '—', game: e.querySelector('.gameName .value')?.textContent.trim() || '',
    time: e.querySelector('.dateTime .value')?.textContent.trim() || '', amount: e.querySelector('.amount .value')?.textContent.trim() || '' }));
  const seen = new Set(), amt = s => Number(String(s).replace(/[^\d.]/g, '')) || 0;
  const list = rows.filter(r => { const k = r.player + r.time + r.amount; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => amt(b.amount) - amt(a.amount));

  let sd = 4242; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647, A = 'ABCDEFGHJKLMNPRSTVWY', pool = (GAMES || []).filter(g => g.name);
  while (list.length < 10) { const last = amt(list[list.length - 1]?.amount) || 60000, v = Math.round(last * (0.72 + rnd() * 0.2) / 10) * 10;
    list.push({ player: `${A[Math.floor(rnd() * 20)]}***** ${A[Math.floor(rnd() * 20)]}******`, game: pool.length ? pool[Math.floor(rnd() * pool.length)].name : '', time: `2026-11-0${1 + Math.floor(rnd() * 9)} ${String(10 + Math.floor(rnd() * 13)).padStart(2, '0')}:${String(Math.floor(rnd() * 60)).padStart(2, '0')}`, amount: '₱' + v.toLocaleString('en-US', { minimumFractionDigits: 2 }) }); }
  list.length = 10;
  if (!list.length) return '<div class="ooc-muted-d">No payouts yet.</div>';
  const pod = [list[1], list[0], list[2]].map((r, i) => r ? `<div class="ooc-pod ooc-pod-${[2, 1, 3][i]}"><div class="ooc-pod-base"><i>${[2, 1, 3][i]}</i><b>${esc(r.player)}</b><span>${esc(r.amount.replace(/.00$/, ''))}</span><small>${esc(r.game || '')}</small><small>${esc(r.time)}</small></div></div>` : '<div></div>').join('');
  return `<div class="ooc-podium">${pod}</div>` + (list.length > 3 ? `<div class="ooc-list ooc-lb">${list.slice(3).map((r, i) => `
    <div class="ooc-li"><span><b class="ooc-lb-rank">${i + 4}</b>${esc(r.player)}<em>${esc([r.game, r.time].filter(Boolean).join(' · '))}</em></span><b class="ooc-pts-t">${esc(r.amount)}</b></div>`).join('')}</div>` : '');
};

const HELP_FAQ = [
  ['Account & KYC', [
    ['How do I log in or sign up?', 'Enter your mobile number and the 6-digit code we send you. New numbers are registered automatically. No password is needed.'],
    ['Why do I need to verify my identity (KYC)?', 'Verification is required by PAGCOR. You need to complete KYC within 72 hours of signing up to deposit, withdraw, earn Reward Circle points and claim bonuses.'],
    ['How do I change my mobile number or email?', 'Go to My Account › Profile. For your security, every change is confirmed with a one-time code sent to your mobile number.']]],
  ['Deposits & Withdrawals', [
    ['How can I deposit?', 'Tap + next to your wallet balance and choose GCash, Maya, Bank Transfer (InstaPay) or 7-Eleven. You will be redirected to complete the payment, then returned to Okada Online.'],
    ['How long do withdrawals take?', 'E-wallets usually arrive within 15 minutes. Bank transfers up to PHP 50,000 use InstaPay (within 30 minutes); larger amounts use PESONet (next banking day).'],
    ['Can I cancel a withdrawal?', 'Yes, while it is still Pending. Open Wallet, tap the withdrawal and choose Cancel Withdrawal. The amount returns to your wallet immediately.']]],
  ['Free Play & Promotions', [
    ['How do I use Free Play?', 'Free Play must first be transferred to your Live Slots or Live Casino wallet (My Account › Free Play). It can then be used on games in that category.'],
    ['Does Free Play expire?', 'Yes. Each Free Play credit expires 30 days after it is credited.'],
    ['How do I claim a promotion reward?', 'Join a promotion, play the eligible games until the wagering requirement is met, then tap Claim in the promotion or in Task Center › My Promotions.']]],
  ['Reward Circle', [
    ['What are Tier, Circle and Lifestyle Points?', 'Tier Points decide your membership tier and cannot be spent. Circle Points and Lifestyle Points can be redeemed at 1 point = PHP 1.00.'],
    ['Do my points expire?', 'Tier, Circle and Lifestyle Points are each valid for 12 months on a first-in, first-out basis.']]],
  ['Responsible Gaming', [
    ['How do I set a deposit limit or take a break?', 'Go to My Account › Responsible Gaming to set daily, weekly or monthly deposit limits, session reminders, a cool-off period or self-exclusion.'],
    ['Where can I get help?', 'Call the National Problem Gambling Helpline at (02) 8248-9568.']]],
];
Object.assign(TITLES, { help: 'Help Center' });
PARENT.help = () => ['#lobby', 'Home'];
PAGES.help = function () {
  return HELP_FAQ.map(([cat, qs]) => section(cat, `<div class="ooc-rcb-list">${qs.map(([q, a]) => `<details class="ooc-rcb ooc-faq"><summary><b>${esc(q)}</b></summary><p>${esc(a)}</p></details>`).join('')}</div>`, { icon: `<span class="ooc-sec-ic" aria-hidden="true">${solidI(SEC_AUTO_IC.info)}</span>` })).join('')
    + section('Still need help?', `<div class="ooc-card ooc-help-c">
        <button type="button" class="${UI.btnGold}" data-action="support">Live Chat</button>
        <a class="${UI.btnPlum}" href="tel:+63288880777">Call +632 8888 0777</a>
        <a class="${UI.btnPlum}" href="mailto:support@okadaonline.com">Email Support</a></div>`, { icon: `<span class="ooc-sec-ic" aria-hidden="true">${solidI(SEC_AUTO_IC.steps)}</span>` });
};

(function helpFooter() {
  const grp = document.querySelector('[class*="footer_quickLinkGroupWrapper"]');
  if (grp && !grp.querySelector('.ooc-help-grp')) {
    const first = grp.querySelector('[class*="footer_quickLinkGroup"]'), linkCls = first?.querySelector('a')?.className || '', ulCls = first?.querySelector('ul')?.className || '';
    grp.insertAdjacentHTML('beforeend', `<div class="${first?.className || ''} ooc-help-grp"><h3 title="Help Center">Help Center</h3><ul class="${ulCls}">
      <li><a class="${linkCls}" href="#help">FAQ</a></li><li><a class="${linkCls}" href="javascript:void 0" data-action="support">Customer Service</a></li>
      <li><a class="${linkCls}" href="#rg">Responsible Gaming</a></li><li><a class="${linkCls}" href="#promo/o4">Promotion Terms</a></li></ul></div>`);
  }
  const acc = document.querySelector('[class*="footer_accordion"]');
  if (acc && !acc.querySelector('.ooc-help-acc')) acc.insertAdjacentHTML('beforeend', `<a class="ooc-help-acc" href="#help"><span>HELP CENTER</span><i aria-hidden="true">›</i></a>`);
})();

document.addEventListener('click', e => {
  if (!e.target.closest('[data-action="profile-save"]')) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const mail = ($('#pfMail')?.value || '').trim(), tel = ($('#pfTel')?.value || '').trim();
  if (!/^\S+@\S+\.\S+$/.test(mail)) { toast('Enter a valid email address', true); return; }
  if (mail === ME.email && tel === ME.phone) { toast('No changes to save'); return; }
  modal('Verify Changes', `<p class="ooc-small">Enter the 6-digit code sent to ${esc(ME.phone)} to confirm your profile changes. <span class="ooc-muted-d">(Demo code: 123456)</span></p>
    ${mail !== ME.email ? kv('New email', esc(mail)) : ''}${tel !== ME.phone ? kv('New mobile', esc(tel)) : ''}
    ${field('Verification code', 'id="pfOtp" inputmode="numeric" maxlength="6" autocomplete="one-time-code"')}<p class="ooc-small" id="pfOtpErr"></p>`, {
    ok: 'Confirm', onOk: async () => {
      if ($('#pfOtp').value.trim() !== '123456') { $('#pfOtpErr').textContent = 'Incorrect code. Please try again.'; $('#pfOtpErr').classList.add('ooc-warn'); throw 0; }
      await new Promise(r => setTimeout(r, 500));
      ME.email = mail; ME.phone = tel; closeLayer(); refresh(); toast('Profile updated');
    } });
}, true);

Object.assign(PROMO_RULE.o1, { providers: ['Jili'] });
Object.assign(PROMO_RULE.o2, { providers: ['Habanero'] });
Object.assign(PROMO_RULE.o3, { cat: 'live-casino' });
const promoGames = id => { const r = PROMO_RULE[id] || {}; if (!GAMES) return []; return r.providers ? GAMES.filter(g => r.providers.includes(g.provider)) : r.cat ? gamesOf(r.cat) : []; };
const activePromos = () => S.login ? [...S.joined].filter(id => PROMO_RULE[id] && promoState(id) === 'todo' && (PROMO_RULE[id].providers || PROMO_RULE[id].cat)) : [];

function promoCta(e, full, joined, label) {
  if (e.cat !== 'online' || !joined || full) return btn(full || joined ? 'btnPlum' : 'btnGold', label, `data-promo="${e.id}"${full || joined ? ' disabled' : ''}`);
  const st = promoState(e.id), r = PROMO_RULE[e.id] || {};
  if (st === 'claim') return btn('btnGold', `Claim ${money(r.bonus)} Free Play`, `data-pclaim="${e.id}"`);
  if (st === 'done') return btn('btnPlum', 'Claimed', 'disabled');
  return (r.goal ? `<div class="ooc-pd-prog"><div class="ooc-bar"><i style="width:${Math.min(100, Math.round(r.prog / r.goal * 100))}%"></i></div><span>Wagered ${money(r.prog)} / ${money(r.goal)}</span></div>` : '')
    + (r.link ? `<a class="${UI.btnGold}" href="${r.link}">Invite Friends</a>` : btn('btnGold', 'Play Now', `data-promo-play="${e.id}"`));
}
document.addEventListener('click', e => { const p = e.target.closest('[data-promo-play]'); if (p) { e.preventDefault(); go('games', 'promo:' + p.dataset.promoPlay); } });

const _gamesPage = PAGES.games;
PAGES.games = function () {
  const code = decodeURIComponent(S.param || '');
  if (!code.startsWith('promo:')) return _gamesPage();
  if (!GAMES) { loadGames().then(() => { if ($('#ooc-main').dataset.page === 'games') render('games'); }); return skeleton(6); }
  const id = code.slice(6), e = PROMOS.find(x => x.id === id), r = PROMO_RULE[id] || {}, list = promoGames(id);
  const scope = r.providers ? r.providers.join(', ') + ' games' : (GTITLE[r.cat] || 'Eligible games');
  return pageHead(e ? e.title : 'Promotion', ['#promo/' + id, 'Promotion'])
    + `<div class="ooc-promo-scope"><span>Eligible: <b>${esc(scope)}</b> · ${list.length} games</span>${r.goal ? `<span>Wagered ${money(r.prog)} / ${money(r.goal)}</span>` : ''}</div>`
    + (list.length ? gameGrid(list) : '<div class="ooc-muted-d">No eligible games.</div>');
};

function promoGlowScan() {
  const act = activePromos(); const provs = new Set(act.flatMap(id => PROMO_RULE[id].providers || []));
  const catIds = new Set(act.flatMap(id => PROMO_RULE[id].cat ? gamesOf(PROMO_RULE[id].cat).map(g => g.id) : []));
  document.querySelectorAll('#ooc-main .ooc-game').forEach(c => {
    const t = c.querySelector('.gameTile[data-game]'); if (!t) return;
    const on = provs.has(t.dataset.provider) || catIds.has(t.dataset.gid);
    c.classList.toggle('ooc-glow', on);
    c.querySelector('.ooc-glow-tag')?.remove();
  });
}
let glowT = 0;
new MutationObserver(() => { clearTimeout(glowT); glowT = setTimeout(promoGlowScan, 60); }).observe(document.querySelector('#ooc-main'), { childList: true, subtree: true });
