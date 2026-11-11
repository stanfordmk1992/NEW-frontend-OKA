
const RG = { limits: { day: 0, week: 0, month: 0 }, pending: {}, reminder: 30, coolUntil: 0, excludeUntil: 0, sessionStart: Date.now(), lastRemind: Date.now() };
const RG_PERIODS = [['day', 'Daily'], ['week', 'Weekly'], ['month', 'Monthly']];
const RG_PRESETS = [0, 5000, 10000, 20000, 50000, 100000];
const RG_COOL = [[1, '24 hours'], [7, '7 days'], [30, '30 days']];
const RG_EXCL = [[182, '6 months'], [365, '1 year'], [1825, '5 years']];
const RG_HELP = '(02) 8248-9568';
const rgFmtDate = t => new Date(t).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const rgBlocked = () => Math.max(RG.coolUntil, RG.excludeUntil) > Date.now();

const rgDeposited = () => S.ledger.filter(l => l.type === 'GATEWAY' && /^Deposit/.test(l.label || '')).reduce((s, l) => s + l.amount, 0);
function rgDepositLeft() { const used = rgDeposited(); return RG_PERIODS.map(([p]) => RG.limits[p] ? RG.limits[p] - used : Infinity).reduce((a, b) => Math.min(a, b), Infinity); }

function rgDepositCheck(amt) { const left = rgDepositLeft(); return amt > left ? (left <= 0 ? 'You have reached your deposit limit.' : `Deposit limit: ${money(left)} left.`) : ''; }
function rgBlockedSheet() {
  const ex = RG.excludeUntil > Date.now();
  modal(ex ? 'Self-Exclusion Active' : 'Taking a Break', `<p class="ooc-small">${ex ? 'You have excluded yourself from Okada Online gaming' : 'Your cool-off period is active'} until <b>${rgFmtDate(ex ? RG.excludeUntil : RG.coolUntil)}</b>. Deposits and games are unavailable during this time.</p>
    <p class="ooc-small">Need to talk to someone? National Problem Gambling Helpline <a class="ooc-gold" href="tel:+63282489568">${RG_HELP}</a>.</p>`, { ok: null, cancel: 'Close' });
}

Object.assign(TITLES, { rg: 'Responsible Gaming' });
Object.assign(PAGES, {
  rg() {
    const used = rgDeposited(), now = Date.now();
    const lim = RG_PERIODS.map(([p, l]) => {
      const pend = RG.pending[p];
      return `<div class="ooc-rg-lim"><div class="ooc-rg-lim-h"><b>${l} limit</b><span>${RG.limits[p] ? `${money(Math.max(0, RG.limits[p] - used))} left` : 'No limit'}</span></div>
        ${select(`<span class="sr-only">${l} deposit limit</span>`, 'rgL-' + p, RG_PRESETS.map(v => [v, v ? money(v) : 'No limit']), RG.limits[p])}
        ${pend ? `<small class="ooc-rg-pend">Changes to ${pend.v ? money(pend.v) : 'No limit'} on ${rgFmtDate(pend.at)}</small>` : ''}</div>`;
    }).join('');
    const block = rgBlocked() ? `<div class="ooc-rw-exp ooc-rg-active"><b>${RG.excludeUntil > now ? 'Self-exclusion' : 'Cool-off'} active</b> until ${rgFmtDate(Math.max(RG.coolUntil, RG.excludeUntil))}</div>` : '';
    return block + section('Deposit Limits', `<div class="ooc-card ooc-rg">${lim}
        <p class="ooc-rg-note">Lower limits apply immediately. Higher limits or removing a limit take effect after 24 hours.</p>
        ${btn('btnGold', 'Save Limits', 'data-rg-save')}</div>`)
      + section('Session Reminder', `<div class="ooc-card ooc-rg"><div class="ooc-rg-opts" role="radiogroup" aria-label="Session reminder">${[[15, '15 min'], [30, '30 min'], [60, '60 min'], [0, 'Off']].map(([v, l]) => `<button type="button" role="radio" aria-checked="${RG.reminder === v}" class="ooc-rg-opt${RG.reminder === v ? ' is-on' : ''}" data-rg-rem="${v}">${l}</button>`).join('')}</div>
        <button type="button" class="ooc-link" data-rg-preview>Preview reminder</button></div>`)
      + section('Take a Break', `<div class="ooc-card ooc-rg"><p class="ooc-rg-note">Pause deposits and games for a while. A break can't be cancelled early.</p>
        <div class="ooc-rg-opts">${RG_COOL.map(([d, l]) => `<button type="button" class="ooc-rg-opt" data-rg-cool="${d}"${rgBlocked() ? ' disabled' : ''}>${l}</button>`).join('')}</div></div>`)
      + section('Self-Exclusion', `<div class="ooc-card ooc-rg"><p class="ooc-rg-note">Exclude yourself from Okada Online gaming. You'll be logged out immediately and can't play until the period ends.</p>
        <div class="ooc-rg-opts">${RG_EXCL.map(([d, l]) => `<button type="button" class="ooc-rg-opt ooc-rg-danger" data-rg-excl="${d}">${l}</button>`).join('')}</div></div>`)
      + `<div class="ooc-card ooc-rg-help"><b>Need help?</b><span>National Problem Gambling Helpline</span><a class="${UI.btnPlum}" href="tel:+63282489568">Call ${RG_HELP}</a></div>`;
  },
});
Object.assign(SOLID, { rg: 'M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3zm-1 13.5l5.5-5.5-1.4-1.4-4.1 4.1-2.1-2.1-1.4 1.4 3.5 3.5z' });

