

const RESORT_BANNERS = [['stay', 'Weekend Staycation', 'Stay'], ['dine', 'Kiapo · Modern Filipino', 'Dine'], ['wellness', 'The Retreat Spa', 'Wellness'], ['ent', 'Party with the Magic', 'Entertainment']];
function mobileLobby() {
  if (!GAMES) { loadGames().then(() => { if ($('#ooc-main').dataset.page === 'lobby') render('lobby'); }); return skeleton(6); }
  const tpl = lobbyTpl(), banner = tpl.children[1]?.outerHTML || '', marquee = tpl.querySelector('.topPayoutMarquee')?.outerHTML || '';
  const sports = gamesOf('sports')[0];
  return `<div class="ooc-home">
    ${banner}${marquee}
    ${catNav()}
    <form class="ooc-gsearch" role="search" onsubmit="return false">
      ${input('<span class="sr-only">Search games</span>', `<span class="ooc-sicon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></span><input data-slot="input" class="${UI.input}" id="ooc-gsq" type="search" placeholder="Search games or providers" autocomplete="off">`)}
    </form>
    <div id="ooc-gs-res" hidden></div>
    <div id="ooc-home-rest">
      ${pagedBlock('Hot Games', 'hot', gamesOf('hot'), 1)}
      ${pagedBlock('New Games', 'new', gamesOf('new'), 1)}
      ${pagedBlock('Live Slots', 'live-slots', gamesOf('live-slots'), 2)}
      ${pagedBlock('E-Slots', 'eslots', gamesOf('eslots'), 2)}
      ${pagedBlock('Live Casino', 'live-casino', gamesOf('live-casino'), 1)}
      ${pagedBlock('Poker', 'poker', gamesOf('poker'), 1)}
      ${pagedBlock('Arcade', 'arcade', gamesOf('arcade'), 1)}
      ${section('Sports', `<div class="ooc-sport gameTile" ${sports ? `data-game="${esc(sports.name)}" data-provider="${esc(sports.provider || '')}"` : ''} role="button" tabindex="0" aria-label="Open ${sports ? esc(sports.name) : 'Sportsbook'}">
        ${sports?.img ? `<img alt="" src="${sports.img}" class="ooc-sport-img">` : ph()}</div>`, { href: '#games/sports', icon: secIcon('sports') })}
      ${pagedBlock('Bingo', 'bingo', gamesOf('bingo'), 1)}
      ${payoutSection()}
      ${section('Okada Manila', `<div class="ooc-rbanners">${RESORT_BANNERS.map(([r, t, k]) => `<a class="ooc-rbanner" href="#${r}"><img alt="" loading="lazy" decoding="async" src="../ooc/resort/${r}.webp"><span><small>${k}</small><b>${t}</b></span></a>`).join('')}</div>`, { viewAll: '#stay', icon: OM_LOGO })}
    </div></div>`;
}
function searchHome(q) {
  const res = $('#ooc-gs-res'), rest = $('#ooc-home-rest'); if (!res) return;
  q = q.trim().toLowerCase();
  if (!q) { res.hidden = true; res.innerHTML = ''; rest.hidden = false; return; }
  const hits = [...liveSlots(), ...(GAMES || [])].filter(g => g.name.toLowerCase().includes(q) || (g.provider || '').toLowerCase().includes(q));
  rest.hidden = true; res.hidden = false;
  res.innerHTML = section(`${hits.length} result${hits.length === 1 ? '' : 's'}`, hits.length ? gameGrid(hits.slice(0, 30)) : '<div class="ooc-muted-d">No games found.</div>');
}
