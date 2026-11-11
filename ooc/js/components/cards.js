

function roomRow(r, q, n) {
  const sold = r.left === 0, open = S.roomOpen === r.id;
  const from = Math.round(r.base * Math.min(...RATES.map(x => x.mult)) / 10) * 10;
  return `<div class="ooc-room${sold ? ' ooc-dim' : ''}${open ? ' is-open' : ''}">
    <button type="button" class="ooc-room-h" data-room="${r.id}" aria-expanded="${open}" aria-controls="rates-${r.id}">
      <span class="ooc-room-img"><img src="resort/rooms/${r.id}.webp" alt="" loading="lazy">${tag(r.tag)}</span>
      <span class="ooc-room-i"><b>${esc(r.title)}</b><span>${esc(r.meta)}</span>
        <span class="ooc-room-p">${sold ? '<em class="ooc-warn">Sold out</em>' : `<small>From</small> <b>${money(from)}</b><small>/night</small>${r.left < 3 ? ` <em class="ooc-warn">Only ${r.left} left</em>` : ''}`}<i class="ooc-room-chev" aria-hidden="true"></i></span></span>
    </button>
    <div class="ooc-rates" id="rates-${r.id}"${open ? '' : ' hidden'}>${sold ? `<div class="ooc-rate"><div><b>Sold out for these dates</b><small>Try different dates or another room type.</small></div></div>` : RATES.map(rate => {
      const night = Math.round(r.base * rate.mult / 10) * 10;
      return `<div class="ooc-rate"><div><b>${rate.name}</b><small>${rate.desc}</small></div>
        <div class="ooc-rate-p"><div><b>${money(night)}</b><small>/night · ${money(night * n * q.rooms)} total</small></div>${btn('btnGold', 'Book', `data-rate="${r.id}:${rate.code}"`)}</div></div>`;
    }).join('')}</div>
  </div>`;
}
function prodTile(p) {
  const from = Math.min(...p.opts.map(o => o[1]));

  return tile({ kicker: p.mod === 'wellness' ? 'WELLNESS' : shopCat(p).toUpperCase(), title: p.title, t: p.tag, action: 'prod:' + p.id, img: RIMG.prod(p.id),
    meta: `${p.meta}<br><b class="ooc-pts-t">${p.opts.length > 1 ? 'From ' : ''}${money(from)}</b>` });
}

