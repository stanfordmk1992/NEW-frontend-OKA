

const payText = o => [o.payable ? `${money(o.payable)} · ${o.method === 'wallet' ? 'Platform account' : payVia(o)}` : '', o.pts ? `${fmt(o.pts)} ${PTS[o.ptsType]}` : '', o.voucher ? `Voucher ${o.voucher.code}` : ''].filter(Boolean).join(' + ') || 'No payment';

const RES_TABS = () => [['stay', 'Stay'], ['dine', 'Dine'], ['wellness', 'Wellness'], ['ent', 'Entertainment'], ['shop', 'E-Shop']];
const resortTabs = cur => `<div class="ooc-portrait-only ooc-mtabs">${tabs(RES_TABS(), cur, 'rgo', 'Resort')}</div>`;

const TITLES = { rewards: 'Reward Circle', stay: 'Stay', dine: 'Dine', wellness: 'Wellness', ent: 'Entertainment', shop: 'E-Shop', checkout: 'Checkout',
  promo: 'Promotions', account: 'My Account', bookings: 'My Bookings', vouchers: 'My Vouchers', points: 'Points History', payments: 'Payment Records', profile: 'Profile', providers: 'Providers', fav: 'Favourite Games', recent: 'Continue Playing' };
const ACCT_SUB = ['bookings', 'vouchers', 'points', 'payments', 'cards', 'profile', 'wallet', 'spending', 'bets', 'freeplay', 'rg'];

const BACK_IC = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const backBtn = ([href, label]) => `<a class="ooc-back" href="${href}" aria-label="Back to ${esc(label)}" title="Back to ${esc(label)}">${BACK_IC}</a>`;
const pageHead = (title, back) => `<header class="ooc-pagehead">${back ? backBtn(back) : ''}<h1>${esc(title)}</h1></header>`;
const acctBack = () => '';

function promoTile(e) {
  const full = e.left === 0, joined = S.joined.has(e.id);
  const label = full ? (e.price === 'By invitation' ? 'Invitation Only' : 'Full')
    : e.cat === 'online' ? (joined ? 'Joined' : 'Join Now') : e.stay ? 'Check Rates' : e.rest ? 'Reserve' : e.prod ? 'Book' : e.info ? 'Details' : e.priceN ? 'Buy Tickets' : e.price === 'Free' ? 'Add to Plan' : 'Register';
  const dis = full || joined;
  return tile({ title: e.title, t: e.tag, dim: full,
    meta: `${e.meta} · ${e.price}<span class="ooc-tile-cta">${btn(dis ? 'btnPlum' : 'btnGold', label, `data-promo="${e.id}"${dis ? ' disabled' : ''}`)}</span>` });
}
const PLABEL = { online: 'Online', onsite: 'On-site' };

const promoCard = e => tile({ title: e.title, meta: esc(e.meta), t: e.tag, dim: e.left === 0, label: PLABEL[e.cat], action: 'go:promo/' + e.id, img: RIMG.promo(e.id) });

function promoDetail(id) {
  const e = PROMOS.find(x => x.id === id); if (!e) return '<div class="ooc-muted-d">Promotion not found.</div>';
  const full = e.left === 0, joined = S.joined.has(e.id), online = e.cat === 'online', gaming = online || e.cat === 'onsite';

  const label = full ? (e.price === 'By invitation' ? 'Invitation Only' : 'Full') : online ? (joined ? 'Joined' : 'Join Promotion')
    : gaming ? 'Register' : e.stay ? 'Check Rates' : e.rest ? 'Reserve' : e.prod ? 'Book' : e.priceN ? 'Buy Tickets' : e.price === 'Free' ? 'Add to Plan' : e.info ? '' : 'Register';
  const terms = online ? ['Open to verified members aged 21 and above.', 'Opt in before playing eligible games.', 'Wagering requirements and expiry apply. See full terms.', 'Bonus funds cannot be used for resort bookings.']
    : gaming ? ['Held on-site at Okada Manila. Valid ID required.', 'Open to Reward Circle members aged 21 and above.', 'Registration is free. No online payment.']
    : [e.info || `${e.meta} · ${e.price}`, 'Members only. Log in to book.', 'Subject to availability. Terms of the outlet apply.'];
  return `<div class="ooc-pd">
      <div class="ooc-pd-img"><img class="ooc-tile-img" src="${RIMG.promo(e.id)}" alt="">${tag(e.tag)}</div>
      <div class="ooc-pd-b">
        <div class="ooc-pd-meta">${gaming ? `<i class="ooc-ptag ooc-ptag-${online ? 'online' : 'onsite'}">${PLABEL[e.cat]}</i>` : ''}<span>${esc(e.meta)}</span></div>
        <ul class="ooc-pd-terms">${terms.map(t => `<li>${t}</li>`).join('')}</ul>
        ${label ? (typeof promoCta === 'function' ? promoCta(e, full, joined, label) : btn(full || joined ? 'btnPlum' : 'btnGold', label, `data-promo="${e.id}"${full || joined ? ' disabled' : ''}`)) : ''} <!-- v1.22：Play Now / Claim -->
      </div>
    </div>`;
}

const offerCard = e => tile({ title: e.title, meta: esc(e.meta), t: e.tag, dim: e.left === 0, action: 'go:promo/' + e.id, img: RIMG.promo(e.id) });
const offersBlock = (page, title) => { const l = PROMOS.filter(e => e.cat === PAGE_PROMO[page]); return l.length ? section(title, '<div class="ooc-offers">' + grid(l.map(offerCard)) + '</div>') : ''; };

const promoBack = e => { const pg = e && Object.keys(PAGE_PROMO).find(k => PAGE_PROMO[k] === e.cat); return pg ? ['#' + pg, TITLES[pg]] : ['#promo', 'Promotions']; };
