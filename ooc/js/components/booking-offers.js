
const OFFER_IC = {
  promo: 'M3 3h8.2a2 2 0 011.4.6l8.8 8.8a2 2 0 010 2.8l-6.2 6.2a2 2 0 01-2.8 0L3.6 12.6A2 2 0 013 11.2V3zm5 3a2 2 0 100 4 2 2 0 000-4z',
  member: 'M2.5 7l4.8 4.2L12 4l4.7 7.2L21.5 7 19.4 19H4.6L2.5 7zM4.6 20.2h14.8V22H4.6z',
  voucher: 'M3 6a2 2 0 012-2h14a2 2 0 012 2v3a3 3 0 000 6v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a3 3 0 000-6V6zm11 0v12h2V6h-2z',
  points: 'M12 2a10 10 0 110 20 10 10 0 010-20zm-1 5v6l5 3 1-1.6-4-2.4V7h-2z',
};

function bookingOffers(kind, ref = {}) {
  const items = [];
  const promos = PROMOS.filter(e => {
    if (kind === 'stay') return e.cat === 'stay' && e.stay && (!e.stay.scat || !ref.room || e.stay.scat === ROOMS.find(r => r.id === ref.room)?.cat);
    if (kind === 'dine') return e.rest && e.rest === ref.rest;
    if (kind === 'wellness' || kind === 'shop') return e.prod && e.prod === ref.prod;
    if (kind === 'event') return false;
    return false;
  });
  promos.forEach(e => items.push(['promo', e.title, e.meta]));
  if (!S.login) return offersHtml(items, true);
  if (ref.member) items.push(['member', `${ME.tier} member rate`, `Save ${money(ref.member)} on this booking`]);
  else if ((kind === 'wellness' || kind === 'shop') && ref.disc !== false) items.push(['member', `${ME.tier} member · 10% off`, 'Applied automatically at checkout']);
  const vk = kind === 'event' ? 'event' : kind;
  (ME.vouchers || []).filter(v => !v.used && v.kinds.includes(vk)).forEach(v => items.push(['voucher', v.title, `${v.code} · choose it at checkout`]));
  if (!isUnverified()) {
    const types = (ELIG[kind] || []).filter(t => ME[t] > 0);
    if (types.length) items.push(['points', 'Pay with points', types.map(t => `${PTS[t]} ${fmt(ME[t])}`).join(' · ') + ' · 1 pt = ₱1']);
  }
  return offersHtml(items, false);
}
function offersHtml(items, guest) {
  if (!items.length && !guest) return '';
  return `<div class="ooc-bo" role="note" aria-label="Offers for this booking"><span class="ooc-bo-h">Offers for this booking</span>
    ${items.length ? `<ul>${items.map(([k, t, s]) => `<li><i class="ooc-bo-ic ooc-bo-${k}">${solidI(OFFER_IC[k])}</i><span><b>${esc(t)}</b><small>${esc(s)}</small></span></li>`).join('')}</ul>` : ''}
    ${guest ? `<p class="ooc-bo-login"><a href="javascript:void 0" data-action="login">Log in</a> to see member rates, vouchers and points.</p>` : ''}</div>`;
}
