

function returnPoints(o) {
  if (o.pts && !o.ptsBack) { ME[o.ptsType] += o.pts; o.ptsBack = true; ledger(o.id, 'PTS_CREDIT', o.pts, { unit: PTS[o.ptsType], title: o.title + ' (returned)' }); }
  ME.vouchers.forEach(v => { if (v.used === o.id) v.used = null; });
}

function refundMoney(o, amt) {
  if (!amt) return;
  if (o.method === 'wallet') { ME.wallet += amt; ledger(o.id, 'REFUND_WALLET', amt, { ref: rid('RF') }); }
  else ledger(o.id, 'REFUND_CARD', amt, { ref: rid('RF'), label: payVia(o) });
  o.refunded = (o.refunded || 0) + amt;
}
function expireOrders() {
  let changed = false;
  S.orders.forEach(o => {
    if (o.status === 'PENDING_PAYMENT' && Date.now() > o.expires) {
      o.status = 'EXPIRED'; returnPoints(o); changed = true;
      if (o.kind === 'stay') ledger(o.id, 'SYNXIS', 0, { label: 'ReleaseHold' });
    }
  });
  return changed;
}
function calc(d) {
  const v = S.co.voucher ? ME.vouchers.find(x => x.code === S.co.voucher) : null;
  const base = d.subtotal - d.discount;
  const vAmt = v ? Math.min(v.value, base) : 0;
  const afterV = base - vAmt;
  const bal = S.co.ptsType ? ME[S.co.ptsType] : 0;
  const maxPts = Math.max(0, Math.min(bal, afterV));
  const pts = Math.min(S.co.pts || 0, maxPts);
  return { base, v, vAmt, afterV, maxPts, pts, payable: afterV - pts };
}
function startCheckout(draft) { S.draft = draft; S.co = { method: isUnverified() ? 'card' : 'wallet', pts: 0, agree: false, card: defCard()?.id || 'new' }; closeLayer(); go('checkout'); }
async function placeOrder() {
  const d = S.draft, c = calc(d);
  const method = c.payable ? S.co.method : null;
  const card = method === 'card' ? ME.cards.find(x => x.id === S.co.card) : null;
  if (method === 'wallet' && ME.wallet < c.payable) { toast('Insufficient wallet balance', true); return; }
  const o = {
    id: rid('OKD'), kind: d.kind, title: d.title, sub: d.sub, date: d.date, slot: d.slot, items: d.items, subtotal: d.subtotal, discount: d.discount, discLabel: d.discLabel,
    voucher: c.v ? { code: c.v.code, amount: c.vAmt } : null, ptsType: c.pts ? S.co.ptsType : null, pts: c.pts, payable: c.payable, method, cardId: card?.id || null, cardLabel: card ? cardLabel(card) : null,
    status: 'PENDING_PAYMENT', created: Date.now(), expires: d.holdExpires || Date.now() + HOLD_MS, refs: {}, rule: d.rule, changeable: d.changeable, meta: d.meta,
  };
  S.orders.unshift(o);
  ledger(o.id, d.kind === 'stay' ? 'SYNXIS' : d.kind === 'dine' ? 'OPENTABLE' : 'WOO', 0, { label: 'POST /orders · status=pending_payment' });
  if (o.pts) { ME[o.ptsType] -= o.pts; ledger(o.id, 'PTS_DEBIT', o.pts, { unit: PTS[o.ptsType], title: o.title }); }
  if (c.v) c.v.used = o.id;
  S.draft = null; S.co = {};
  renderAuth();
  if (!o.payable) { await fulfil(o); go('result', o.id); return; }
  gateway(o);
}
async function fulfil(o) {
  o.status = 'PAID';
  if (o.kind === 'stay') {
    if (S.synxFail) {
      for (let i = 1; i <= 3; i++) { ledger(o.id, 'SYNXIS', 0, { label: `CreateReservation 第 ${i} 次`, status: 'FAILED' }); await sleep(250); }
      refundMoney(o, o.payable); returnPoints(o); o.status = 'REFUNDED'; o.fail = 'synxis';
      ledger(o.id, 'SYNXIS', 0, { label: '通知客服（CS ticket）', ref: rid('CS') });
      return;
    }
    o.refs.conf = rid('SYN'); ledger(o.id, 'SYNXIS', 0, { label: 'CreateReservation (prepaid)', ref: o.refs.conf });
  } else if (o.kind === 'dine') { o.refs.conf = 'OT-' + (4400000 + hash(o.id) % 99999); ledger(o.id, 'OPENTABLE', 0, { label: 'CreateReservation (deposit paid)', ref: o.refs.conf }); }
  else { o.refs.conf = rid(o.kind === 'event' ? 'EVT' : o.kind === 'wellness' ? 'SPA' : 'TKT'); ledger(o.id, 'WOO', 0, { label: 'Order → completed', ref: o.refs.conf }); }
  o.status = 'CONFIRMED';
  const earn = Math.floor(o.payable * 0.01);
  if (earn) { ME.lifestyle += earn; o.earned = earn; ledger(o.id, 'PTS_EARN', earn, { unit: PTS.lifestyle, title: o.title + ' (earned)' }); }
}

