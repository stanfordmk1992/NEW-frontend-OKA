

const PAGE_STEP = 12;
function gamesPage(code) {
  if (!GAMES) { loadGames().then(() => { if ($('#ooc-main').dataset.page === 'games') render('games'); }); return skeleton(6); }
  if (S.gf.code !== code) S.gf = { code, q: '', prov: code.startsWith('p:') ? code.slice(2) : '' };
  const base = code.startsWith('p:') ? gamesOf('all') : gamesOf(code);
  const provs = providersOf(base);
  const head = code.startsWith('p:') ? pageHead(S.gf.prov || 'Provider', ['#providers', 'Providers']) : pageHead(GTITLE[code] || 'Games', ['#lobby', 'Home']);
  const tools = `<div class="ooc-gtools">
      ${input('<span class="sr-only">Search</span>', `<span class="ooc-sicon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></span><input data-slot="input" class="${UI.input}" id="ooc-gfq" type="search" placeholder="Search games" value="${esc(S.gf.q)}" autocomplete="off">`)}
      ${provs.length > 1 ? select('<span class="sr-only">Provider</span>', 'ooc-gfp', [['', 'All providers'], ...provs.map(p => [p, p])], S.gf.prov) : ''}
    </div>`;
  if (code === 'sports') return head + gameGrid(base);
  return head + tools + `<div id="ooc-gbody">${gamesBody(code, base)}</div>`;
}
function filtered(base) {
  const q = S.gf.q.trim().toLowerCase();
  return base.filter(g => (!q || g.name.toLowerCase().includes(q) || (g.provider || '').toLowerCase().includes(q)) && (!S.gf.prov || g.provider === S.gf.prov));
}
function gamesBody(code, base) {
  const active = S.gf.q.trim() || (S.gf.prov && !code.startsWith('p:'));
  if (code === 'slots' && !active)
    return pagedBlock('Live Slots', 'live-slots', gamesOf('live-slots'), 2)
      + pagedBlock('E-Slots', 'eslots', gamesOf('eslots'), 2);
  const list = filtered(base);
  S.gf.list = list; S.gf.n = PAGE_STEP;
  return list.length ? `${active ? `<p class="ooc-gcount">${list.length} game${list.length === 1 ? '' : 's'}</p>` : ''}${gameGrid(list.slice(0, PAGE_STEP), 'ooc-ggrid')}${list.length > PAGE_STEP ? '<div class="ooc-sentinel" aria-hidden="true"></div>' : ''}`
    : '<div class="ooc-muted-d">No games found.</div>';
}
function refreshGamesBody() {
  const code = S.gf.code, base = code.startsWith('p:') ? gamesOf('all') : gamesOf(code), b = $('#ooc-gbody'); if (!b) return;
  b.innerHTML = gamesBody(code, base); watchSentinel();
}
let sentinelObs = null;
function watchSentinel() {
  sentinelObs?.disconnect(); const s = $('.ooc-sentinel'); if (!s) return;
  sentinelObs = new IntersectionObserver(es => { if (!es.some(e => e.isIntersecting)) return;
    const grid = $('#ooc-ggrid'), list = S.gf.list || []; if (!grid) return;
    grid.insertAdjacentHTML('beforeend', list.slice(S.gf.n, S.gf.n + PAGE_STEP).map(gameTile).join(''));
    S.gf.n += PAGE_STEP; if (S.gf.n >= list.length) { sentinelObs.disconnect(); $('.ooc-sentinel')?.remove(); }
  }, { rootMargin: '400px 0px' });
  sentinelObs.observe(s);
}

function providersPage() {
  if (!GAMES) { loadGames().then(() => { if ($('#ooc-main').dataset.page === 'providers') render('providers'); }); return skeleton(6); }
  const count = {}; GAMES.forEach(g => { if (g.provider) count[g.provider] = (count[g.provider] || 0) + 1; });
  return `<div class="ooc-provs">${Object.keys(count).sort((a, b) => count[b] - count[a]).map(p => `<a class="ooc-prov" href="#games/p:${encodeURIComponent(p)}"><b>${esc(p)}</b><span>${count[p]} games</span></a>`).join('')}</div>`;
}

function myGamesPage(code) {
  if (!S.login) return loginPanel('Log in to see your games.');
  if (!GAMES) { loadGames().then(() => render(code)); return skeleton(6); }
  const l = gamesOf(code);
  return l.length ? gameGrid(l) : `<div class="ooc-muted-d">${code === 'fav' ? 'Tap the heart on any game to save it here.' : 'Games you play will appear here.'}</div>`;
}
