
const FP = { claimed: [] };
const fpCredits = () => [...FP.claimed, ...refRewards().map(r => ({ t: r.date, title: 'Referral reward', sub: r.acct, amt: r.amt }))];
const freePlay = () => fpCredits().reduce((s, x) => s + x.amt, 0);

const REC_ICON = {
  wallet: 'M3 7a3 3 0 013-3h12a2 2 0 012 2v1h-2V6H6a1 1 0 000 2h14a2 2 0 012 2v8a3 3 0 01-3 3H6a3 3 0 01-3-3V7zm14 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  spending: 'M6 2h12a2 2 0 012 2v17l-3-2-2.5 2-2.5-2-2.5 2L7 19l-3 2V4a2 2 0 012-2zm2 5v2h8V7H8zm0 4v2h8v-2H8zm0 4v2h5v-2H8z',
  bets: 'M7 2h10a3 3 0 013 3v14a3 3 0 01-3 3H7a3 3 0 01-3-3V5a3 3 0 013-3zm1.5 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-3.5 4.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  tasks: 'M9 2h6a1 1 0 011 1v1h3a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h3V3a1 1 0 011-1zm1.5 15.5l6-6-1.4-1.4-4.6 4.6-2.1-2.1-1.4 1.4 3.5 3.5z',
};
const REC_LINKS = [['spending', 'Spending'], ['bets', 'Bet Records']];
const acctQuick = () => isUnverified() ? ''
  : `<nav class="ooc-quick" aria-label="Records">${REC_LINKS.map(([r, l]) => `<a href="#${r}"><span class="ooc-quick-ic">${solidI(REC_ICON[r])}</span><span>${l}</span></a>`).join('')}</nav>`;

const WALLET_SEED = [
  { t: 'Nov 10 21:14', kind: 'deposit', title: 'Deposit', sub: 'GCash · DEP-8K2Q1', amt: 5000, st: 'Completed' },
  { t: 'Nov 09 13:02', kind: 'withdraw', title: 'Withdrawal', sub: 'Maya · WD-3M8LZ', amt: -12000, st: 'Completed' },
  { t: 'Nov 08 19:40', kind: 'deposit', title: 'Deposit', sub: 'Bank Transfer · DEP-7Q1PZ', amt: 20000, st: 'Completed' },
  { t: 'Nov 07 22:05', kind: 'withdraw', title: 'Withdrawal', sub: 'GCash · WD-1X9KD', amt: -3000, st: 'Pending' },
  { t: 'Nov 05 10:31', kind: 'deposit', title: 'Deposit', sub: '7-Eleven · DEP-5T2RM', amt: 1000, st: 'Failed' },
];
const W_TABS = [['all', 'All'], ['deposit', 'Deposits'], ['withdraw', 'Withdrawals'], ['resort', 'Resort'], ['freeplay', 'Free Play']];
function walletRows() {
  const fromLedger = S.ledger.flatMap(l => {

    if (l.type === 'WITHDRAWAL') { const o = S.orders.find(x => x.id === l.order); return [{ t: l.t, kind: 'resort', title: 'Resort payment', sub: (o ? o.title : l.order) + ' · ' + (l.ref || ''), amt: -l.amount, st: 'Completed' }]; }
    if (l.type === 'REFUND_WALLET') { const o = S.orders.find(x => x.id === l.order); return [{ t: l.t, kind: 'resort', title: 'Resort refund', sub: (o ? o.title : l.order) + ' · ' + (l.ref || ''), amt: l.amount, st: 'Completed' }]; }
    return [];
  });
  const fp = fpCredits().map(x => ({ t: x.t, kind: 'freeplay', title: x.title, sub: x.sub + ' · Free Play', amt: x.amt, st: 'Credited', fp: true }));
  return [...fromLedger, ...fp, ...WALLET_SEED];
}

const B_TABS = [['today', 'Today'], ['7d', 'Last 7 days'], ['30d', 'Last 30 days']];
function betRows() {
  const pool = (GAMES || []).filter(g => g.img && !['sportbook', 'bingo'].includes(g.cat));
  if (!pool.length) return [];
  let seed = 7331; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 24 }, (_, i) => {
    const g = pool[Math.floor(r() * pool.length)], bet = [50, 100, 200, 500, 1000, 2000][Math.floor(r() * 6)];
    const mult = r() < .55 ? 0 : [0.5, 1.2, 1.5, 2, 3, 5, 12][Math.floor(r() * 7)], day = i < 6 ? 0 : i < 14 ? 1 + Math.floor(r() * 6) : 7 + Math.floor(r() * 22);
    const d = new Date(Date.now() - day * 864e5 - Math.floor(r() * 8e7));
    return { g, bet, win: Math.round(bet * mult), day, t: d.toLocaleString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }), round: 'R' + Math.floor(r() * 9e8 + 1e8) };
  });
}

