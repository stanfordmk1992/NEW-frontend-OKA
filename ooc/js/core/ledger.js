

const LT = {
  PTS_DEBIT: ['扣點', '會員系統'], PTS_CREDIT: ['退點', '會員系統'], PTS_EARN: ['賺點 1%', '會員系統'],
  WITHDRAWAL: ['出金單', '平台錢包 → 清算帳戶'], PAYMENT: ['支付單', '金流 → Okada Manila'],
  REVERSAL: ['出金沖正', '清算帳戶 → 平台錢包'], REFUND_WALLET: ['退款（原路）', '金流 → 平台錢包'], REFUND_CARD: ['退款（原路）', '金流 → 原信用卡'],
  SYNXIS: ['SynXis', 'API'], OPENTABLE: ['OpenTable', 'API'], WOO: ['WooCommerce', 'API'], RC: ['Reward Circle', 'API'],
};
function ledger(orderId, type, amount, x = {}) {
  S.ledger.unshift({ t: x.t || clock(), order: orderId, type, amount, ...x });
  if (/^PTS_/.test(type)) S.ptsLog.unshift({ t: x.t || 'Today', title: x.title || orderId, unit: x.unit, amount: type === 'PTS_DEBIT' ? -amount : amount });
  renderLedger();
}
function renderLedger() {
  const p = $('#ooc-ledger'); if (!p || p.hidden) return;
  p.innerHTML = `<div class="ooc-lg-h"><b>後台帳務（mock）</b><span>平台帳戶付款 = 出金單 + 支付單</span><button type="button" data-lg-close aria-label="Close">×</button></div>
    <div class="ooc-lg-b">${S.ledger.length ? S.ledger.map(l => {
      const [lab, side] = LT[l.type] || [l.type, ''];
      const st = l.status || 'SUCCESS';
      const amt = l.amount ? (/^PTS_/.test(l.type) ? `${fmt(l.amount)} ${l.unit === PTS.lifestyle ? 'LP' : 'CP'}` : money(l.amount)) : '';
      return `<div class="ooc-lg-r"><span>${l.t}</span><div><b>${lab}</b>${l.label ? ' · ' + esc(l.label) : ''}${l.ch ? ` · ${l.ch === 'wallet' ? '平台帳戶' : '信用卡'}` : ''}<small>${l.order} · ${side}${l.ref ? ' · ' + l.ref : ''}</small></div><div class="ooc-lg-v"><b>${amt}</b><small class="${st === 'SUCCESS' ? 'ok' : 'bad'}">${st}</small></div></div>`;
    }).join('') : '<div>尚無帳務紀錄。完成一筆結帳即可看到出金 / 支付單。</div>'}</div>`;
}

(function seed() {
  const ci = dayPlus(20), co = dayPlus(22);
  const stay = { id: 'OKD-S7Q2LM', kind: 'stay', title: 'Deluxe Room · Member Rate', sub: `${pretty(ci)} → ${pretty(co)} · 2 nights · 1 room`, date: ci, slot: '15:00',
    items: [{ title: 'Deluxe Room', sub: 'Member Rate · ₱13,050 × 2 nights × 1', amount: 26100 }], subtotal: 29000, discount: 2900, discLabel: 'Member rate savings', voucher: null,
    ptsType: 'circle', pts: 5000, payable: 21100, method: 'wallet', status: 'CONFIRMED', created: Date.now() - 3 * 864e5,
    refs: { conf: 'SYN-58K2Q1', payment: 'PAY-H2KD91', withdrawal: 'WD-7Q1MZP' }, rule: { refundable: true, text: RATES[0].desc }, changeable: true, meta: { ci, co, n: 2, rooms: 1, room: 'dk' } };
  const dine = { id: 'OKD-D3K8PA', kind: 'dine', title: 'Goryeo · 2 guests', sub: `${pretty(dayPlus(2))} · 19:30`, date: dayPlus(2), slot: '19:30', items: [], subtotal: 0, discount: 0, voucher: null,
    ptsType: null, pts: 0, payable: 0, method: null, status: 'CONFIRMED', created: Date.now() - 864e5, refs: { conf: 'OT-4471920' }, rule: { refundable: true, text: 'Free cancellation.' }, changeable: true, meta: { rest: 'rl', guests: 2 } };
  const kc = { id: 'OKD-K9W1RT', kind: 'shop', title: 'Kids Club Weekday Pass', sub: `Weekday · 4 hours · ${pretty(dayPlus(6))} 10:00 × 2`, date: dayPlus(6), slot: '10:00',
    items: [{ title: 'Kids Club Weekday Pass', sub: 'Weekday · 4 hours × 2', amount: 3000 }], subtotal: 3000, discount: 300, discLabel: 'Member discount (Elite · 10%)', voucher: null,
    ptsType: null, pts: 0, payable: 2700, method: 'card', status: 'CONFIRMED', created: Date.now() - 2 * 864e5, refs: { conf: 'TKT-QX82L0', payment: 'PAY-9MZ2C4' },
    rule: { refundable: true, text: 'Free cancellation up to 24 hours before your booking time.' }, changeable: true, meta: { pid: 'kcw' } };
  S.orders.push(dine, kc, stay);
  const t = 'Nov 07';
  ledger(stay.id, 'PTS_DEBIT', 5000, { t, unit: PTS.circle, title: 'Deluxe Room · Member Rate' });
  ledger(stay.id, 'WITHDRAWAL', 21100, { t, ref: 'WD-7Q1MZP' });
  ledger(stay.id, 'PAYMENT', 21100, { t, ref: 'PAY-H2KD91', ch: 'wallet' });
  ledger(stay.id, 'SYNXIS', 0, { t, label: 'CreateReservation (prepaid)', ref: 'SYN-58K2Q1' });
  ledger(kc.id, 'PAYMENT', 2700, { t: 'Nov 08', ref: 'PAY-9MZ2C4', ch: 'card' });
  ledger(kc.id, 'WOO', 0, { t: 'Nov 08', label: 'Order → completed', ref: 'TKT-QX82L0' });
  ledger(dine.id, 'OPENTABLE', 0, { t: 'Nov 09', label: 'CreateReservation', ref: 'OT-4471920' });
  S.ptsLog.push({ t: 'Nov 02', title: 'Bar & Lounge Credit', unit: PTS.circle, amount: -3500 });
})();

const api = {
  async highlights() { await sleep(500); if (S.fail) throw new Error('UPSTREAM_TIMEOUT'); return HIGHLIGHTS; },
};