function rgRealityCheck() {
  const mins = Math.max(1, Math.round((Date.now() - RG.sessionStart) / 60000));
  modal('Session Reminder', `<p class="ooc-small">You've been playing for <b>${mins} minute${mins === 1 ? '' : 's'}</b>.</p>
    <p class="ooc-small">Take regular breaks and only play with money you can afford to lose.</p>`,
    { ok: 'Keep Playing', alt: 'Take a Break', cancel: null, onOk: async () => { RG.lastRemind = Date.now(); closeLayer(); }, onAlt: async () => { RG.lastRemind = Date.now(); closeLayer(); go('rg'); } });
}
setInterval(() => { if (S.login && RG.reminder && !rgBlocked() && Date.now() - RG.lastRemind >= RG.reminder * 60000 && !$('#ooc-layer section[role=dialog]:not(.ooc-gameframe)')) { RG.lastRemind = Date.now(); rgRealityCheck(); } }, 15000);

document.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('[data-rg-save]')) {
    let msg = [];
    RG_PERIODS.forEach(([p, l]) => {
      const v = +$('#rgL-' + p).value, cur = RG.limits[p];
      if (v === cur) return;
      const lower = v && (!cur || v < cur);
      if (lower) { RG.limits[p] = v; delete RG.pending[p]; msg.push(`${l} limit set to ${money(v)}`); }
      else { RG.pending[p] = { v, at: Date.now() + 864e5 }; msg.push(`${l} limit change takes effect in 24 hours`); }
    });
    toast(msg.length ? msg[0] + (msg.length > 1 ? ` (+${msg.length - 1} more)` : '') : 'No changes'); refresh(); return;
  }
  const rem = t.closest('[data-rg-rem]'); if (rem) { RG.reminder = +rem.dataset.rgRem; RG.lastRemind = Date.now(); toast(RG.reminder ? `Reminder every ${RG.reminder} minutes` : 'Session reminder off'); refresh(); return; }
  if (t.closest('[data-rg-preview]')) { rgRealityCheck(); return; }
  const cool = t.closest('[data-rg-cool]');
  if (cool) { const d = +cool.dataset.rgCool, l = RG_COOL.find(x => x[0] === d)[1];
    modal(`Take a ${l} Break?`, `<p class="ooc-small">Deposits and games will be unavailable until <b>${rgFmtDate(Date.now() + d * 864e5)}</b>. This can't be cancelled early.</p>`,
      { ok: 'Start Break', onOk: async () => { RG.coolUntil = Date.now() + d * 864e5; closeLayer(); toast(`Break started · ${l}`); refresh(); } });
    return; }
  const ex = t.closest('[data-rg-excl]');
  if (ex) { const d = +ex.dataset.rgExcl, l = RG_EXCL.find(x => x[0] === d)[1];
    modal(`Self-Exclude for ${l}?`, `<p class="ooc-small">You'll be logged out now and can't play on Okada Online until <b>${rgFmtDate(Date.now() + d * 864e5)}</b>. This can't be reversed.</p>
      <label class="ooc-check"><input type="checkbox" id="rgExOk"> <span>I understand and want to self-exclude.</span></label>`,
      { ok: 'Self-Exclude', onOk: async () => { if (!$('#rgExOk').checked) { toast('Please confirm to continue', true); throw 0; } RG.excludeUntil = Date.now() + d * 864e5; closeLayer(); S.login = false; refresh(); toast(`Self-excluded for ${l}`); } });
    return; }
}, true);

const _rgLaunch = launchGame;
launchGame = function (name, provider, mode) { if (mode === 'real' && rgBlocked()) { rgBlockedSheet(); return; } return _rgLaunch(name, provider, mode); };
const _rgDeposit = depositModal;
depositModal = function () { if (S.login && rgBlocked()) { rgBlockedSheet(); return; } return _rgDeposit(); };
