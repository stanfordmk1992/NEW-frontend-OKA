

const isPortrait = () => matchMedia('(orientation: portrait)').matches;
let GAMES = null;
const loadGames = () => GAMES ? Promise.resolve(GAMES) : fetch('../ooc/games.json').then(r => r.json()).catch(() => []).then(d => { GAMES = d;

  if (!S.fav.size) d.filter(g => g.tag === 'hot').slice(0, 3).forEach(g => S.fav.add(g.id));
  if (!S.recent.length) S.recent = d.filter(g => g.cat === 'slots').slice(3, 7).map(g => g.id);
  return d; });
const lobbyTpl = () => { const w = document.createElement('div'); w.append($('#ooc-lobby').content.cloneNode(true)); return w.firstElementChild || w; };

const liveSlots = () => [...lobbyTpl().querySelectorAll('[class*="MainLobbySection_mainLobbySection"]')]
  .filter(s => /^Live Slots/.test(s.querySelector('h2')?.textContent.trim() || '')).flatMap(s => [...s.querySelectorAll('.ooc-game')])
  .map(e => ({ id: 'ls-' + e.querySelector('[data-game]').dataset.game, name: e.querySelector('[data-game]').dataset.game, provider: 'Live Slots', live: true, img: e.querySelector('img')?.getAttribute('src') || '' }));
const CARD_RE = /poker|hold.?em|teen ?patti|pai gow|three card|3 card|caribbean|pusoy|tongits|rummy|callbreak|jacks|flush|lucky 9/i;
const GCATS = [
  ['hot', 'Hot', { solid: 'M12.5 1.5c.9 3.3-1.3 5.3-1.3 7.7 0 1.4 1 2.4 2.2 2.4 1.5 0 2.4-1.2 2.2-3C18 10.4 19.5 13.3 19.5 16a7.5 7.5 0 01-15 0c0-4.4 3.3-7.3 5-9.8.9-1.4 2.2-3 3-4.7z' }],
  ['slots', 'Slots', { side: 'Live Slots' }],
  ['live-casino', 'Live Casino', { side: 'Live Tables' }],
  ['poker', 'Poker', { solid: 'M7 2h10a3 3 0 013 3v14a3 3 0 01-3 3H7a3 3 0 01-3-3V5a3 3 0 013-3zm5 4.8c-1.9 2.4-4.2 3.9-4.2 6.1a2.3 2.3 0 004 1.5l-.9 2.6h2.2l-.9-2.6a2.3 2.3 0 004-1.5c0-2.2-2.3-3.7-4.2-6.1z' }],
  ['arcade', 'Arcade', { qa: 'arcade' }], ['sports', 'Sports', { qa: 'sport' }], ['bingo', 'Bingo', { qa: 'bingo' }],
];