const TASKS = [

  { id: 'w1', grp: 'welcome', title: 'Try the games', desc: 'Play 3 games in demo mode', goal: 3, prog: 2, reward: { fp: 100 } },
  { id: 'w2', grp: 'welcome', title: 'Build your favourites', desc: 'Tap the heart on 3 games', goal: 3, prog: 3, reward: { fp: 100 } },
  { id: 'w3', grp: 'welcome', title: 'Come back 3 days', desc: 'Log in to Okada Online on 3 different days', goal: 3, prog: 1, reward: { fp: 300 } },
  { id: 't1', grp: 'daily', title: 'Daily check-in', desc: 'Log in to Okada Online today', goal: 1, prog: 1, reward: { fp: 100 } },
  { id: 't2', grp: 'daily', title: 'Spin the slots', desc: 'Wager ₱5,000 on Live Slots or E-Slots today', goal: 5000, prog: 3200, money: true, reward: { fp: 200 } },
  { id: 't3', grp: 'daily', title: 'Try something new', desc: 'Play 3 different games today', goal: 3, prog: 3, reward: { fp: 150 } },
  { id: 't4', grp: 'weekly', title: 'Weekly high roller', desc: 'Wager ₱50,000 this week', goal: 50000, prog: 21500, money: true, reward: { fp: 1000 } },
  { id: 't5', grp: 'weekly', title: 'Live table regular', desc: 'Play Live Casino on 3 different days this week', goal: 3, prog: 1, reward: { fp: 500 } },
  { id: 't6', grp: 'once', title: 'Invite a friend', desc: 'Earn ₱3,000 Free Play for every successful referral', goal: 1, prog: 0, link: '#invite', reward: { fp: 3000 } },
  { id: 't7', grp: 'once', title: 'Complete your profile', desc: 'Add your email and turn on booking reminders', goal: 1, prog: 1, reward: { fp: 300 } },
  { id: 't8', grp: 'once', title: 'Book your first stay', desc: 'Complete a hotel booking at Okada Manila', goal: 1, prog: 1, reward: { fp: 1000 } },
];
const T_TABS = [['welcome', 'Welcome Bonus'], ['promos', 'My Promotions'], ['daily', 'Daily'], ['weekly', 'Weekly'], ['once', 'Milestones']];
const taskDone = new Set(['t8']);
const taskState = t => taskDone.has(t.id) ? 'done' : t.prog >= t.goal ? 'claim' : 'todo';
const rewardLabel = rw => `${money(rw.fp)} Free Play`;

