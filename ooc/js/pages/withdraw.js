
const WD_RULE = { min: 500, daily: 100000, instapay: 50000, maxAccts: 5 };
const PAYOUT_BANKS = ['BDO Unibank', 'BPI', 'Metrobank', 'UnionBank', 'Security Bank', 'Land Bank', 'PNB', 'RCBC', 'China Bank', 'EastWest Bank'];
const PAYOUT_TYPES = [['bank', 'Bank Account'], ['gcash', 'GCash'], ['maya', 'Maya']];
ME.payout = ME.payout || [
  { id: 'pa1', type: 'gcash', name: 'GCash', num: '09175550142', def: true },
  { id: 'pa2', type: 'bank', name: 'BDO Unibank', num: '001234567890' },
];
const WD = { acct: null, amt: '' };
const wdToday = () => WALLET_SEED.filter(x => x.kind === 'withdraw' && x.today).reduce((s, x) => s + Math.abs(x.amt), 0);
const maskNum = (a) => a.type === 'bank' ? '•••• ' + a.num.slice(-4) : a.num.slice(0, 4) + ' ••• ' + a.num.slice(-4);
const payoutBadge = a => `<span class="ooc-pa-b ooc-pa-${a.type}">${a.type === 'bank' ? esc(a.name.split(' ')[0]) : a.type === 'gcash' ? 'GCash' : 'Maya'}</span>`;
const arrival = (a, amt) => !a ? '—' : a.type !== 'bank' ? 'Within 15 minutes' : amt > WD_RULE.instapay ? 'Next banking day (PESONet)' : 'Within 30 minutes (InstaPay)';
const payoutLabel = a => `${a.name} ${maskNum(a)}`;

Object.assign(TITLES, { withdraw: 'Withdraw', 'payout-accounts': 'Withdrawal Accounts' });
Object.assign(PAGES, {
  withdraw() {
    const accts = ME.payout, sel = accts.find(a => a.id === WD.acct) || accts.find(a => a.def) || accts[0];
    if (sel) WD.acct = sel.id;
    const pending = WALLET_SEED.filter(x => x.kind === 'withdraw' && x.st === 'Pending').reduce((s, x) => s + Math.abs(x.amt), 0);
    const left = Math.max(0, WD_RULE.daily - wdToday());
    return `<div class="ooc-panel bg-maroon-gradient ooc-wd-head">
        <small>WITHDRAWABLE BALANCE</small><b>${money(ME.wallet)}</b>
        ${pending ? `<span>${money(pending)} pending</span>` : ''}</div>
      ${section('Withdraw To', accts.length ? `<div class="ooc-wd-accts" role="radiogroup" aria-label="Withdrawal account">${accts.map(a => `
          <label class="ooc-wd-acct"><input type="radio" name="wdAcct" value="${a.id}"${a === sel ? ' checked' : ''}>
            ${payoutBadge(a)}<span class="ooc-wd-acct-i"><b>${esc(a.name)}</b><em>${maskNum(a)} · ${esc(ME.full)}</em></span>${a.def ? '<i class="ooc-pa-def">Default</i>' : ''}</label>`).join('')}</div>
          <div class="ooc-wd-links"><button type="button" class="ooc-link" data-pa-add="withdraw">+ Add account</button><a class="ooc-link" href="#cards/withdraw">Manage accounts ›</a></div>`
        : `<div class="ooc-card ooc-wd-empty"><p>Add a bank account or e-wallet in your name to withdraw.</p>${btn('btnGold', 'Add Account', 'data-pa-add="withdraw"')}</div>`)}
      ${section('Amount', `<div class="ooc-card ooc-wd-amt">
          <label class="ooc-wd-in"><span>₱</span><input id="wdAmt" type="number" inputmode="numeric" min="${WD_RULE.min}" step="100" placeholder="0" value="${WD.amt}" aria-label="Withdrawal amount"></label>
          <div class="ooc-wd-chips">${[1000, 5000, 10000].map(v => `<button type="button" data-wd-q="${v}">${money(v)}</button>`).join('')}<button type="button" data-wd-q="all">All</button></div>
          <p class="ooc-wd-hint" id="wdHint">Min ${money(WD_RULE.min)} · ${money(left)} left today</p>
          <div class="ooc-wd-sum">${kv('Fee', 'Free')}${kv("You'll receive", '—', 'is-total', 'wdGet')}${kv('Estimated arrival', arrival(sel, 0), '', 'wdEta')}</div>
          ${btn('btnGold', 'Withdraw', 'id="wdGo" disabled')}
        </div>`)}
      ${(setTimeout(wdUpdate, 0), '')}`;
  },
  'payout-accounts'() {
    const accts = ME.payout;
    return `<div class="ooc-cardlist">${accts.length ? accts.map(a => `
        <div class="ooc-cardrow"><div class="ooc-cardrow-l">${payoutBadge(a)}<span class="ooc-wd-acct-i"><b>${esc(a.name)}</b><em>${maskNum(a)} · ${esc(ME.full)}</em></span></div>
          <div class="ooc-cardrow-r">${a.def ? '<i class="ooc-pa-def">Default</i>' : `<button type="button" class="ooc-link" data-pa-def="${a.id}">Set default</button>`}<button type="button" class="ooc-link ooc-link-del" data-pa-del="${a.id}">Remove</button></div></div>`).join('')
      : '<div class="ooc-muted-d">No withdrawal accounts yet.</div>'}</div>
      ${accts.length < WD_RULE.maxAccts ? btn('btnGold', 'Add Account', 'data-pa-add="list"') : `<p class="ooc-small">You can save up to ${WD_RULE.maxAccts} accounts.</p>`}`;
  },
});

