
const DEP_GW = {
  gcash: { name: 'GCash', url: 'https://m.gcash.com/gcashapp/checkout', btn: 'Pay with GCash' },
  maya: { name: 'Maya', url: 'https://payments.maya.ph/checkout', btn: 'Pay with Maya' },
  bank: { name: 'Bank Transfer (InstaPay)', url: 'https://instapay.example-bank.ph/transfer', btn: 'Confirm Transfer' },
  otc: { name: '7-Eleven (CLiQQ)', url: 'https://cliqq.7-eleven.com.ph/pay', btn: 'Generate Payment Code' },
};
const TX_STEPS = { withdraw: ['Submitted', 'Processing', 'Completed'], deposit: ['Submitted', 'Payment', 'Completed'] };

WALLET_SEED.push(
  { t: 'Nov 06 18:20', kind: 'withdraw', title: 'Withdrawal', sub: 'BDO Unibank •••• 7890 · WD-9P2QK', amt: -8000, st: 'Processing' },
  { t: 'Nov 04 11:47', kind: 'withdraw', title: 'Withdrawal', sub: 'Maya 0918 ••• 4567 · WD-4LX8C', amt: -2500, st: 'Failed', why: 'Account name did not match. Funds returned to your wallet.' },
  { t: 'Nov 03 09:15', kind: 'withdraw', title: 'Withdrawal', sub: 'GCash 0917 ••• 0142 · WD-2HT6N', amt: -1500, st: 'Cancelled' },
);
let txSeq = 0;
const txInit = x => { if (!x.id) x.id = 'tx' + (++txSeq); if (!x.log) x.log = { Submitted: x.t }; return x; };
WALLET_SEED.forEach(txInit);
const txFind = id => WALLET_SEED.find(x => x.id === id);

