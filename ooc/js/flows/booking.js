

function guestModal(roomId, code) {
  const r = ROOMS.find(x => x.id === roomId), rate = RATES.find(x => x.code === code), q = S.stayQ, n = nightsOf(q.ci, q.co);
  const night = Math.round(r.base * rate.mult / 10) * 10, total = night * n * q.rooms, bar = Math.round(r.base / 10) * 10 * n * q.rooms;
  modal(esc(r.title), `
    <p class="ooc-small">${pretty(q.ci)} → ${pretty(q.co)} · ${n} night(s) · ${q.rooms} room(s) · ${q.ad} adult(s)${+q.ch ? `, ${q.ch} child(ren)` : ''}</p>
    ${kv(rate.name, `${money(night)} × ${n} × ${q.rooms}`)}
    ${kv('Member savings', '−' + money(bar - total))}
    ${bookingOffers('stay', { room: roomId, member: rate.member ? bar - total : 0 })} <!-- v1.17 -->
    ${kv('Room total (incl. taxes)', money(total))}
    <span class="ooc-label">Guest details · from your Reward Circle profile ${note('F0')}</span>
    <div class="ooc-form2">${field('Full name', `id="gName" value="${esc(ME.full)}" autocomplete="name"`)}${field('Mobile', `id="gPhone" value="${esc(ME.phone)}" autocomplete="tel"`)}</div>
    ${field('Email', `id="gMail" type="email" value="${esc(ME.email)}" autocomplete="email"`)}
    <div class="ooc-form2">${select('Arrival time', 'gArr', ['Before 15:00', '15:00–18:00', '18:00–21:00', 'After 21:00'], '15:00–18:00')}
    ${input('Special requests', `<input data-slot="input" class="${UI.input}" id="gReq" maxlength="200" placeholder="High floor, crib…">`)}</div>
    <p class="ooc-err" id="gErr" role="alert"></p>
    <p class="ooc-small">${esc(rate.desc)}</p>`,
    { ok: 'Continue to Payment', onOk: async () => {
      if (!$('#gName').value.trim() || !/^\S+@\S+\.\S+$/.test($('#gMail').value)) { $('#gErr').textContent = 'Please enter the guest name and a valid email.'; throw 0; }
      await sleep(500);
      const hold = rid('HOLD'); ledger(hold, 'SYNXIS', 0, { label: 'HoldInventory (15 min)', ref: hold });
      startCheckout({ kind: 'stay', title: `${r.title} · ${rate.name}`, sub: `${pretty(q.ci)} → ${pretty(q.co)} · ${n} night(s) · ${q.rooms} room(s)`, date: q.ci, slot: '15:00',
        items: [{ title: r.title, sub: `${rate.name} · ${money(night)} × ${n} night(s) × ${q.rooms}`, amount: total }],
        subtotal: rate.member ? bar : total, discount: rate.member ? bar - total : 0, discLabel: 'Member rate savings',
        rule: { refundable: rate.refundable, text: rate.desc }, changeable: rate.refundable, holdExpires: Date.now() + HOLD_MS,
        meta: { room: r.id, rate: code, ci: q.ci, co: q.co, n, rooms: q.rooms, hold } });
    } });
}

