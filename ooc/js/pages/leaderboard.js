
Object.assign(TITLES, { leaderboard: 'Top Payout' });
Object.assign(PAGES, {
  leaderboard() {
    const rows = [...lobbyTpl().querySelectorAll('.topPayoutMarquee .payoutEntry')].map(e => ({
      player: e.querySelector('.playerName .value')?.textContent.trim() || '—',
      game: e.querySelector('.gameName .value')?.textContent.trim() || '',
      time: e.querySelector('.dateTime .value')?.textContent.trim() || '',
      amount: e.querySelector('.amount .value')?.textContent.trim() || '',
    }));

    const seen = new Set(), list = rows.filter(r => { const k = r.player + r.time + r.amount; if (seen.has(k)) return false; seen.add(k); return true; });
    const amt = s => Number(String(s).replace(/[^\d.]/g, '')) || 0;
    list.sort((a, b) => amt(b.amount) - amt(a.amount));
    return list.length ? `<div class="ooc-list ooc-lb">${list.map((r, i) => `
        <div class="ooc-li"><span><b class="ooc-lb-rank">${i + 1}</b>${esc(r.player)}<em>${esc([r.game, r.time].filter(Boolean).join(' · '))}</em></span><b class="ooc-pts-t">${esc(r.amount)}</b></div>`).join('')}</div>`
      : '<div class="ooc-muted-d">No payouts yet.</div>';
  },
});