const SUBCATS = [
  ['baccarat', 'Baccarat', g => /baccarat/i.test(g.name)],
  ['blackjack', 'Blackjack', g => /blackjack|\b21\b/i.test(g.name)],
  ['roulette', 'Roulette', g => /roulette/i.test(g.name)],
  ['sicbo', 'Sic Bo', g => /sic ?bo/i.test(g.name)],
  ['dragon-tiger', 'Dragon Tiger', g => /dragon ?tiger/i.test(g.name)],
  ['fishing', 'Fishing', g => g.cat === 'fishing'],
];
const GTITLE = { ...Object.fromEntries(GCATS.map(c => [c[0], c[1]])), ...Object.fromEntries(SUBCATS.map(c => ['sub:' + c[0], c[1]])), new: 'New Games', 'live-slots': 'Live Slots', eslots: 'E-Slots', all: 'All Games', fav: 'Favourite Games', recent: 'Continue Playing' };
function gamesOf(code) {
  if (!GAMES) return [];
  const by = c => GAMES.filter(g => g.cat === c);
  switch (code) {
    case 'hot': return GAMES.filter(g => g.tag === 'hot');
    case 'new': return GAMES.filter(g => g.tag === 'new');
    case 'live-slots': return liveSlots();
    case 'eslots': return by('slots').filter(g => !/poker/i.test(g.name));
    case 'slots': return [...liveSlots(), ...gamesOf('eslots')];
    case 'live-casino': return [...by('live-casino'), ...by('table_game').filter(g => !CARD_RE.test(g.name) && !/ludo/i.test(g.name))];
    case 'poker': return [...by('table_game').filter(g => CARD_RE.test(g.name)), ...by('slots').filter(g => /poker/i.test(g.name))];
    case 'arcade': return [...by('fishing'), ...by('arcade'), ...by('table_game').filter(g => /ludo/i.test(g.name))];
    case 'sports': return by('sportbook');
    case 'bingo': return by('bingo');
    case 'fav': return GAMES.filter(g => S.fav.has(g.id));
    case 'recent': return S.recent.map(id => GAMES.find(g => g.id === id)).filter(Boolean);
    default: { const sc = code.startsWith('sub:') && SUBCATS.find(c => c[0] === code.slice(4)); return sc ? GAMES.filter(sc[2]) : GAMES; }
  }
}
function catIcon(src) {
  const side = src.side && [...document.querySelectorAll('aside.sticky .menu a, aside.sticky .menu button')].find(a => a.textContent.trim() === src.side)?.querySelector('[style*="background-image"], img');
  const url = (side && (side.getAttribute('src') || (side.style.backgroundImage.match(/url\(["']?([^"')]+)/) || [])[1])) || (src.qa && UI.qaIcons?.[src.qa]);
  if (!url && src.solid) return `<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="${src.solid}"/></svg>`;
  return url ? `<img alt="" src="${url}">` : `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${src.svg || 'M4 4h16v16H4z'}"/></svg>`;
}
const svgI = d => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

const solidI = d => `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="${d}"/></svg>`;
const SOLID = {
  fav: 'M12 21s-7.5-4.6-10-9.4C.3 8.1 2.4 4 6.3 4c2.2 0 3.7 1.2 4.7 2.6.4.5 1.6.5 2 0C14 5.2 15.5 4 17.7 4c3.9 0 6 4.1 4.3 7.6C19.5 16.4 12 21 12 21z',
  recent: 'M12 2a10 10 0 110 20 10 10 0 010-20zM10 7.5v9l7-4.5-7-4.5z',
  providers: 'M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z',
  stay: 'M2 19V5h2v8h7V8h8a3 3 0 013 3v8h-2v-3H4v3H2zm5-7a2.5 2.5 0 110-5 2.5 2.5 0 010 5z',
  dine: 'M5 2h1.6v6h1.2V2h1.6v6h1.2V2H12v7a3 3 0 01-2.4 2.9V22H7.4V11.9A3 3 0 015 9V2zm11 0c2.7 1 4.5 4.6 4.5 8.6V13H18v9h-2.3V2h.3z',
  wellness: 'M12 2c5 4 7 8 7 11a7 7 0 01-14 0c0-3 2-7 7-11zm-1 17.9a5 5 0 002 0V12h-2v7.9z',
  ent: 'M9 3.5L21 1v14.5a3.5 3.5 0 11-2-3.2V6.1l-8 1.7v9.7a3.5 3.5 0 11-2-3.2V3.5z',
  shop: 'M7 7V6a5 5 0 0110 0v1h3l1 15H3L4 7h3zm2 0h6V6a3 3 0 00-6 0v1z',
  rewards: 'M12 2l2.9 6.2 6.8.8-5 4.6 1.4 6.7L12 17l-6.1 3.3 1.4-6.7-5-4.6 6.8-.8z',
  account: 'M12 12a5 5 0 100-10 5 5 0 000 10zm-9 10c0-5 4-8 9-8s9 3 9 8H3z',
  bookings: 'M9 2h6a1 1 0 011 1v1h3a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h3V3a1 1 0 011-1zm1.5 15.5l6-6-1.4-1.4-4.6 4.6-2.1-2.1-1.4 1.4 3.5 3.5z',
  vouchers: 'M3 6a2 2 0 012-2h14a2 2 0 012 2v3a3 3 0 000 6v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a3 3 0 000-6V6zm11 0v12h2V6h-2z',
  points: 'M12 2a10 10 0 110 20 10 10 0 010-20zm-1 5v6l5 3 1-1.6-4-2.4V7h-2z',
  payments: 'M2 6a2 2 0 012-2h16a2 2 0 012 2v2H2V6zm0 5h20v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7zm3 4v2h5v-2H5z',
  cards: 'M2 7a3 3 0 013-3h14a3 3 0 013 3v1H2V7zm0 4h20v6a3 3 0 01-3 3H5a3 3 0 01-3-3v-6zm13 3v2h4v-2h-4z',
  invite: 'M15 8a3 3 0 100-6 3 3 0 000 6zM6 11a3 3 0 100-6 3 3 0 000 6zm12 1c-2.2 0-4 1.3-4.6 3.2A6 6 0 0115 18v3h8v-3c0-3.3-2.2-6-5-6zM6 13c-3 0-6 2.2-6 5v3h12v-3c0-2.8-3-5-6-5z',
  profile: 'M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm5 4a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm-4 10h8c0-2-2-3.5-4-3.5S5 15 5 17zm9-8h5V7.5h-5V9zm0 4h5v-1.5h-5V13z',
};

const SUB_ICON = {
  baccarat: 'M4 5a2 2 0 012-2h7a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm12 1.2l2.6.7a2 2 0 011.4 2.4l-2.8 10.4a2 2 0 01-2.2 1.5c.6-.6 1-1.4 1-2.3V6.2z',
  blackjack: 'M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm6 4l-4 10h2.2l.8-2h2l.8 2H16L12 6zm-.4 6l.4-1.2.4 1.2h-.8z',
  roulette: 'M12 2a10 10 0 110 20 10 10 0 010-20zm0 4a6 6 0 100 12 6 6 0 000-12zm0 3a3 3 0 110 6 3 3 0 010-6z',
  sicbo: 'M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm3 3.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  'dragon-tiger': 'M3 4h8v9a5 5 0 01-4 4.9A5 5 0 013 13V4zm10 0h8v9a5 5 0 01-4 4.9A5 5 0 0113 13V4z',
};
const subIcon = c => c === 'fishing' && UI.qaIcons?.fish ? `<img alt="" src="${UI.qaIcons.fish}">`
  : `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="${SUB_ICON[c] || SUB_ICON.baccarat}"/></svg>`;
const HEART ='M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6C19 16.5 12 21 12 21z';

const isLiveGame = g => g.cat === 'live-casino' || (g.cat === 'table_game' && !CARD_RE.test(g.name) && !/ludo/i.test(g.name));

const gameTile = g => `<div class="relative flex flex-col ooc-game">${tag(g.tag)}
    ${S.login && !g.live ? `<button type="button" class="ooc-fav${S.fav.has(g.id) ? ' on' : ''}" data-fav="${g.id}" aria-pressed="${S.fav.has(g.id)}" aria-label="Favourite ${esc(g.name)}">${svgI(HEART)}</button>` : ''}
    <div class="gameTile eGameTile ooc-sq" data-game="${esc(g.name)}" data-provider="${esc(g.live ? '' : g.provider || '')}" data-gid="${g.id}" role="button" tabindex="0" aria-label="Play ${esc(g.name)}">
      <div class="${UI.gameImage}">${g.img ? `<img alt="${esc(g.name)}" loading="lazy" decoding="async" class="object-cover" style="position:absolute;inset:0;height:100%;width:100%" src="${g.img}">` : ph()}</div></div>
    ${g.demo && !isLiveGame(g) ? `<button type="button" class="ooc-demo" data-demo="${esc(g.name)}" data-provider="${esc(g.provider || '')}" aria-label="Play ${esc(g.name)} in demo mode"><svg viewBox="0 0 24 24" width="9" height="9" aria-hidden="true"><path d="M7 4v16l13-8z" fill="currentColor"/></svg>DEMO</button>` : ''}
    <div class="ooc-game-info"><div class="ooc-game-txt"><span class="${UI.egTitle} ooc-game-name">${esc(g.name)}</span><span class="ooc-provider${g.live ? ' ooc-provider-cat' : ''}">${esc(g.provider || '')}</span></div></div></div>`;

const allTile = (href, total) => `<a class="relative flex flex-col ooc-game ooc-all" href="${href}" aria-label="View all ${total} games">
    <div class="gameTile ooc-sq"><div class="ooc-all-in"><b>ALL</b><span>${total} games</span></div></div><div class="ooc-game-info"><div class="ooc-game-txt"><span class="ooc-game-name">&nbsp;</span></div></div></a>`;

const withAll = (list, n, href, total = list.length) => list.length > n - 1 ? [...list.slice(0, n - 1).map(gameTile), allTile(href, total)] : list.map(gameTile);
const blockGrid = (list, n, href) => `<div class="ooc-games">${withAll(list, n, href).join('')}</div>`;
const gameGrid = (list, id) => `<div class="ooc-games"${id ? ` id="${id}"` : ''}>${list.map(gameTile).join('')}</div>`;

const MAX_PAGES = 3;
function gameRow(id, list, href, rows = 1) {
  const per = 3 * rows, cap = Math.min(list.length, per * MAX_PAGES);
  const cells = href ? withAll(list.slice(0, cap), cap, href, list.length) : list.slice(0, cap).map(gameTile);
  const pages = []; for (let i = 0; i < cells.length; i += per) pages.push(cells.slice(i, i + per));
  return `<div class="ooc-car"><div class="ooc-car-track ooc-car-paged" data-track="${id}">${pages.map(p => `<div class="ooc-games ooc-car-page">${p.join('')}</div>`).join('')}</div>
    ${pages.length > 1 ? `<div class="ooc-car-dots" aria-hidden="true">${pages.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</div>` : ''}</div>`;
}
const pageCount = (list, rows) => Math.ceil(Math.min(list.length, 3 * rows * MAX_PAGES) / (3 * rows));

const GCAT_SRC = Object.fromEntries(GCATS.map(c => [c[0], c[2]]));
const SEC_SRC = {
  hot: GCAT_SRC.hot, slots: GCAT_SRC.slots, 'live-slots': GCAT_SRC.slots, 'live-casino': GCAT_SRC['live-casino'], poker: GCAT_SRC.poker,
  arcade: GCAT_SRC.arcade, bingo: GCAT_SRC.bingo, sports: GCAT_SRC.sports,
  eslots: { side: 'eGaming' },
  new: { solid: 'M12 1.5l2.4 5.6 6.1.6-4.6 4 1.4 6-5.3-3.2-5.3 3.2 1.4-6-4.6-4 6.1-.6zM19 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9zM5 15l.7 1.6 1.6.7-1.6.7L5 19.6 4.3 18l-1.6-.7 1.6-.7z' },
  payouts: { solid: 'M6 2h12v2h3v3a5 5 0 01-4.4 5A6 6 0 0113 15.9V19h3v3H8v-3h3v-3.1A6 6 0 017.4 12 5 5 0 013 7V4h3V2zm0 4H5v1a3 3 0 001.3 2.5A6 6 0 016 8V6zm12 0v2c0 .5 0 1-.3 1.5A3 3 0 0019 7V6h-1z' },
  resort: { solid: 'M12 1.5l9.5 6V10h-19V7.5l9.5-6zM4.5 11.5h2.5v7H4.5zm4.2 0h2.5v7H8.7zm4.1 0h2.5v7h-2.5zm4.2 0h2.5v7H17zM2.5 20h19v2.5h-19z' },
};

const RESORT_ICON = 'M10.9 10.4h2.2c.8 4.4.4 7.8-1 10.6H9.4c1.7-3.1 2.1-6.4 1.5-10.6zM12 10.4C10.6 5 6 3.4 1.5 6.8 5.5 7.5 9 8.4 12 10.4zM12 10.4C13.4 5 18 3.4 22.5 6.8 18.5 7.5 15 8.4 12 10.4zM12 10.4C10.8 6.5 12 3.5 15.8 1.6 14.6 4.6 13.6 7.5 12 10.4zM12 10.4C7.8 9.6 4.4 11.4 2.6 15.6 5.4 14.2 8.4 12.2 12 10.4zM12 10.4C16.2 9.6 19.6 11.4 21.4 15.6 18.6 14.2 15.6 12.2 12 10.4zM4.5 20h15v2h-15z';
const OM_LOGO = `<span class="ooc-sec-ic" aria-hidden="true">${solidI(RESORT_ICON)}</span>`;

const SEC_3D = { hot: 'hot', new: 'new', slots: 'slots', 'live-slots': 'slots', eslots: 'slots', 'live-casino': 'live-casino', poker: 'poker', arcade: 'arcade', sports: 'sports', bingo: 'bingo' };
function secIcon(key) {
  if (SEC_3D[key] && typeof icon3d === 'function') return `<span class="ooc-sec-ic ooc-sec-3d" aria-hidden="true">${icon3d(SEC_3D[key])}</span>`;
  const src = SEC_SRC[key]; if (!src) return UI.sectionIcon;
  const m = catIcon(src).match(/^<img alt="" src="([^"]+)">$/);
  return m ? `<span class="ooc-sec-ic ooc-sec-mask" style="--m:url('${m[1]}')" aria-hidden="true"></span>` : `<span class="ooc-sec-ic" aria-hidden="true">${catIcon(src)}</span>`;
}
const pagedBlock = (title, id, list, rows) => section(title, gameRow(id, list, '#games/' + id, rows), { href: '#games/' + id, nav: pageCount(list, rows) > 1 ? carNav(id) : '', icon: secIcon(id) });

function carNav(id) {
  const nav = lobbyTpl().querySelector('[class*="QuickAccessCarousel_navButton"]');
  const b = dir => nav ? nav.outerHTML.replace('<button', `<button type="button" data-car="${id}:${dir}" aria-label="${dir < 0 ? 'Previous' : 'Next'}"${dir < 0 ? ' disabled' : ''}`) : btn('btnPlum', dir < 0 ? '‹' : '›', `data-car="${id}:${dir}"`);
  return `<div class="ooc-car-nav">${b(-1)}${b(1)}</div>`;
}

const catCell = ([c, l, src]) => `<a href="#games/${c}"><span class="ooc-gcat-ic">${icon3d(c) || catIcon(src)}</span><span>${l}</span></a>`;

const catNav = () => `<nav class="ooc-gcats3" aria-label="Game categories">${GCATS.map(catCell).join('')}</nav>`;
const providersOf = list => [...new Set(list.filter(g => !g.live).map(g => g.provider).filter(Boolean))].sort((a, b) => a.localeCompare(b));