const OM_ADDR = 'Okada Manila, New Seaside Drive, Entertainment City, Parañaque City, Metro Manila';
function tripInfo(o) {
  const m = o.meta || {}, rest = m.rest && RESTS.find(r => r.id === m.rest), prod = m.pid && PRODUCTS.find(p => p.id === m.pid), ev = m.ev && PROMOS.find(e => e.id === m.ev);
  if (o.kind === 'stay') return { img: `resort/rooms/${m.room}.webp`, venue: 'Okada Manila Hotel', when: `${pretty(m.ci)} → ${pretty(m.co)} · Check-in from 15:00 · Check-out by 12:00`,
    info: [`${m.n} night(s) · ${m.rooms} room(s)`], where: 'Check in at the Hotel Lobby. Valet and self-parking are available at the main entrance.' };
  if (o.kind === 'dine') return { img: RIMG.rest(m.rest), venue: rest?.title || 'Restaurant', when: `${pretty(o.date)} · ${o.slot}`,
    info: [`${m.guests} guest(s)`, rest?.meta].filter(Boolean), where: 'Please arrive 10 minutes early. Tables are held for 15 minutes after your booking time.' };
  if (o.kind === 'event') return { img: RIMG.promo(m.ev), venue: (ev?.meta.split('·')[1] || ev?.title || 'Okada Manila').trim(), when: `${pretty(o.date)} · ${o.slot}`,
    info: [o.sub], where: 'Doors open 30 minutes before the start. Show your booking reference at the entrance.' };
  const venue = prod ? (/kids club/i.test(prod.title) ? 'Okada Kids Club' : prod.meta.split('·').map(s => s.trim()).find(s => /retreat|powerfit|thrillscape|piazza|spice/i.test(s)) || prod.title) : 'Okada Manila';
  return { img: prod ? RIMG.prod(prod.id) : '', venue, when: `${pretty(o.date)} · ${o.slot}`,
    info: [o.sub], where: o.kind === 'wellness' ? 'Please arrive 15 minutes before your appointment to check in at reception.' : 'Show your booking reference at the counter on arrival.' };
}
function tripCard(o) {
  const t = tripInfo(o), open = S.tripOpen === o.id;
  return `<div class="ooc-trip${open ? ' is-open' : ''}">
    <button type="button" class="ooc-trip-h" data-trip="${o.id}" aria-expanded="${open}" aria-controls="trip-${o.id}">
      <span class="ooc-trip-img">${t.img ? `<img src="${t.img}" alt="" loading="lazy">` : ph()}</span>
      <span class="ooc-trip-i"><small>${KIND[o.kind][1]}</small><b>${esc(o.title)}</b><span>${esc(t.when)}</span></span>
      <span class="ooc-status s-${o.status.toLowerCase()}">${STATUS[o.status]}</span><i class="ooc-room-chev" aria-hidden="true"></i>
    </button>
    <div class="ooc-trip-b" id="trip-${o.id}"${open ? '' : ' hidden'}>
      <div class="ooc-trip-sec"><h4>Booking Details</h4>
        ${kv('Reference', o.refs.conf || o.id)}${t.info.map(x => kv('Details', esc(x))).join('')}${o.payable || o.pts ? kv('Paid', esc(payText(o))) : ''}${o.rule ? kv('Policy', esc(o.rule.text)) : ''}</div>
      <div class="ooc-trip-sec"><h4>Location</h4>
        <p><b>${esc(t.venue)}</b><br>${OM_ADDR}</p><p class="ooc-trip-note">${t.where}</p>
        <a class="ooc-trip-map" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Okada Manila')}" target="_blank" rel="noopener">Get Directions ›</a></div>
      <a class="ooc-trip-more" href="#bookings">Manage in My Bookings ›</a>
    </div>
  </div>`;
}
function orderCard(o) {
  const a = [];
  if (o.status === 'PENDING_PAYMENT') { a.push(btn('btnGold', `Continue Payment · ${mmss(o.expires)}`, `data-oact="pay:${o.id}" data-cd-btn="${o.expires}"`)); a.push(btn('btnPlum', 'Cancel', `data-oact="abort:${o.id}"`)); }
  if (o.status === 'FAILED') a.push(btn('btnGold', 'Retry Payment', `data-oact="res:${o.id}"`));
  if (o.status === 'CONFIRMED') {
    if (o.changeable) a.push(btn('btnPlum', 'Change Date', `data-oact="change:${o.id}"`));
    if (o.kind !== 'reward') a.push(btn('btnPlum', 'Cancel', `data-oact="cancel:${o.id}"`));
  }
  if (o.payable || o.pts) a.push(btn('btnPlum', 'Receipt', `data-oact="receipt:${o.id}"`));
  return `<div class="ooc-order">
    <span class="ooc-bk-ic">${KIND[o.kind][0]}</span>
    <div class="ooc-order-i"><b>${esc(o.title)}</b><span>${esc(o.sub)}</span><span>${o.id}${o.refs.conf ? ' · ' + o.refs.conf : ''} · ${esc(payText(o))}</span></div>
    <span class="ooc-status s-${o.status.toLowerCase()}">${STATUS[o.status]}</span>
    ${a.length ? `<div class="ooc-order-a">${a.join('')}</div>` : ''}
  </div>`;
}

async function loadHighlights(sel) {
  const el = $(sel); if (!el) return;
  el.innerHTML = skeleton(4);
  try {
    const d = await api.highlights();
    el.innerHTML = grid(d.map(h => tile({ kicker: h.kicker, title: h.title, meta: h.meta, t: h.tag, action: 'go:' + h.route, img: h.img })));
  } catch {
    el.innerHTML = `<div class="ooc-fail"><span>Resort highlights are unavailable right now. Games are not affected.</span>${btn('btnGold', 'Retry', `data-retry="${sel}"`)}</div>`;
  }
}
