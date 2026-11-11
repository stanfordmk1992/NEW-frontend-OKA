
const LB_ICON = 'M7 3h10v2h3v3a4 4 0 01-4 4h-.3A5 5 0 0113 14.9V17h3v4H8v-4h3v-2.1A5 5 0 018.3 12H8a4 4 0 01-4-4V5h3V3zm-1 4v1a2 2 0 002 2V7H6zm12 0h-2v3a2 2 0 002-2V7z';
const LB_TABS = [['wager', 'Top Wagers'], ['winloss', 'Win / Loss']];

const LB_SUB = { wager: 'Games ranked by total wagers today', winloss: 'Players ranked by net win / loss yesterday' };
let lbTab = 'wager';
const lbRand = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const lbMask = (r) => { const a = 'ABCDEFGHJKLMNPRSTUVWXYZ'; return a[Math.floor(r() * a.length)] + '*****' + a[Math.floor(r() * a.length)].toLowerCase() + Math.floor(r() * 90 + 10); };
function lbData() {
  const pool = (GAMES || []).filter(g => g.img && !['sportbook', 'bingo'].includes(g.cat));
  const r = lbRand(20261111);
  const pick = () => pool[Math.floor(r() * pool.length)];
  const wager = Array.from({ length: 10 }, () => ({ g: pick(), amt: Math.round(r() * 9e6 + 4e5) })).filter(x => x.g)
    .filter((x, i, a) => a.findIndex(y => y.g.id === x.g.id) === i).sort((a, b) => b.amt - a.amt);
  const winloss = Array.from({ length: 10 }, () => ({ p: lbMask(r), amt: Math.round((r() * 1.15 - .15) * 2.4e6) })).sort((a, b) => b.amt - a.amt);
  return { wager, winloss };
}

const lbShort = n => '₱' + (n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : fmt(n));
const lbRank = i => `<b class="ooc-lbd-rank${i < 3 ? ' r' + (i + 1) : ''}">${i + 1}</b>`;
const lbThumb = g => `<span class="ooc-lbd-th"><img src="${g.img}" alt="" loading="lazy"></span>`;
function lbBody() {
  const d = lbData();
  if (lbTab === 'wager') return d.wager.map((x, i) => `
    <button type="button" class="ooc-lbd-row" data-game="${esc(x.g.name)}" data-provider="${esc(x.g.provider || '')}" data-lb-play>
      ${lbRank(i)}${lbThumb(x.g)}<span class="ooc-lbd-i"><b>${esc(x.g.name)}</b><small>${esc(x.g.provider || '')}</small></span><span class="ooc-lbd-v" title="${money(x.amt)}">${lbShort(x.amt)}</span></button>`).join('');

  return d.winloss.map((x, i) => `
    <div class="ooc-lbd-row ooc-lbd-row-u">
      ${lbRank(i)}<span class="ooc-lbd-i"><b>${esc(x.p)}</b></span><span class="ooc-lbd-v ${x.amt >= 0 ? 'up' : 'down'}">${x.amt >= 0 ? '+' : '−'}${money(Math.abs(x.amt))}</span></div>`).join('');
}
function lbDrawer() {
  lastFocus = document.activeElement;
  $('#ooc-layer').innerHTML = `
    <div tabindex="-1" class="ooc-portal"><div class="${UI.backdrop}" data-close></div>
    <aside class="ooc-drawer ooc-lbd bg-maroon-gradient" role="dialog" aria-modal="true" aria-label="Leaderboard">
      <header class="ooc-lbd-h"><div class="ooc-lbd-ht"><h2>Leaderboard</h2><button type="button" class="ooc-x" data-close aria-label="Close">×</button></div>
        <div class="ooc-lbd-tabs">${tabs(LB_TABS, lbTab, 'lbtab', 'Leaderboard')}</div><p class="ooc-lbd-sub" id="ooc-lbd-sub">${LB_SUB[lbTab]}</p></header>
      <div class="ooc-lbd-b" id="ooc-lbd-b"><div class="ooc-lbd-list">${lbBody()}</div></div>
    </aside></div>`;
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => $('.ooc-lbd [role=tab][aria-selected="true"]')?.focus({ preventScroll: true }), 30);
}
const lbOpen = () => !!$('#ooc-layer .ooc-lbd');

document.body.insertAdjacentHTML('beforeend', `<button type="button" id="ooc-lb-fab" class="${UI.btnPlum} ooc-lb-fab" aria-label="Leaderboard">${solidI(LB_ICON)}</button>`);
document.addEventListener('click', e => {
  if (e.target.closest('#ooc-lb-fab')) { e.preventDefault(); e.stopImmediatePropagation(); loadGames().then(lbDrawer); return; }
  if (!lbOpen()) return;
  if (!e.target.closest('.ooc-lbd')) { e.preventDefault(); e.stopImmediatePropagation(); closeLayer(); return; }
  const t = e.target.closest('[data-lbtab]');
  if (t) { e.stopImmediatePropagation(); lbTab = t.dataset.lbtab; $('#ooc-layer .ooc-lbd-tabs').innerHTML = tabs(LB_TABS, lbTab, 'lbtab', 'Leaderboard'); $('#ooc-lbd-b').innerHTML = '<div class="ooc-lbd-list">' + lbBody() + '</div>'; $('#ooc-lbd-sub').textContent = LB_SUB[lbTab]; $('#ooc-lbd-b').scrollTop = 0; $('.ooc-lbd [role=tab][aria-selected="true"]')?.focus({ preventScroll: true }); return; }
  const p = e.target.closest('[data-lb-play]');
  if (p) { e.stopImmediatePropagation(); closeLayer(); launchGame(p.dataset.game, p.dataset.provider, 'real'); }
}, true);