depositModal = function () {
  if (!S.login) return goLogin(location.hash);
  const st = { amt: 1000, m: 'gcash' };
  modal('Deposit', `
    <div class="ooc-dep">
      <div class="ooc-dep-g" role="radiogroup" aria-label="Amount">${DEPOSIT_AMTS.map(v => `<button type="button" role="radio" class="ooc-dep-o" data-dep-amt="${v}" aria-checked="${v === st.amt}">${money(v)}</button>`).join('')}</div>
      <div class="ooc-dep-g" role="radiogroup" aria-label="Method">${DEPOSIT_METHODS.map(([k, t]) => `<button type="button" role="radio" class="ooc-dep-o" data-dep-m="${k}" aria-checked="${k === st.m}">${t}</button>`).join('')}</div>
    </div>`, {
    ok: 'Continue', onOk: async () => {
      const rgErr = typeof rgDepositCheck === 'function' ? rgDepositCheck(st.amt) : ''; if (rgErr) { toast(rgErr, true); throw 0; }
      await new Promise(r => setTimeout(r, 400));
      const req = txInit({ t: clock(), kind: 'deposit', title: 'Deposit', sub: `${DEP_GW[st.m].name.replace(/ \(.*\)/, '')} · ${rid('DEP')}`, amt: st.amt, st: 'Pending', m: st.m });
      WALLET_SEED.unshift(req);
      closeLayer(); depGateway(req);
    } });
  $('#ooc-layer .ooc-dep').addEventListener('click', e => {
    const b = e.target.closest('.ooc-dep-o'); if (!b) return;
    b.parentElement.querySelectorAll('.ooc-dep-o').forEach(x => x.setAttribute('aria-checked', x === b));
    if (b.dataset.depAmt) st.amt = +b.dataset.depAmt; else st.m = b.dataset.depM;
  });
};
function depGateway(req) {
  const g = DEP_GW[req.m], ref = req.sub.split(' · ').pop();
  S.dgw = req.id; lastFocus = document.activeElement;
  $('#ooc-layer').innerHTML = `
    <div tabindex="-1" class="ooc-portal">
    <section class="ooc-gw" role="dialog" aria-modal="true" aria-labelledby="dgwT">
      <div class="ooc-gw-url"><span>🔒 ${g.url}?ref=${ref}</span></div>
      <div class="ooc-gw-body" id="dgwBody">
        <h2 id="dgwT">${g.name}</h2>
        <div class="ooc-gw-sum">
          <div><span>Merchant</span><b>Okada Online</b></div>
          <div><span>Reference</span><b>${ref}</b></div>
          <div><span>Amount</span><b>${money(req.amt)} PHP</b></div>
        </div>
        ${req.m === 'bank' ? `<label>Your bank<select>${['BDO Unibank', 'BPI', 'Metrobank', 'UnionBank', 'Land Bank'].map(b => `<option>${b}</option>`).join('')}</select></label>`
          : req.m === 'otc' ? '' : `<div class="ooc-gw-wallet"><b>${g.name}</b><br>${esc(ME.phone)}</div>`}
        <button type="button" class="ooc-gw-pay" data-dgw="ok">${g.btn}${req.m === 'otc' ? '' : ' ' + money(req.amt)}</button>
        ${req.m === 'otc' ? '' : '<button type="button" class="ooc-gw-link" data-dgw="fail">Simulate failed payment</button>'}
        <button type="button" class="ooc-gw-link" data-dgw="back">Cancel and return to Okada Online</button>
      </div>
    </section></div>`;
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => $('.ooc-gw-pay')?.focus(), 30);
}
async function dgwAction(act) {
  const req = txFind(S.dgw); if (!req) return;
  const body = $('#dgwBody'), sleep2 = ms => new Promise(r => setTimeout(r, ms));
  if (act === 'back') { req.st = 'Cancelled'; req.log.Cancelled = clock(); closeLayer(); S.wtab = 'deposit'; go('wallet'); toast('Deposit cancelled'); return; }
  body.innerHTML = `<div class="ooc-gw-busy"><h2>Processing…</h2><p class="ooc-gw-note">Please don't close this page.</p></div>`;
  await sleep2(900);
  if (req.m === 'otc' && act === 'ok') {
    req.code = String(Math.floor(1e11 + Math.random() * 9e11)); req.log.Payment = 'Awaiting payment';
    body.innerHTML = `<div class="ooc-gw-busy"><h2>Payment code ready</h2><p class="ooc-gw-note">Returning to Okada Online…</p></div>`;
  } else if (act === 'fail') {
    req.st = 'Failed'; req.log.Failed = clock(); req.why = 'The payment was declined by the provider.';
    body.innerHTML = `<div class="ooc-gw-busy"><h2>Payment failed</h2><p class="ooc-gw-note">Returning to Okada Online…</p></div>`;
  } else {
    req.st = 'Completed'; req.log.Payment = clock(); req.log.Completed = clock(); ME.wallet += req.amt;
    ledger(req.sub.split(' · ').pop(), 'GATEWAY', req.amt, { label: `Deposit via ${DEP_GW[req.m].name}` });
    if (typeof notify === 'function') notify({ title: 'Deposit successful', body: `${money(req.amt)} has been added to your wallet.`, link: '#wallet' });
    body.innerHTML = `<div class="ooc-gw-busy"><h2>Payment received</h2><p class="ooc-gw-note">Returning to Okada Online…</p></div>`;
  }
  await sleep2(700);
  closeLayer(); renderAuth(); S.wtab = 'deposit'; go('wallet');
  setTimeout(() => depResult(req), 350);
}
function depResult(req) {
  const ok = req.st === 'Completed', otc = req.m === 'otc' && req.st === 'Pending';
  modal(ok ? 'Deposit Successful' : otc ? 'Pay at 7-Eleven' : 'Deposit Failed', `
    <div class="ooc-dep-res ${ok ? 'is-ok' : otc ? 'is-wait' : 'is-fail'}"><b>${money(req.amt)}</b><span>${ok ? 'Added to your wallet' : otc ? 'Awaiting payment' : esc(req.why || 'Payment not completed')}</span></div>
    ${otc ? `${kv('Payment code', req.code)}<p class="ooc-small">Show this code at any 7-Eleven counter within 24 hours. Your wallet is credited once payment is received.</p>` : ''}
    ${kv('Reference', req.sub.split(' · ').pop())}${kv('Method', DEP_GW[req.m].name)}`,
    ok || otc ? { ok: null, cancel: 'Done' } : { ok: 'Try Again', cancel: 'Close', onOk: async () => { closeLayer(); depositModal(); } });
}