Object.assign(TITLES, { wallet: 'Wallet',   spending: 'Spending Records', bets: 'Bet Records', tasks: 'Task Center' });
Object.assign(PAGES, {
  wallet() {
    const tab = W_TABS.some(t => t[0] === S.wtab) ? S.wtab : 'all';
    const rows = walletRows().filter(x => tab === 'all' || x.kind === tab);
    const head = `<div class="ooc-panel ooc-wal-light"><div class="ooc-wd-head"><small>WALLET BALANCE</small><b>${money(ME.wallet)}</b></div> <!-- v0.97：只顯示真金錢包，Free Play 不加總、不並列 --><div class="ooc-wal-act">${btn('btnGold', 'Deposit', 'data-action="deposit"')}${btn('btnPlum', 'Withdraw', 'data-action="withdraw"')}</div></div>`;
    return head + tabs(W_TABS, tab, 'wtab', 'Transaction types') + (rows.length ? `<div class="ooc-list ooc-rec">${rows.map(x => `
      <div class="ooc-li${x.id && /deposit|withdraw/.test(x.kind) ? ' ooc-tx-row' : ''}"${x.id && /deposit|withdraw/.test(x.kind) ? ` data-wtx="${x.id}" role="button" tabindex="0"` : ''}><span><b>${esc(x.title)}</b><em>${esc(x.sub)} · ${esc(x.t)}</em></span>
        <span class="ooc-rec-r"><b class="${x.st === 'Failed' ? 'ooc-muted-d' : x.amt > 0 ? 'ooc-pos' : ''}">${x.amt > 0 ? '+' : '−'}${money(Math.abs(x.amt))}${x.fp ? ' FP' : ''}</b><i class="ooc-rec-st st-${x.st.toLowerCase()}">${x.st}</i></span></div>`).join('')}</div>`
      : '<div class="ooc-muted-d">No transactions.</div>');
  },
  spending() { return PAGES.payments(); },
  bets() {
    if (!GAMES) { loadGames().then(() => { if ($('#ooc-main').dataset.page === 'bets') render('bets'); }); return skeleton(4); }
    const tab = B_TABS.some(t => t[0] === S.btab) ? S.btab : '7d', max = { today: 0, '7d': 6, '30d': 30 }[tab];
    const rows = betRows().filter(x => x.day <= max), bet = rows.reduce((s, x) => s + x.bet, 0), win = rows.reduce((s, x) => s + x.win, 0), net = win - bet;
    const head = `<div class="ooc-panel bg-maroon-gradient ooc-rw-head"><div class="ooc-bal">
        <div><small>TOTAL BETS</small><b>${money(bet)}</b><span>${rows.length} rounds</span></div>
        <div><small>TOTAL PAYOUT</small><b>${money(win)}</b></div>
        <div><small>NET WIN / LOSS</small><b class="${net >= 0 ? 'ooc-up' : 'ooc-down'}">${net >= 0 ? '+' : '−'}${money(Math.abs(net))}</b></div>
      </div></div>`;
    return head + tabs(B_TABS, tab, 'btab', 'Period') + (rows.length ? `<div class="ooc-list ooc-bets">${rows.map(x => `
      <div class="ooc-bet"><span class="ooc-bet-th"><img src="${x.g.img}" alt="" loading="lazy"></span>
        <span class="ooc-bet-i"><b>${esc(x.g.name)}</b><em>${esc(x.g.provider || '')} · ${x.t} · ${x.round}</em></span>
        <span class="ooc-bet-v"><small>Bet ${money(x.bet)}</small><b class="${x.win - x.bet >= 0 ? 'ooc-pos' : 'ooc-neg'}">${x.win - x.bet >= 0 ? '+' : '−'}${money(Math.abs(x.win - x.bet))}</b></span></div>`).join('')}</div>`
      : '<div class="ooc-muted-d">No bets in this period.</div>');
  },
  tasks() {
    const tab = T_TABS.some(t => t[0] === S.ttab) ? S.ttab : 'welcome';
    const rank = t => ({ claim: 0, todo: 1, done: 2 })[taskState(t)];
    const list = TASKS.filter(t => t.grp === tab).sort((a, b) => rank(a) - rank(b));
    const ready = taskClaimCount();
    const unlocked = TASKS.filter(t => taskState(t) === 'claim' && t.reward.fp).reduce((s, t) => s + t.reward.fp, 0);
    const head = isUnverified()
      ? `<div class="ooc-panel bg-maroon-gradient ooc-task-head"><div><small>BONUS UNLOCKED</small><b>${money(unlocked)}</b></div>
        <div><small>COLLECTED</small><b>${money(FP.claimed.reduce((t, x) => t + x.amt, 0))}</b></div><a class="${UI.btnGold} ooc-task-kyc" href="#kyc">Verify to Claim</a></div>`
      : `<div class="ooc-panel bg-maroon-gradient ooc-task-head"><div><small>FREE PLAY BALANCE</small><b>${money(freePlay())}</b></div>
      <div><small>COLLECTED</small><b>${money(FP.claimed.reduce((t, x) => t + x.amt, 0))}</b></div></div>`;
    if (tab === 'promos') return head + tabs(T_TABS, tab, 'ttab', 'Task types') + myPromos();
    return head + tabs(T_TABS, tab, 'ttab', 'Task types') + `<div class="ooc-tasks">${list.map(t => {
      const st = taskState(t), pct = Math.min(100, Math.round(t.prog / t.goal * 100));
      const prog = t.goal > 1 ? `<div class="ooc-bar ooc-task-bar"><i style="width:${pct}%"></i></div><span class="ooc-task-p">${st === 'todo' ? 'Unlock progress · ' : st === 'claim' ? 'Unlocked · ' : ''}${t.money ? `${money(t.prog)} / ${money(t.goal)}` : `${t.prog} / ${t.goal}`}</span>` : '';
      const act = st === 'done' ? `<span class="ooc-task-done">Claimed</span>` : st === 'claim' ? btn('btnGold', 'Claim', `data-claim="${t.id}"`) : t.link ? `<a class="${UI.btnPlum}" href="${t.link}">Go</a>` : `<span class="ooc-task-todo">${pct}%</span>`;
      return `<div class="ooc-task${st === 'claim' ? ' is-ready' : ''}${st === 'done' ? ' is-done' : ''}">
        <div class="ooc-task-i"><b>${esc(t.title)}</b><p>${esc(t.desc)}</p>${prog}<span class="ooc-task-rw">${t.reward.fp ? '🎁' : '★'} ${rewardLabel(t.reward)}</span></div>
        <div class="ooc-task-a">${act}</div></div>`; }).join('')}</div>`;
  },
});

document.addEventListener('click', e => {
  const c = e.target.closest('[data-claim]');
  if (c) {
    const t = TASKS.find(x => x.id === c.dataset.claim); if (!t || taskState(t) !== 'claim') return;
    if (isUnverified()) { claimKycGate(t); return; }
    taskDone.add(t.id);

    FP.claimed.unshift({ t: clock(), title: 'Task reward', sub: t.title, amt: t.reward.fp });
    toast(`${rewardLabel(t.reward)} claimed`); refresh(); renderAuth(); return;
  }
});

Object.assign(SOLID, REC_ICON);

function claimKycGate(t) {
  modal('Verify to Claim Your Bonus', `
    <p class="ooc-small">You've unlocked <b>${rewardLabel(t.reward)}</b>. Complete identity verification (KYC) to claim it to your account. Your unlocked bonus is kept until you verify.</p>`,
    { ok: 'Verify Now', alt: 'Skip for Now', cancel: null,
      onOk: async () => { closeLayer(); go('kyc'); },
      onAlt: async () => { closeLayer(); } });
}