const slotFull = (k, d, s) => hash(k + d + s) % 4 === 0;
const slotsHtml = (k, date, list, cur) => list.map(s => { const full = slotFull(k, date, s); return `<button type="button" class="${UI.chip}${cur === s ? ' ooc-chip-on' : ''}" data-pslot="${s}"${full ? ` disabled aria-label="${s} full"` : ''}>${s}</button>`; }).join('');
function reserveModal(id) {
  const r = RESTS.find(x => x.id === id), st = { date: dayPlus(0), slot: null };
  modal('Reserve · ' + esc(r.title), `
    ${bookingOffers('dine', { rest: id })} <!-- v1.17 -->
    <div class="ooc-form2">${field('Date', `type="date" id="rd" value="${st.date}" min="${st.date}"`)}${select('Guests', 'rp', [1, 2, 3, 4, 5, 6, 8, 10], 2)}</div>
    <span class="ooc-label">Available times ${note('API GET /dining/availability → OpenTable')}</span>
    <div class="ooc-slots" id="pmSlots">${slotsHtml(id, st.date, DINE_SLOTS)}</div>
    <div class="ooc-form2">${select('Occasion', 'ro', ['None', 'Birthday', 'Anniversary', 'Business'], 'None')}
    ${input('Note (optional)', `<input data-slot="input" class="${UI.input}" id="rn" maxlength="200" placeholder="Allergies, seating…">`)}</div>
    ${r.deposit ? `<p class="ooc-small">A deposit of ${money(r.deposit)} is required and deducted from your bill. Refundable up to 24 hours before. ${note('R22')}</p>` : '<p class="ooc-small">No payment needed. Free cancellation.</p>'}`,
    { ok: r.deposit ? 'Pay Deposit' : 'Reserve', okDisabled: true, onOk: async () => {
      const guests = $('#rp').value, date = $('#rd').value, sub = `${pretty(date)} · ${st.slot}`;
      if (r.deposit) {
        startCheckout({ kind: 'dine', title: `${r.title} · ${guests} guests`, sub, date, slot: st.slot, items: [{ title: `${r.title} deposit`, sub: `${guests} guests · ${sub}`, amount: r.deposit }],
          subtotal: r.deposit, discount: 0, rule: { refundable: true, text: 'Deposit refundable up to 24 hours before your reservation.' }, changeable: true, meta: { rest: r.id, guests } });
        return;
      }
      await sleep(600);
      const o = { id: rid('OKD'), kind: 'dine', title: `${r.title} · ${guests} guests`, sub, date, slot: st.slot, items: [], subtotal: 0, discount: 0, voucher: null, ptsType: null, pts: 0, payable: 0, method: null,
        status: 'CONFIRMED', created: Date.now(), refs: { conf: 'OT-' + (4400000 + hash(date + st.slot) % 99999) }, rule: { refundable: true, text: 'Free cancellation.' }, changeable: true, meta: { rest: r.id, guests } };
      S.orders.unshift(o); ledger(o.id, 'OPENTABLE', 0, { label: 'CreateReservation', ref: o.refs.conf });
      closeLayer(); go('result', o.id);
    } });
  $('#pmSlots').onclick = e => { const b = e.target.closest('[data-pslot]'); if (!b || b.disabled) return; st.slot = b.dataset.pslot; $$('#pmSlots [data-pslot]').forEach(x => x.classList.toggle('ooc-chip-on', x === b)); setOk(true); };
  $('#rd').onchange = e => { st.date = e.target.value; st.slot = null; $('#pmSlots').innerHTML = slotsHtml(id, st.date, DINE_SLOTS); setOk(false); };
}