function wdUpdate() {
  const i = $('#wdAmt'); if (!i) return;
  const amt = Math.floor(+i.value || 0), a = ME.payout.find(x => x.id === WD.acct), left = Math.max(0, WD_RULE.daily - wdToday());
  WD.amt = i.value;
  let err = '';
  if (amt && amt < WD_RULE.min) err = `Minimum withdrawal is ${money(WD_RULE.min)}`;
  else if (amt > ME.wallet) err = 'Amount exceeds your withdrawable balance';
  else if (amt > left) err = `Daily limit reached · ${money(left)} left today`;
  $('#wdHint').textContent = err || `Min ${money(WD_RULE.min)} · ${money(left)} left today`;
  $('#wdHint').classList.toggle('is-err', !!err);
  $('#wdGet').textContent = amt && !err ? money(amt) : '—';
  $('#wdEta').textContent = arrival(a, amt);
  $('#wdGo').disabled = !a || !amt || !!err;
}

function addPayoutModal(from) {
  const st = { type: 'bank' };
  const form = () => `
    <div class="ooc-pm ooc-pa-types" role="radiogroup" aria-label="Account type">${PAYOUT_TYPES.map(([k, t]) => `<label><input type="radio" name="paType" value="${k}"${k === st.type ? ' checked' : ''}><span>${t}</span></label>`).join('')}</div>
    <div class="ooc-form2">${st.type === 'bank' ? select('Bank', 'paBank', PAYOUT_BANKS, PAYOUT_BANKS[0]) : ''}
      ${field(st.type === 'bank' ? 'Account number' : 'Mobile number', `id="paNum" inputmode="numeric" placeholder="${st.type === 'bank' ? '10–16 digits' : '09XX XXX XXXX'}" autocomplete="off"`)}
      ${field('Account name', `value="${esc(ME.full)}" readonly`)}</div>
    <p class="ooc-small" id="paErr"></p>`;
  modal('Add Withdrawal Account', `<div id="paForm">${form()}</div>`, {
    ok: 'Save Account', onOk: async () => {
      const num = ($('#paNum').value || '').replace(/\D/g, '');
      const ok = st.type === 'bank' ? /^\d{10,16}$/.test(num) : /^09\d{9}$/.test(num);
      if (!ok) { $('#paErr').textContent = st.type === 'bank' ? 'Enter a valid account number (10–16 digits).' : 'Enter a valid mobile number (09XX XXX XXXX).'; $('#paErr').classList.add('ooc-warn'); throw new Error('invalid'); }
      if (ME.payout.some(a => a.type === st.type && a.num === num)) { $('#paErr').textContent = 'This account is already saved.'; $('#paErr').classList.add('ooc-warn'); throw new Error('dup'); }
      await new Promise(r => setTimeout(r, 500));
      const a = { id: 'pa' + Date.now().toString(36), type: st.type, name: st.type === 'bank' ? $('#paBank').value : st.type === 'gcash' ? 'GCash' : 'Maya', num, def: !ME.payout.length };
      ME.payout.push(a); if (from === 'withdraw') WD.acct = a.id;
      closeLayer(); refresh(); toast('Withdrawal account saved');
    } });
  $('#paForm').addEventListener('change', e => { if (e.target.name === 'paType') { st.type = e.target.value; $('#paForm').innerHTML = form(); } });
}

