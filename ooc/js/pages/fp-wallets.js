
const GW = {
  'live-slots': { name: 'Live Slots Wallet', short: 'Live Slots', fp: 0 },
  'live-casino': { name: 'Live Casino Wallet', short: 'Live Casino', fp: 0 },
};
const FP_MOVES = [];
const fpMoved = () => Object.values(GW).reduce((s, w) => s + w.fp, 0) + FP_MOVES.filter(m => m.spent).reduce((s, m) => s + m.spent, 0);
const fpAvail = () => Math.max(0, freePlay() - Object.values(GW).reduce((s, w) => s + w.fp, 0));

const gameWallet = g => !g ? null : (g.live || g.provider === 'Live Slots') ? 'live-slots' : isLiveGame(g) ? 'live-casino' : null;

function gameWalletsSection() {
  return section('Game Wallets', `<div class="ooc-cardlist">${Object.entries(GW).map(([k, w]) => `
    <div class="ooc-cardrow"><div class="ooc-cardrow-l"><span class="ooc-gw-ic ooc-gw-${k}">${icon3d(k === 'live-slots' ? 'slots' : 'live-casino')}</span>
      <span class="ooc-wd-acct-i"><b>${w.name}</b><em>Free Play ${money(w.fp)}</em></span></div>
      <div class="ooc-cardrow-r"><button type="button" class="${UI.btnPlum} ooc-gw-btn" data-fp-transfer="${k}"${fpAvail() ? '' : ' disabled'}>Transfer</button></div></div>`).join('')}</div>`);
}
function fpTransferSheet(k, after) {
  const w = GW[k], max = fpAvail();
  if (!max) { toast('No Free Play available to transfer', true); return; }
  modal(`Transfer to ${w.short}`, `
    <div class="ooc-wd-conf">${kv('Available Free Play', money(max))}${kv(`${w.name} balance`, money(w.fp))}</div>
    <div class="ooc-wd-amt ooc-fp-tx"><label class="ooc-wd-in"><span>₱</span><input id="fpAmt" type="number" inputmode="numeric" min="1" max="${max}" value="${max}" aria-label="Transfer amount"></label>
    <div class="ooc-wd-chips">${[500, 1000, 3000].filter(v => v < max).map(v => `<button type="button" data-fp-q="${v}">${money(v)}</button>`).join('')}<button type="button" data-fp-q="${max}">All</button></div>
    <p class="ooc-wd-hint" id="fpErr"></p></div>`, {
    ok: 'Transfer', onOk: async () => {
      const amt = Math.floor(+$('#fpAmt').value || 0);
      if (!amt || amt > fpAvail()) { $('#fpErr').textContent = amt ? 'Amount exceeds available Free Play' : 'Enter an amount'; $('#fpErr').classList.add('is-err'); throw 0; }
      await new Promise(r => setTimeout(r, 400));
      w.fp += amt; FP_MOVES.unshift({ t: clock(), k, amt });
      WALLET_SEED.unshift({ t: clock(), kind: 'freeplay', title: `Free Play → ${w.short}`, sub: `Transferred to ${w.name}`, amt: -amt, st: 'Completed', fp: true });
      closeLayer(); toast(`${money(amt)} Free Play moved to ${w.short}`); after ? after() : refresh();
    } });
  $('#ooc-layer .ooc-fp-tx').addEventListener('click', e => { const q = e.target.closest('[data-fp-q]'); if (q) $('#fpAmt').value = q.dataset.fpQ; });
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-fp-transfer]'); if (!t) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const relaunch = t.dataset.relaunch;
  fpTransferSheet(t.dataset.fpTransfer, relaunch ? () => launchGame(relaunch, t.dataset.provider || '', 'real') : null);
}, true);

const _fpPage = PAGES.freeplay;
PAGES.freeplay = function () {
  const html = _fpPage();
  const credits = `<div class="ooc-fp-credits"><div><small>LIVE SLOTS CREDIT</small><b>${money(GW['live-slots'].fp)}</b></div><div><small>LIVE CASINO CREDIT</small><b>${money(GW['live-casino'].fp)}</b></div></div>`;
  return html.replace('<small>FREE PLAY BALANCE</small>', '<small>FREE PLAY · AVAILABLE TO TRANSFER</small>').replace(`<b>${money(freePlay())}</b>`, `<b>${money(fpAvail())}</b>`).replace('<div class="ooc-wal-act">', credits + '<div class="ooc-wal-act">')
    .replace(/(<div class="ooc-list ooc-rec">|<div class="ooc-card ooc-wd-empty">)/, gameWalletsSection() + '$1');
};

const _launch = launchGame;
launchGame = function (name, provider, mode) {
  _launch(name, provider, mode);
  if (mode !== 'real' || !S.login || !$('#ooc-layer .ooc-gameframe')) return;
  const g = (GAMES || []).find(x => x.name === name && (!provider || x.provider === provider)) || liveSlots().find(x => x.name === name);
  const k = gameWallet(g), w = k && GW[k];
  const pick = `<div class="ooc-gf-wallet" role="radiogroup" aria-label="Play with">
      <label><input type="radio" name="gfw" value="cash" checked><span><b>Cash</b><small>${money(ME.wallet)}</small></span></label>
      ${w ? (w.fp ? `<label><input type="radio" name="gfw" value="fp"><span><b>Free Play</b><small>${w.short} ${money(w.fp)}</small></span></label>`
        : `<button type="button" class="ooc-gf-tx" data-fp-transfer="${k}" data-relaunch="${esc(name)}" data-provider="${esc(provider || '')}"${fpAvail() ? '' : ' disabled'}><b>Free Play</b><small>${fpAvail() ? `Transfer to ${w.short}` : 'No Free Play'}</small></button>`)
        : `<span class="ooc-gf-na"><b>Free Play</b><small>Live Slots &amp; Live Casino only</small></span>`}
    </div>`;
  $('#ooc-layer .ooc-gf-b').insertAdjacentHTML('afterbegin', pick);
  const info = $('#ooc-layer .ooc-gf-b > p.ooc-small');
  $('#ooc-layer .ooc-gf-wallet').addEventListener('change', e => { if (info) info.textContent = e.target.value === 'fp' ? `Playing with Free Play · ${w.name} ${money(w.fp)} · winnings go to your cash wallet.` : `Real mode · wallet ${money(ME.wallet)} · bets earn Reward Circle points.`; });
};
