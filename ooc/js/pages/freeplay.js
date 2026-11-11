
const FP_DAYS = 30;
const fpDate = t => {
  const m = /^([A-Z][a-z]{2}) (\d{1,2})$/.exec(String(t || '').trim());
  if (!m) return new Date();
  const d = new Date(`${m[1]} ${m[2]}, ${new Date().getFullYear()}`); return isNaN(d) ? new Date() : d;
};
const fpFmt = d => d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
const FP_SRC = { 'Referral reward': 'Invite', 'Task reward': 'Task', 'Promotion reward': 'Promotion' };

Object.assign(TITLES, { freeplay: 'Free Play' });
Object.assign(PAGES, {
  freeplay() {
    const rows = fpCredits().map(x => { const got = fpDate(x.t), exp = new Date(got.getTime() + FP_DAYS * 864e5), left = Math.ceil((exp - Date.now()) / 864e5); return { ...x, got, exp, left }; });
    const soon = rows.filter(x => x.left <= 7 && x.left >= 0).reduce((s, x) => s + x.amt, 0);
    const head = `<div class="ooc-panel ooc-wal-light"><div class="ooc-wd-head"><small>FREE PLAY BALANCE</small><b>${money(freePlay())}</b>
        ${soon ? `<span class="ooc-fp-soon">${money(soon)} expiring within 7 days</span>` : ''}</div>
        <div class="ooc-wal-act">${`<a class="${UI.btnGold}" href="#lobby">Play Now</a>`}<a class="${UI.btnPlum}" href="#tasks">Earn More</a></div></div>`;
    return head + (rows.length ? `<div class="ooc-list ooc-rec">${rows.map(x => `
      <div class="ooc-li"><span><b>${esc(x.title)}</b><em>${esc(FP_SRC[x.title] || 'Bonus')} · ${esc(x.sub)} · ${fpFmt(x.got)}</em></span>
        <span class="ooc-rec-r"><b class="ooc-pos">+${money(x.amt)}</b><i class="ooc-rec-st ${x.left <= 7 ? 'st-pending' : 'st-credited'}">${x.left < 0 ? 'Expired' : `Expires ${fpFmt(x.exp)}`}</i></span></div>`).join('')}</div>`
      : `<div class="ooc-card ooc-wd-empty"><p>No Free Play yet.</p><a class="${UI.btnGold}" href="#tasks">Go to Task Center</a></div>`);
  },
});
Object.assign(SOLID, { freeplay: 'M4 9h16v4H4zM5 14h6v7H5zm8 0h6v7h-6zM12 8.5C10.6 5.6 7 4.4 6 6.1S7.8 8.5 12 8.5zm0 0c1.4-2.9 5-4.1 6-2.4S16.2 8.5 12 8.5z' });