const dayOk = (p, d) => { if (!p.days) return true; const w = new Date(d + 'T00:00').getDay(); return p.days === 'weekday' ? w > 0 && w < 6 : w === 0 || w === 6; };
const firstDay = p => { for (let i = 1; i < 10; i++) { const d = dayPlus(i); if (dayOk(p, d)) return d; } return dayPlus(1); };
function draftItems(items) {
  const kinds = [...new Set(items.map(i => i.kind))], kind = kinds.length === 1 ? kinds[0] : 'shop', f = items[0];
  const subtotal = items.reduce((a, i) => a + i.unit * i.qty, 0);
  const discount = S.login ? items.reduce((a, i) => a + (i.noDisc ? 0 : Math.round(i.unit * i.qty * ME.discount)), 0) : 0;
  const when = i => `${i.opt}${i.date ? ` · ${pretty(i.date)}${i.slot ? ' ' + i.slot : ''}` : ''} × ${i.qty}`;
  return { kind, title: items.length === 1 ? f.title : `${f.title} + ${items.length - 1} more`, sub: items.length === 1 ? when(f) : `${items.reduce((a, i) => a + i.qty, 0)} items`,
    date: items.map(i => i.date).filter(Boolean).sort()[0] || null, slot: items.length === 1 ? f.slot : null,
    items: items.map(i => ({ title: i.title, sub: when(i), amount: i.unit * i.qty })), subtotal, discount, discLabel: `Member discount (${ME.tier} · 10%)`,
    rule: { refundable: !items.every(i => i.noDate), text: items.every(i => i.noDate) ? 'Gift vouchers are non-refundable.' : 'Free cancellation up to 24 hours before your booking time.' },
    changeable: items.length === 1 && !!f.date, meta: { pid: f.pid, items } };
}
function productModal(id) {
  const p = PRODUCTS.find(x => x.id === id), st = { opt: 0, date: p.noDate ? null : firstDay(p), slot: null, qty: 1 };
  const ready = () => p.noDate || (st.slot && dayOk(p, st.date));
  const total = () => { const sub = p.opts[st.opt][1] * st.qty, dis = S.login && !p.noDisc ? Math.round(sub * ME.discount) : 0; return dis ? `<s>${money(sub)}</s> ${money(sub - dis)}` : money(sub); };
  const upd = () => { $('#pmTotal').innerHTML = total(); setOk(ready()); };
  const item = () => ({ key: uuid(), pid: p.id, kind: p.mod === 'wellness' ? 'wellness' : 'shop', title: p.title, opt: p.opts[st.opt][0], unit: p.opts[st.opt][1], qty: st.qty, date: st.date, slot: st.slot, noDisc: p.noDisc, noDate: p.noDate,
    extra: $('#pmTh')?.value });
  modal(esc(p.title), `<div id="pm">
    <p class="ooc-small">${esc(p.meta)}</p>
    ${bookingOffers(p.mod === 'wellness' ? 'wellness' : 'shop', { prod: p.id, disc: !p.noDisc })} <!-- v1.17 -->
    <span class="ooc-label">Option</span>
    <div class="ooc-slots" id="pmOpts">${p.opts.map((o, i) => `<button type="button" class="${UI.chip}${i === 0 ? ' ooc-chip-on' : ''}" data-popt="${i}">${esc(o[0])} · ${money(o[1])}</button>`).join('')}</div>
    <div class="ooc-form2">${p.noDate ? '' : field('Date', `type="date" id="pmDate" value="${st.date}" min="${dayPlus(1)}"`)}${select('Quantity', 'pmQty', [1, 2, 3, 4, 5, 6], 1)}</div>
    ${p.noDate ? '' : `<span class="ooc-label">Time ${note(p.mod === 'wellness' ? 'API GET /wellness/slots' : 'API GET /shop/products/{id}/slots')}</span><div class="ooc-slots" id="pmSlots">${slotsHtml(p.id, st.date, p.slots)}</div>`}
    <p class="ooc-err" id="pmErr" role="alert">${!p.noDate && !dayOk(p, st.date) ? `This pass is valid on ${p.days}s only.` : ''}</p>
    ${p.mod === 'wellness' ? select('Therapist preference', 'pmTh', ['No preference', 'Female', 'Male'], 'No preference') : ''}
    ${kv('Price' + (S.login && !p.noDisc ? ' · member 10% off' : ''), total(), 'is-total', 'pmTotal')}
    <p class="ooc-small">${p.noDate ? 'Delivered instantly to My Bookings. Non-refundable.' : 'Free cancellation up to 24 hours before your booking time.'}</p></div>`,

    { ok: p.mod === 'wellness' ? 'Book & Pay' : 'Buy Now', okDisabled: !ready(),
      onOk: async () => { const it = item(); if (!requireLogin(() => startCheckout(draftItems([it])))) return; startCheckout(draftItems([it])); } });
  $('#pm').addEventListener('click', e => {
    const o = e.target.closest('[data-popt]'), s = e.target.closest('[data-pslot]');
    if (o) { st.opt = +o.dataset.popt; $$('#pmOpts [data-popt]').forEach(x => x.classList.toggle('ooc-chip-on', x === o)); upd(); }
    if (s && !s.disabled) { st.slot = s.dataset.pslot; $$('#pmSlots [data-pslot]').forEach(x => x.classList.toggle('ooc-chip-on', x === s)); upd(); }
  });
  $('#pm').addEventListener('change', e => {
    if (e.target.id === 'pmQty') st.qty = +e.target.value;
    if (e.target.id === 'pmDate') { st.date = e.target.value; st.slot = null; $('#pmSlots').innerHTML = slotsHtml(p.id, st.date, p.slots); $('#pmErr').textContent = dayOk(p, st.date) ? '' : `This pass is valid on ${p.days}s only.`; }
    upd();
  });
}