function wdTrack(x) {
  txInit(x);
  setTimeout(() => { if (x.st !== 'Pending') return; x.st = 'Processing'; x.log.Processing = clock(); if (typeof notify === 'function') notify({ title: 'Withdrawal processing', body: `${money(-x.amt)} is being processed.`, link: '#wallet' }); refreshIf('wallet'); }, 15000);
  setTimeout(() => { if (x.st !== 'Processing') return; x.st = 'Completed'; x.log.Completed = clock(); if (typeof notify === 'function') notify({ title: 'Withdrawal completed', body: `${money(-x.amt)} has been sent to ${x.sub.split(' · ')[0]}.`, link: '#wallet' }); refreshIf('wallet'); }, 35000);
}
const refreshIf = pg => { if ($('#ooc-main').dataset.page === pg && !$('#ooc-layer section[role=dialog]')) refresh(); };

const _wdUnshift = WALLET_SEED.unshift.bind(WALLET_SEED);
WALLET_SEED.unshift = (...items) => { items.forEach(x => { txInit(x); if (x.kind === 'withdraw' && x.st === 'Pending' && x.today) wdTrack(x); }); return _wdUnshift(...items); };

function txSheet(x) {
  const steps = [...TX_STEPS[x.kind]], end = ['Failed', 'Cancelled'].includes(x.st) ? x.st : null;
  if (end) steps.splice(steps.findIndex(s => !x.log[s]) === -1 ? steps.length : steps.findIndex(s => !x.log[s]), 9, end);
  const reached = s => !!x.log[s] || s === end || (s === 'Processing' && ['Processing', 'Completed'].includes(x.st)) || (s === 'Completed' && x.st === 'Completed');
  modal(`${x.title} · ${x.st}`, `
    <div class="ooc-dep-res ${x.st === 'Completed' ? 'is-ok' : end ? 'is-fail' : 'is-wait'}"><b>${x.amt > 0 ? '+' : '−'}${money(Math.abs(x.amt))}</b><span>${esc(x.sub.split(' · ')[0])}</span></div>
    <ol class="ooc-tx-tl">${steps.map(s => `<li class="${reached(s) ? 'is-done' : ''}${s === end ? ' is-end' : ''}"><b>${s}</b><span>${x.log[s] && x.log[s] !== true ? esc(x.log[s]) : reached(s) ? '' : '—'}</span></li>`).join('')}</ol>
    ${x.why ? `<p class="ooc-small">${esc(x.why)}</p>` : ''}
    ${kv('Reference', x.sub.split(' · ').pop())}`,
    x.kind === 'withdraw' && x.st === 'Pending'
      ? { ok: 'Cancel Withdrawal', cancel: 'Close', onOk: async () => { x.st = 'Cancelled'; x.log.Cancelled = clock(); ME.wallet += -x.amt; closeLayer(); renderAuth(); refresh(); toast(`${money(-x.amt)} returned to your wallet`); } }
      : { ok: null, cancel: 'Close' });
}
document.addEventListener('click', e => {
  const g = e.target.closest('[data-dgw]'); if (g) { e.preventDefault(); dgwAction(g.dataset.dgw); return; }
  const r = e.target.closest('[data-wtx]'); if (r) { const x = txFind(r.dataset.wtx); if (x) txSheet(x); }
});
