
const PO_MAX = 10;
const PO_NAMES = ['J***n D.', 'M***a S.', 'R***o C.', 'A***e L.', 'K***n T.', 'P***o R.', 'G***e B.', 'L***a M.', 'C***s V.', 'E***a G.', 'D***l F.', 'N***e P.', 'B***y Q.', 'S***h Y.', 'T***y O.'];
let PO_LIST = null, poTimer = null;
const poPick = a => a[Math.floor(Math.random() * a.length)];
function poGames() { return (GAMES || []).filter(g => g.img && g.name); }
function poMake(ago = 0) {
  const g = poPick(poGames()) || { name: 'Okada Online', provider: '' };
  const big = Math.random() < .15;
  const amt = Math.round((big ? 50000 + Math.random() * 450000 : 800 + Math.random() * 40000) / 10) * 10;
  return { id: Math.random().toString(36).slice(2), player: poPick(PO_NAMES), game: g.name, provider: g.provider || '', img: g.img || '', amt, big, at: Date.now() - ago };
}
function poSeed() { if (!PO_LIST && poGames().length) PO_LIST = Array.from({ length: PO_MAX }, (_, i) => poMake(i * 47000 + Math.random() * 30000)); }
const poAgo = t => { const s = Math.max(0, Math.round((Date.now() - t) / 1000)); return s < 10 ? 'Just now' : s < 60 ? s + 's ago' : s < 3600 ? Math.floor(s / 60) + 'm ago' : Math.floor(s / 3600) + 'h ago'; };
const poRow = (r, fresh) => `
  <li class="ooc-po${fresh ? ' is-new' : ''}${r.big ? ' is-big' : ''}" data-po="${r.id}">
    <span class="ooc-po-img">${r.img ? `<img src="${r.img}" alt="" loading="lazy">` : ''}</span>
    <span class="ooc-po-t"><b>${esc(r.game)}</b><small>${esc(r.player)} · <time data-po-at="${r.at}">${poAgo(r.at)}</time></small></span>
    <b class="ooc-po-amt">${money(r.amt)}</b>
  </li>`;
function payoutSection() {
  if (!GAMES) loadGames().then(() => { poSeed(); const l = $('#ooc-po-list'); if (l) l.innerHTML = PO_LIST.map(r => poRow(r)).join(''); });
  poSeed(); poStart();
  return section('Latest Payouts', `<div class="ooc-po-card"><ul id="ooc-po-list" class="ooc-po-list" aria-live="polite">${(PO_LIST || []).map(r => poRow(r)).join('')}</ul></div>`, { icon: secIcon('payouts') });
}

function poStart() {
  if (poTimer) return;
  const tick = () => {
    poTimer = setTimeout(tick, 3500 + Math.random() * 3500);
    if (!PO_LIST) return poSeed();
    const r = poMake(); PO_LIST.unshift(r); PO_LIST.length = PO_MAX;
    const l = $('#ooc-po-list'); if (!l) return;
    l.insertAdjacentHTML('afterbegin', poRow(r, true));
    while (l.children.length > PO_MAX) l.lastElementChild.remove();
    l.querySelectorAll('time[data-po-at]').forEach(t => { t.textContent = poAgo(+t.dataset.poAt); });
  };
  poTimer = setTimeout(tick, 3000);
}