function redeemModal(id) {
  const r = COLLECTIONS.find(x => x.id === id) || VOUCHERS.find(x => x.id === id), isV = !!r.value, key = uuid();
  const types = (isV ? r.types : ELIG.reward).filter(t => ME[t] >= r.pts);
  modal('Redeem · ' + esc(r.title), `
    ${kv('Cost', fmt(r.pts) + ' pts')}
    ${select('Pay with', 'rdT', types.map(t => [t, `${PTS[t]} · ${fmt(ME[t])} available`]), types[0])}
    ${isV ? `<p class="ooc-small">The voucher goes to My Vouchers and can be applied at checkout (${r.kinds.map(k => KIND[k][1]).join(', ')}). Valid 12 months.</p>`
      : `${select('Fulfilment', 'rdF', ['Pick up at the Reward Circle Desk', 'Delivery · Metro Manila (free)'], 'Pick up at the Reward Circle Desk')}<p class="ooc-small">Bring a valid ID when you pick up. Redemptions can't be cancelled. ${note('R13 假設')}</p>`}`,
    { ok: 'Redeem', onOk: async () => {
      await sleep(700); if (S.idem.has(key)) return;
      const t = $('#rdT').value; if (ME[t] < r.pts) { toast('Not enough points', true); throw 0; }
      const o = { id: rid('OKD'), kind: 'reward', title: r.title, sub: isV ? 'Voucher · added to My Vouchers' : $('#rdF').value, date: null, slot: null, items: [], subtotal: 0, discount: 0, voucher: null,
        ptsType: t, pts: r.pts, payable: 0, method: null, status: 'CONFIRMED', created: Date.now(), refs: { conf: rid('RC') }, rule: { refundable: false, text: 'Redemptions are final.' }, changeable: false };
      ME[t] -= r.pts; if (r.stock) r.stock--;
      S.orders.unshift(o); ledger(o.id, 'PTS_DEBIT', r.pts, { unit: PTS[t], title: r.title }); ledger(o.id, 'RC', 0, { label: 'POST /rewards/redemptions', ref: o.refs.conf });
      if (isV) ME.vouchers.unshift({ code: rid('VC'), title: r.title, value: r.value, kinds: r.kinds, used: null });
      S.idem.set(key, o); closeLayer(); renderAuth(); go('result', o.id);
    } });
}

function promoAction(id) {
  const e = PROMOS.find(x => x.id === id);

  if (e.rest) { if (requireLogin(() => reserveModal(e.rest))) reserveModal(e.rest); return; }
  if (e.prod) { if (requireLogin(() => productModal(e.prod))) productModal(e.prod); return; }
  if (e.stay) {
    const d = new Date(); let ci = e.stay.ci === 'fri' ? dayPlus(((5 - d.getDay() + 7) % 7) || 7) : dayPlus(e.stay.ci);
    S.stayQ = { ...S.stayQ, ci, co: iso(new Date(new Date(ci + 'T00:00').getTime() + e.stay.n * 864e5)) }; S.scat = e.stay.scat || 'all';
    refresh(); toast(`${e.title} · ${pretty(S.stayQ.ci)}, ${e.stay.n} nights`); $('#ooc-rooms')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return;
  }
  if (e.info) { modal(esc(e.title), `<p class="ooc-small">${e.meta}</p><p>${esc(e.info)}</p>`, { ok: null, cancel: 'Close' }); return; }
  if (!requireLogin(() => promoAction(id))) return;
  if (e.cat === 'online') {
    modal(esc(e.title), `<p class="ooc-small">${e.meta}</p>
      <p class="ooc-small">Opt in to take part. Wagering requirements, eligible games and expiry are shown in the full terms. Bonus funds can't be used for resort bookings. ${note('R20/R21 條款待營運提供')}</p>`,
      { rg: true, ok: 'Join Promotion', onOk: async () => { await sleep(500); S.joined.add(e.id); ledger(rid('PRM'), 'RC', 0, { label: `Promotion opt-in · ${e.title}` }); closeLayer(); toast('You\'ve joined ' + e.title); refresh(); } });
    return;
  }
  joinModal(id);
}
function joinModal(id) {
  const e = PROMOS.find(x => x.id === id);
  const casino = e.cat === 'onsite';
  modal(esc(e.title), `<p class="ooc-small">${e.meta} · ${e.price}</p>
    ${casino ? '' : bookingOffers('event', { ev: id })} <!-- v1.17 -->
    ${casino ? `<p class="ooc-small">On-site event at Okada Manila. Valid ID required at entry; open to members 21+ only. Registration does not involve any online wager or payment. ${note('R20/R21')}</p>` : ''}
    ${select(casino ? 'Participants' : 'Tickets', 'tk', casino ? [1] : [1, 2, 3, 4], 1)}
    ${e.priceN ? kv('Total', money(e.priceN), 'is-total', 'tkT') : ''}`,
    { rg: casino, ok: e.priceN ? 'Continue to Payment' : e.price === 'Free' ? 'Add to My Plan' : 'Register', onOk: async () => {
      const qty = +$('#tk').value;
      if (e.priceN) {
        startCheckout({ kind: 'event', title: e.title, sub: `${e.meta} · ${qty} ticket(s)`, date: e.date, slot: '19:00', items: [{ title: e.title, sub: `${money(e.priceN)} × ${qty}`, amount: e.priceN * qty }],
          subtotal: e.priceN * qty, discount: 0, rule: { refundable: true, text: 'Refundable up to 24 hours before the event.' }, changeable: false, meta: { ev: e.id } });
        return;
      }
      await sleep(600);
      const o = { id: rid('OKD'), kind: 'event', title: `${e.title} · ${qty} participant(s)`, sub: e.meta, date: e.date, slot: '19:00', items: [], subtotal: 0, discount: 0, voucher: null, ptsType: null, pts: 0, payable: 0, method: null,
        status: 'CONFIRMED', created: Date.now(), refs: { conf: rid('EVT') }, rule: { refundable: true, text: 'Free cancellation.' }, changeable: false, meta: { ev: e.id } };
      S.orders.unshift(o); ledger(o.id, 'WOO', 0, { label: 'Event registration', ref: o.refs.conf });
      closeLayer(); go('result', o.id);
    } });
  const tk = $('#tk'); if (tk && e.priceN) tk.onchange = () => { $('#tkT').textContent = money(e.priceN * +tk.value); };
}