function wdConfirm() {
  const amt = Math.floor(+$('#wdAmt').value || 0), a = ME.payout.find(x => x.id === WD.acct); if (!a || !amt) return;
  modal('Confirm Withdrawal', `
    <div class="ooc-wd-conf">${kv('Amount', money(amt), 'is-total')}${kv('To', payoutLabel(a))}${kv('Estimated arrival', arrival(a, amt))}</div>
    <p class="ooc-small">Enter the 6-digit code sent to ${ME.phone.replace(/(\d{3})\s?\d{3}\s?(\d{4})$/, '$1 ••• $2')}. <span class="ooc-muted-d">(Demo code: 123456)</span></p>
    ${field('Verification code', 'id="wdOtp" inputmode="numeric" maxlength="6" autocomplete="one-time-code"')}
    <p class="ooc-small" id="wdOtpErr"></p>`, {
    ok: 'Confirm Withdrawal', onOk: async () => {
      if ($('#wdOtp').value.trim() !== '123456') { $('#wdOtpErr').textContent = 'Incorrect code. Please try again.'; $('#wdOtpErr').classList.add('ooc-warn'); throw new Error('otp'); }
      await new Promise(r => setTimeout(r, 700));
      ME.wallet -= amt;
      WALLET_SEED.unshift({ t: clock(), kind: 'withdraw', title: 'Withdrawal', sub: `${payoutLabel(a)} · ${rid('WD')}`, amt: -amt, st: 'Pending', today: true });
      WD.amt = ''; S.wtab = 'withdraw';
      if (typeof notify === 'function') notify({ title: 'Withdrawal submitted', body: `${money(amt)} to ${payoutLabel(a)} · ${arrival(a, amt)}.`, link: '#wallet' });
      closeLayer(); renderAuth(); go('wallet'); toast(`${money(amt)} withdrawal submitted`);
    } });
}

document.addEventListener('input', e => { if (e.target.id === 'wdAmt') wdUpdate(); });
document.addEventListener('change', e => { if (e.target.name === 'wdAcct') { WD.acct = e.target.value; wdUpdate(); } });
document.addEventListener('click', e => {
  if (e.target.closest('[data-action="withdraw"]')) { e.preventDefault(); e.stopImmediatePropagation(); closeLayer(); go('withdraw'); return; }
  const q = e.target.closest('[data-wd-q]');
  if (q) { const i = $('#wdAmt'); i.value = q.dataset.wdQ === 'all' ? Math.min(ME.wallet, Math.max(0, WD_RULE.daily - wdToday())) : q.dataset.wdQ; wdUpdate(); return; }
  if (e.target.closest('#wdGo')) { wdConfirm(); return; }
  const add = e.target.closest('[data-pa-add]');
  if (add) { if (ME.payout.length >= WD_RULE.maxAccts) { toast(`You can save up to ${WD_RULE.maxAccts} accounts`, true); return; } addPayoutModal(add.dataset.paAdd); return; }
  const def = e.target.closest('[data-pa-def]');
  if (def) { ME.payout.forEach(a => a.def = a.id === def.dataset.paDef); refresh(); toast('Default account updated'); return; }
  const del = e.target.closest('[data-pa-del]');
  if (del) {
    const a = ME.payout.find(x => x.id === del.dataset.paDel); if (!a) return;
    modal('Remove Account', `<p class="ooc-small">Remove ${esc(payoutLabel(a))}? Pending withdrawals to this account are not affected.</p>`, { ok: 'Remove', onOk: async () => {
      ME.payout = ME.payout.filter(x => x !== a); if (a.def && ME.payout[0]) ME.payout[0].def = true; if (WD.acct === a.id) WD.acct = null;
      closeLayer(); refresh(); toast('Account removed');
    } });
  }
}, true);

Object.assign(SOLID, { 'payout-accounts': 'M12 1.5l10 6V10H2V7.5l10-6zM4 11.5h3v7H4zm6.5 0h3v7h-3zm6.5 0h3v7h-3zM2 20h20v2.5H2z' });

const PA_TABS = [['pay', 'Pay'], ['withdraw', 'Withdraw']];
const _cardsPage = PAGES.cards, _payoutPage = PAGES['payout-accounts'];
Object.assign(TITLES, { cards: 'Payment Accounts' });
PAGES.cards = function () {
  if (S.param && PA_TABS.some(t => t[0] === S.param)) { S.patab = S.param; S.param = null; history.replaceState(null, '', '#cards'); }
  if (isUnverified()) return _cardsPage();
  const tab = PA_TABS.some(t => t[0] === S.patab) ? S.patab : 'pay';
  return tabs(PA_TABS, tab, 'patab', 'Account types') + (tab === 'pay' ? _cardsPage() : _payoutPage());
};
