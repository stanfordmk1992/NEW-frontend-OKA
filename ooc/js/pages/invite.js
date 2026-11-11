
const REF_RULE = { reward: 3000, deposit: 10000, turnover: 50000, period: 'April 1 – December 31, 2026' };
const INVITE = {
  code: 'OKJUAN7Q', link: 'https://okadaonline.com/r/OKJUAN7Q',

  invitees: [
    { acct: 'M*****a21', joined: 'Nov 09', stage: 'deposited', dep: 15000, turnover: 32500 },
    { acct: 'R*****o88', joined: 'Nov 06', stage: 'rewarded', dep: 20000, turnover: 50000, paid: 'Nov 08' },
    { acct: 'K*****n05', joined: 'Nov 03', stage: 'registered', dep: 0, turnover: 0 },
    { acct: 'A*****e47', joined: 'Oct 28', stage: 'rewarded', dep: 10000, turnover: 50000, paid: 'Nov 02' },
    { acct: 'J*****s19', joined: 'Oct 21', stage: 'deposited', dep: 10000, turnover: 8400 },
    { acct: 'P*****y63', joined: 'Oct 15', stage: 'rewarded', dep: 50000, turnover: 50000, paid: 'Oct 17' },
  ],
};
const refRewards = () => INVITE.invitees.filter(x => x.stage === 'rewarded').map(x => ({ acct: x.acct, date: x.paid, amt: REF_RULE.reward }));
const REF_STAGE = { registered: ['Registered', 'Awaiting first deposit'], deposited: ['Deposited', 'Wagering in progress'], rewarded: ['Rewarded', 'PHP 3,000 Free Play credited'] };
const ivTabs = [['invites', 'Invite Records'], ['rewards', 'Commission Records']];

const INVITE_ICON = 'M15 8a3 3 0 100-6 3 3 0 000 6zM6 11a3 3 0 100-6 3 3 0 000 6zm12 1c-2.2 0-4 1.3-4.6 3.2A6 6 0 0115 18v3h8v-3c0-3.3-2.2-6-5-6zM6 13c-3 0-6 2.2-6 5v3h12v-3c0-2.8-3-5-6-5z';
const inviteRow = () => isUnverified() ? `<a class="ooc-invrow is-locked" href="#invite">
    <span class="ooc-invrow-ic" aria-hidden="true">${solidI(INVITE_ICON)}</span>
    <span class="ooc-invrow-t"><small>Invite friends</small><b class="ooc-invrow-lock">Complete KYC to get your invite code</b></span>
    <span class="ooc-invrow-go" aria-hidden="true">›</span></a>` : `<a class="ooc-invrow" href="#invite">
    <span class="ooc-invrow-ic" aria-hidden="true">${solidI('M15 8a3 3 0 100-6 3 3 0 000 6zM6 11a3 3 0 100-6 3 3 0 000 6zm12 1c-2.2 0-4 1.3-4.6 3.2A6 6 0 0115 18v3h8v-3c0-3.3-2.2-6-5-6zM6 13c-3 0-6 2.2-6 5v3h12v-3c0-2.8-3-5-6-5z')}</span>
    <span class="ooc-invrow-t"><small>My invite code</small><b>${INVITE.code}</b></span>
    <!-- v1.14：複製邀請碼 / 複製邀請連結 → 圖標按鈕 -->
    <button type="button" class="ooc-invrow-ib" data-copy="${INVITE.code}" aria-label="Copy invite code" title="Copy invite code">${solidI('M8 2h10a2 2 0 012 2v12a2 2 0 01-2 2h-1v-2h1V4H8v1H6V4a2 2 0 012-2zM4 6h10a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm0 2v12h10V8H4z')}</button>
    <button type="button" class="ooc-invrow-ib" data-copy="${INVITE.link}" data-copy-msg="Invite link copied" aria-label="Copy invite link" title="Copy invite link">${svgI('M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1.2-1.2')}</button>
    <span class="ooc-invrow-go" aria-hidden="true">›</span></a>`;