function receiptModal(o) {
  modal('Receipt', `
    ${kv('Order', o.id)}${kv('Date', new Date(o.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }))}${kv('Booking', esc(o.title))}
    ${o.items.map(i => kv(`${esc(i.title)}<small>${esc(i.sub)}</small>`, money(i.amount))).join('')}
    ${o.subtotal ? kv('Subtotal', money(o.subtotal)) : ''}${o.discount ? kv(o.discLabel || 'Discount', '−' + money(o.discount)) : ''}
    ${o.voucher ? kv('Voucher ' + o.voucher.code, '−' + money(o.voucher.amount)) : ''}${o.pts ? kv(PTS[o.ptsType], `−${fmt(o.pts)} pts`) : ''}
    ${kv('Paid', o.payable ? `${money(o.payable)} · ${o.method === 'wallet' ? 'Platform account' : payVia(o)}` : '—', 'is-total')}
    ${o.refs.payment ? kv('Payment ref', o.refs.payment) : ''}${o.refs.withdrawal ? kv('Withdrawal ref', o.refs.withdrawal) : ''}
    ${o.refunded ? kv('Refunded', money(o.refunded) + (o.method === 'wallet' ? ' → platform account' : ' → card')) : ''}
    ${kv('Status', STATUS[o.status])}`,
    { ok: 'Download PDF', cancel: 'Close', onOk: async () => { closeLayer(); toast('Receipt PDF downloaded (mock)'); } });
}
function refundQuote(o) {
  if (!o.payable && !o.pts && !o.voucher) return { ok: true, amt: 0, text: 'Free cancellation.' };
  if (!o.rule.refundable) return { ok: false, text: 'This booking is non-refundable.' };
  const limit = o.kind === 'stay' ? 48 : 24, hrs = (new Date(`${o.date}T${o.slot || '15:00'}`) - Date.now()) / 36e5;
  if (hrs < limit) return { ok: false, text: `Free cancellation ended ${limit} hours before ${o.kind === 'stay' ? 'arrival' : 'the booking time'}.` };
  return { ok: true, amt: o.payable, text: 'Full refund.' };
}
function cancelModal(o) {
  const q = refundQuote(o);
  modal('Cancel Booking', `
    <p><b>${esc(o.title)}</b><br><span class="ooc-small">${esc(o.sub)}</span></p>
    ${kv('Policy', esc(q.text))}
    ${q.ok && q.amt ? kv('Refund', `${money(q.amt)} → ${o.method === 'wallet' ? 'platform account (instant)' : payVia(o) + ' (5–7 business days)'}`) : ''}
    ${q.ok && o.pts ? kv('Points returned', `${fmt(o.pts)} ${PTS[o.ptsType]}`) : ''}
    ${q.ok && o.voucher ? kv('Voucher returned', o.voucher.code) : ''}
    ${o.method === 'card' && q.ok ? `<p class="ooc-small">Card refunds always go back to the card and are never credited to your platform account. ${note('R24')}</p>` : ''}`,
    { ok: q.ok ? 'Confirm Cancellation' : null, cancel: q.ok ? 'Keep Booking' : 'Close', onOk: async () => {
      await sleep(700);
      ledger(o.id, o.kind === 'stay' ? 'SYNXIS' : o.kind === 'dine' ? 'OPENTABLE' : 'WOO', 0, { label: o.kind === 'stay' ? 'CancelReservation' : o.kind === 'dine' ? 'CancelReservation' : 'Order → refunded' });
      refundMoney(o, q.amt); returnPoints(o); o.status = 'CANCELLED';
      closeLayer(); renderAuth(); toast(q.amt ? `Cancelled · ${money(q.amt)} refunded` : 'Booking cancelled'); refresh();
    } });
}
function changeModal(o) {
  const stay = o.kind === 'stay';
  const p = o.meta?.pid && PRODUCTS.find(x => x.id === o.meta.pid), slots = o.kind === 'dine' ? DINE_SLOTS : p ? p.slots : null, key = p ? p.id : o.meta?.rest || 'x';
  const st = { date: o.date, slot: stay ? null : o.slot };
  modal('Change Date', `
    <p><b>${esc(o.title)}</b><br><span class="ooc-small">Current: ${esc(o.sub)}</span></p>
    ${field(stay ? 'New check-in' : 'New date', `type="date" id="cgD" value="${o.date}" min="${dayPlus(1)}"`)}
    ${stay ? `<p class="ooc-small">Same room, rate and length of stay (${o.meta.n} night(s)). ${note('API PATCH /stay/reservations/{id} → SynXis Modify')}</p>`
      : `<span class="ooc-label">Time</span><div class="ooc-slots" id="pmSlots">${slotsHtml(key, st.date, slots, st.slot)}</div>`}
    <p class="ooc-err" id="cgErr" role="alert"></p>`,
    { ok: 'Confirm Change', onOk: async () => {
      if (p && !dayOk(p, st.date)) { $('#cgErr').textContent = `Valid on ${p.days}s only.`; throw 0; }
      if (!stay && (!st.slot || slotFull(key, st.date, st.slot))) { $('#cgErr').textContent = 'Please choose an available time.'; throw 0; }
      await sleep(700);
      if (stay) { const co = iso(new Date(new Date(st.date + 'T00:00').getTime() + o.meta.n * 864e5)); o.meta.ci = st.date; o.meta.co = co; o.sub = `${pretty(st.date)} → ${pretty(co)} · ${o.meta.n} night(s) · ${o.meta.rooms} room(s)`; }
      else { o.slot = st.slot; o.sub = o.sub.replace(/[A-Z][a-z]{2} \d{1,2}, \d{4}( \d{2}:\d{2}| · \d{2}:\d{2})?/, `${pretty(st.date)}${o.kind === 'dine' ? ' · ' : ' '}${st.slot}`); }
      o.date = st.date;
      ledger(o.id, stay ? 'SYNXIS' : o.kind === 'dine' ? 'OPENTABLE' : 'WOO', 0, { label: stay ? 'ModifyReservation' : 'Reschedule' });
      closeLayer(); toast('Booking updated'); refresh();
    } });
  $('#cgD').onchange = e => { st.date = e.target.value; if (!stay) { st.slot = null; $('#pmSlots').innerHTML = slotsHtml(key, st.date, slots); } };
  if (!stay) $('#pmSlots').onclick = e => { const b = e.target.closest('[data-pslot]'); if (!b || b.disabled) return; st.slot = b.dataset.pslot; $$('#pmSlots [data-pslot]').forEach(x => x.classList.toggle('ooc-chip-on', x === b)); };
}