function gateway(o) {
  S.gw = o.id;
  lastFocus = document.activeElement;
  const wallet = o.method === 'wallet';
  $('#ooc-layer').innerHTML = `
    <div tabindex="-1" class="ooc-portal">
    <section class="ooc-gw" role="dialog" aria-modal="true" aria-labelledby="gwT">
      <div class="ooc-gw-url"><span>🔒 https://pay.gateway.example/checkout/${o.id}</span>${note('金流頁 mock')}</div>
      <div class="ooc-gw-body" id="gwBody">
        <h2 id="gwT">Secure Payment</h2>
        <div class="ooc-gw-sum">
          <div><span>Merchant</span><b>Okada Manila Resort</b></div>
          <div><span>Order</span><b>${o.id}</b></div>
          <div><span>Amount</span><b>${money(o.payable)} PHP</b></div>
        </div>
        ${wallet ? `
          <div class="ooc-gw-wallet"><b>Okada Online Platform Account</b><br>${ME.om} · Balance ${money(ME.wallet)}
            </div>`
        : ewName(o.method) ? `
          <div class="ooc-gw-wallet"><b>${ewName(o.method)}</b><br>${esc(ME.phone)}
            <p class="ooc-gw-note">You'll be asked to log in to ${ewName(o.method)} and approve ${money(o.payable)}.</p></div>`
        : o.cardLabel ? `
          <div class="ooc-gw-wallet"><b>Saved card</b><br>${esc(o.cardLabel)}
            </div>`
        : `
          <label>Card number<input inputmode="numeric" value="4111 1111 1111 1111" autocomplete="cc-number"></label>
          <div class="ooc-gw-row"><label>Expiry<input value="12 / 29" autocomplete="cc-exp"></label><label>CVC<input value="123" inputmode="numeric" autocomplete="cc-csc"></label></div>
          <label>Name on card<input value="${esc(ME.full)}" autocomplete="cc-name"></label>
          <label class="ooc-gw-save"><input type="checkbox" id="gwSave" checked> Save this card for future payments</label>
          `}
        <button type="button" class="ooc-gw-pay" data-gw="ok">${wallet ? 'Authorize' : ewName(o.method) ? 'Pay with ' + ewName(o.method) : 'Pay'} ${money(o.payable)}</button>
        <button type="button" class="ooc-gw-link" data-gw="fail">Simulate declined payment</button>
        <button type="button" class="ooc-gw-link" data-gw="back">Cancel and return to Okada Online</button>
      </div>
    </section></div>`;
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => $('.ooc-gw-pay')?.focus(), 30);
}
async function gwAction(act) {
  const o = S.orders.find(x => x.id === S.gw); if (!o) return;
  if (act === 'back') { closeLayer(); go('result', o.id); toast('Payment not completed'); return; }
  if (o.status !== 'PENDING_PAYMENT') { closeLayer(); go('result', o.id); return; }
  const saveCard = o.method === 'card' && !o.cardId && $('#gwSave')?.checked;
  $('#gwBody').innerHTML = `<div class="ooc-gw-busy"><h2>Processing…</h2><p class="ooc-gw-note">Please don't close this page.</p></div>`;
  if (o.method === 'wallet') {
    o.refs.withdrawal = rid('WD'); ME.wallet -= o.payable; ledger(o.id, 'WITHDRAWAL', o.payable, { ref: o.refs.withdrawal }); renderAuth();
  }
  await sleep(900);
  o.refs.payment = rid('PAY');
  if (act === 'fail') {
    ledger(o.id, 'PAYMENT', o.payable, { ref: o.refs.payment, ch: o.method, status: 'FAILED' });
    if (o.method === 'wallet') { ME.wallet += o.payable; ledger(o.id, 'REVERSAL', o.payable, { ref: rid('RV') }); }
    returnPoints(o); o.status = 'FAILED';
  } else {
    ledger(o.id, 'PAYMENT', o.payable, { ref: o.refs.payment, ch: o.method });
    if (saveCard) saveGwCard(o);
    await fulfil(o);
  }
  $('#gwBody').innerHTML = `<div class="ooc-gw-busy"><h2>${act === 'fail' ? 'Payment declined' : 'Payment received'}</h2><p class="ooc-gw-note">Returning to Okada Online…</p></div>`;
  await sleep(700);
  closeLayer(); renderAuth(); go('result', o.id);
}
function retryPay(o, method) {
  if (method === 'wallet' && ME.wallet < o.payable) { toast('Insufficient wallet balance', true); return; }
  if (o.pts && o.ptsBack) {
    if (ME[o.ptsType] < o.pts) { toast('Not enough points — please check out again', true); return; }
    ME[o.ptsType] -= o.pts; o.ptsBack = false; ledger(o.id, 'PTS_DEBIT', o.pts, { unit: PTS[o.ptsType], title: o.title });
  }
  if (o.voucher) { const v = ME.vouchers.find(x => x.code === o.voucher.code); if (v) v.used = o.id; }
  o.method = method; o.status = 'PENDING_PAYMENT'; o.expires = Math.max(o.expires, Date.now() + 5 * 60e3);
  gateway(o);
}
