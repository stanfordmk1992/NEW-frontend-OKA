

function launchGame(name, provider, mode) {
  const gm = (GAMES || []).find(g => g.name === name && (!provider || g.provider === provider));
  if (gm && (mode !== 'real' || S.login)) S.recent = [gm.id, ...S.recent.filter(i => i !== gm.id)].slice(0, 30);
  if (mode === 'real' && !requireLogin(() => launchGame(name, provider, 'real'))) return;
  lastFocus = document.activeElement;
  const demo = mode === 'demo';
  $('#ooc-layer').innerHTML = `
    <div tabindex="-1" class="ooc-portal"><div class="${UI.backdrop}" data-close></div>
    <section class="ooc-gameframe bg-maroon-gradient" role="dialog" aria-modal="true" aria-label="${esc(name)} ${demo ? 'demo' : ''}">
      <header class="ooc-gf-h">
        <span class="ooc-gf-badge ${demo ? 'is-demo' : 'is-real'}">${demo ? 'DEMO' : 'REAL'}</span>
        <div class="ooc-gf-t"><b>${esc(name)}</b><span>${esc(provider || '')}</span></div>
        ${demo ? btn('btnGold', 'Play for Real', `data-play-real="${esc(name)}" data-provider="${esc(provider || '')}"`) : ''}
        <button class="ooc-x" data-close aria-label="Close game">×</button>
      </header>
      <div class="ooc-gf-b">
        <img alt="" src="${UI.placeholderLogo}" class="ooc-gf-logo">
        <p>Provider game client loads here (iframe).</p>
        <p class="ooc-small">${demo ? 'Demo mode · virtual credits only, no real-money wagers, no Reward Circle points.' : `Real mode · wallet ${money(ME.wallet)} · bets earn Reward Circle points.`}</p>
        <p class="ooc-small">${note(demo ? 'API：GET /games/{id}/launch?mode=demo' : 'API：GET /games/{id}/launch?mode=real')}</p>
      </div>
    </section></div>`;
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => $('.ooc-gameframe [data-close]')?.focus(), 30);
}