Object.assign(TITLES, { invite: 'Invite Friends' });
Object.assign(PAGES, {
  invite() {
    if (!S.login) return inviteGuest();
    const inv = INVITE.invitees, rw = refRewards(), earned = rw.reduce((s, r) => s + r.amt, 0);
    const pending = inv.filter(x => x.stage !== 'rewarded').length;
    const tab = ivTabs.some(t => t[0] === S.ivtab) ? S.ivtab : 'invites';
    const head = `<div class="ooc-panel bg-maroon-gradient ooc-inv-head">
        <div class="ooc-inv-stats">
          <div><small>FRIENDS INVITED</small><b>${inv.length}</b><span>${pending} in progress</span></div>
          <div><small>COMMISSION EARNED</small><b>${money(earned)}</b><span>${rw.length} × ${money(REF_RULE.reward)} Free Play</span></div>
        </div>
        <div class="ooc-inv-code">
          <div><small>Your invite code</small><b>${INVITE.code}</b></div>
          <!-- v1.16：與個人中心相同 → 複製邀請碼 / 複製邀請連結 圖標按鈕 -->
          <button type="button" class="ooc-invrow-ib ooc-inv-ib" data-copy="${INVITE.code}" aria-label="Copy invite code" title="Copy invite code">${solidI('M8 2h10a2 2 0 012 2v12a2 2 0 01-2 2h-1v-2h1V4H8v1H6V4a2 2 0 012-2zM4 6h10a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm0 2v12h10V8H4z')}</button>
          <button type="button" class="ooc-invrow-ib ooc-inv-ib" data-copy="${INVITE.link}" data-copy-msg="Invite link copied" aria-label="Copy invite link" title="Copy invite link">${svgI('M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1.2-1.2')}</button>
        </div>
      </div>
      <details class="ooc-inv-how"><summary>How it works</summary><ol>
        <li>Share your invite code with friends who have never logged in to Okada Online.</li>
        <li>Your friend enters the code on first login and accepts the terms.</li>
        <li>Your friend makes a first deposit of at least ${money(REF_RULE.deposit)}.</li>
        <li>Your friend wagers a total of ${money(REF_RULE.turnover)} on Live Slots, Live Tables or eGaming (sports bets excluded).</li>
        <li>You receive ${money(REF_RULE.reward)} Free Play for every successful referral. Promotion period: ${REF_RULE.period}.</li>
      </ol><a href="#promo/o4">Full terms ›</a></details>`;
    const body = tab === 'invites'
      ? (inv.length ? `<div class="ooc-list ooc-inv-list">${inv.map(x => {
          const pct = Math.min(100, Math.round(x.turnover / REF_RULE.turnover * 100)), [st, note] = REF_STAGE[x.stage];
          return `<div class="ooc-inv-li">
            <div class="ooc-inv-li-h"><b>${esc(x.acct)}</b><span class="ooc-inv-st st-${x.stage}">${st}</span></div>
            <div class="ooc-inv-li-m"><span>Joined ${x.joined}</span><span>${x.stage === 'deposited' ? `Wagered ${money(x.turnover)} / ${money(REF_RULE.turnover)}` : note}</span></div>
            ${x.stage === 'deposited' ? `<div class="ooc-bar ooc-inv-bar"><i style="width:${pct}%"></i></div>` : ''}
          </div>`; }).join('')}</div>` : '<div class="ooc-muted-d">No invites yet. Share your code to get started.</div>')
      : (rw.length ? `<div class="ooc-list">${rw.map(r => `<div class="ooc-li"><span>Referral reward<em>${esc(r.acct)} · Free Play</em></span><span class="ooc-pos">+${money(r.amt)} · ${r.date}</span></div>`).join('')}</div>`
          : '<div class="ooc-muted-d">No commission yet.</div>');
    return head + tabs(ivTabs, tab, 'ivtab', 'Invite records') + body;
  },
});

document.addEventListener('click', e => {
  const c = e.target.closest('[data-copy]');
  if (c) { e.preventDefault(); e.stopPropagation(); navigator.clipboard?.writeText(c.dataset.copy).catch(() => {}); toast(c.dataset.copyMsg || 'Invite code copied'); return; }
  if (e.target.closest('[data-share-invite]')) {
    e.preventDefault();
    const data = { title: 'Join me on Okada Online', text: `Use my invite code ${INVITE.code} on your first login.`, url: INVITE.link };
    if (navigator.share) navigator.share(data).catch(() => {}); else { navigator.clipboard?.writeText(INVITE.link).catch(() => {}); toast('Invite link copied'); }
  }
}, true);

function inviteKycGate() {
  modal('Verify to Invite Friends', `
    <p class="ooc-small">Invite Friends is available to verified members only. Complete identity verification (KYC) to get your invite code and earn ${money(REF_RULE.reward)} Free Play for every successful referral.</p>`,
    { ok: 'Verify Now', alt: 'Skip for Now', cancel: null,
      onOk: async () => { closeLayer(); go('kyc'); },
      onAlt: async () => { closeLayer(); } });
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#invite"]');
  if (!a || !S.login || !isUnverified()) return;
  e.preventDefault(); e.stopImmediatePropagation();
  inviteKycGate();
}, true);

function inviteGuest() {
  const steps = [
    ['Share your code', 'Verified members get a personal invite code to share with friends who have never logged in to Okada Online.'],
    ['Friend signs up', 'Your friend enters your code on first login and accepts the terms.'],
    ['Friend deposits', `Your friend makes a first deposit of at least ${money(REF_RULE.deposit)}.`],
    ['Friend plays', `Your friend wagers a total of ${money(REF_RULE.turnover)} on Live Slots, Live Tables or eGaming (sports bets excluded).`],
    ['You earn', `${money(REF_RULE.reward)} Free Play is credited to you for every successful referral.`],
  ];
  return `<div class="ooc-panel bg-maroon-gradient ooc-inv-hero">
      <small>REFER AND EARN</small>
      <div class="ooc-inv-hero-big">${money(REF_RULE.reward)} <span>Free Play</span></div>
      <p>for every friend you invite to Okada Online</p>
      <span class="ooc-inv-hero-period">Promotion period: ${REF_RULE.period}</span>
    </div>
    ${section('How It Works', `<ol class="ooc-inv-steps">${steps.map(([t, d], i) => `<li><b class="ooc-inv-step-n">${i + 1}</b><div><b>${t}</b><p>${d}</p></div></li>`).join('')}</ol>`)}
    <div class="ooc-card ooc-hp-rules"><h4>Good to know</h4><ul>
      <li>Invite Friends is available to members aged 21 and above who have completed identity verification (KYC).</li>
      <li>Your friend must be new to Okada Online (no previous login).</li>
      <li>Rewards are usually credited within 5 minutes after your friend meets both requirements (up to 48 hours).</li>
      <li>Terms and conditions apply. <a href="#promo/o4">Full terms ›</a></li></ul></div>
    <div class="ooc-inv-cta">${btn('btnGold', 'Get Started', 'data-action="login"')}<span>Log in or sign up, then complete KYC to get your invite code.</span></div>`;
}
