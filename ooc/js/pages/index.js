
const PAGES = {
  games() { return gamesPage(decodeURIComponent(S.param || "slots")); },
  providers() { return providersPage(); },
  fav() { return myGamesPage("fav"); },
  recent() { return myGamesPage("recent"); },
  lobby() {
    if (isPortrait()) return mobileLobby();
    const tpl = $('#ooc-lobby').content.cloneNode(true);
    const wrap = document.createElement('div'); wrap.append(tpl);
    const secs = wrap.querySelectorAll(`[class*="MainLobbySection_mainLobbySection"]`);
    const slot = document.createElement('div'); slot.id = 'ooc-hl-lobby';
    secs[secs.length - 1]?.after(slot);
    return wrap.innerHTML.replace('<div id="ooc-hl-lobby"></div>', payoutSection() + section('From Okada Manila ' + note('N01'), '<div id="ooc-hl-lobby"></div>', { viewAll: '#stay', icon: OM_LOGO }));
  },

  rewards() {

    const PT_TYPES = [
      ['Level Up with', 'Tier Points', 'Not spendable',
        'Play table games, electronic gaming machines or Okada Online Casino. Based on betting amount and length of play.',
        ['Upgrade your membership status', 'Join gaming promotions and events', 'Enter raffle draws and tournaments'],
        'Never deducted when you spend Circle Points.'],
      ['Play with', 'Circle Points', '1 Circle Point = PHP 1.00',
        'Earned through gaming: every Tier Point also earns Circle Points at your tier’s rate.',
        ['Reward Circle Collections and retail outlets', 'Dining, hotel stays and entertainment', 'Slot credits and promotional gaming chips'],
        'The higher your tier, the higher your earning rate.'],
      ['Redeem with', 'Lifestyle Points', '1 Lifestyle Point = PHP 1.00',
        '1% of the base amount you spend on non-gaming (excluding taxes), paid by cash, credit card or OKash.',
        ['Signature restaurants', 'Hotel stays, spa and entertainment', 'Shopping and non-gaming items'],
        'Earned on the cash / card / OKash part of a partial payment.'],
    ];
    const howPoints = section('How Points Work', `
      <div class="ooc-hp-grid">${PT_TYPES.map(([k, n, rate, earn, use, foot]) => `
        <article class="ooc-card ooc-hp">
          <small>${k}</small><h3>${n}</h3><span class="ooc-hp-rate">${rate}</span>
          <h4>How to earn</h4><p>${earn}</p>
          <h4>Use it to</h4><ul>${use.map(x => `<li>${x}</li>`).join('')}</ul>
          <p class="ooc-hp-foot">${foot}</p>
        </article>`).join('')}</div>
      <div class="ooc-card ooc-hp-conv"><h4>Circle Points earning rate · per 1 Tier Point</h4>
        <ol>${RC_TIERS.map(t => `<li${S.login && ME.om && t.name === ME.tier ? ' class="is-cur"' : ''}><b>×${t.conv.match(/=\s*(\d+)/)?.[1] || ''}</b><span>${t.name}</span></li>`).join('')}</ol></div>
      <div class="ooc-card ooc-hp-rules"><h4>Good to know</h4><ul>
        <li>Your tier is set by the Tier Points you earn within 12 months: Elite 100 · Premium 500 · Supreme 2,500 · Maharlika 15,000. Prime is free sign-up.</li>
        <li>Your tier is reviewed 12 months after your last upgrade or review. If you haven’t earned enough Tier Points to keep it, you move down automatically.</li>
        <li>Tier, Circle and Lifestyle Points are each valid for 12 months, used first-in, first-out.</li>
        <li>Short on points? Combine Circle Points and Lifestyle Points with cash, credit card or OKash.</li>
        <li>Membership is free. Terms and conditions apply.</li></ul></div>`);
    if (!S.login) return rcTiersSection(true) + howPoints;
    if (S.login && !ME.om) return `<div class="ooc-panel bg-maroon-gradient"><div class="ooc-tier"><div><div class="ooc-big ooc-big-s">Join Reward Circle</div><div class="ooc-muted">Complete identity verification (KYC) to get your OM membership, earn points and redeem rewards.</div></div><a class="${UI.btnGold}" href="#kyc">Verify Identity</a></div></div>` + rcTiersSection(true) + howPoints;
    const head = S.login ? `
      <div class="ooc-panel bg-maroon-gradient ooc-rw-head">
        <!-- v1.21：Tier Points 用於等級提升（不可兌換）→ 頂部：目前等級 / 下一級所需點數 / 進度條 / 目前點數 -->
        <div class="ooc-rw-tier">
          <img class="ooc-rw-card" src="resort/img/rc-${ME.tier.toLowerCase()}.webp" alt="${esc(ME.tier)} card">
          <div class="ooc-rw-tier-i"><small>CURRENT TIER</small><b>${esc(ME.tier)}</b>
            <div class="ooc-acct-tier-t"><span><b>${fmt(ME.tierPts)}</b> Tier Points</span><span>${fmt(ME.tierGoal - ME.tierPts)} to ${ME.next}</span></div>
            <div class="ooc-bar"><i style="width:${ME.tierPts / ME.tierGoal * 100}%"></i></div></div>
          <img class="ooc-rw-ptic" src="resort/img/rcpts-01.webp" alt="" aria-hidden="true">
        </div>
        <div class="ooc-bal ooc-bal2 ooc-rw-redeem">
          <div><small>CIRCLE POINTS</small><b>${fmt(ME.circle)}</b><span>${fmt(ME.expiring.pts)} expire ${ME.expiring.date}</span><img class="ooc-rw-ptic" src="resort/img/rcpts-02.webp" alt="" aria-hidden="true"></div>
          <div><small>LIFESTYLE POINTS</small><b>${fmt(ME.lifestyle)}</b><img class="ooc-rw-ptic" src="resort/img/rcpts-03.webp" alt="" aria-hidden="true"></div>
        </div>
      </div>` : `<div class="ooc-panel bg-maroon-gradient"><div class="ooc-tier"><div><div class="ooc-big ooc-big-s">Reward Circle</div><div class="ooc-muted">Log in to see your Tier, Circle and Lifestyle Points and redeem online.</div></div>${btn('btnGold', 'Login', 'data-action="login"')}</div></div>`;
    const redeemTile = (r, kind) => {
      let label = 'Redeem', dis = false, why = '';
      const types = kind === 'voucher' ? r.types : ELIG.reward;
      if (r.stock === 0) { label = 'Sold Out'; dis = true; }
      else if (S.login && !types.some(t => ME[t] >= r.pts)) { label = 'Not Enough Points'; dis = true; why = `Need ${fmt(r.pts - Math.max(...types.map(t => ME[t])))} more`; }

      return tile({ kicker: kind === 'voucher' ? 'VOUCHER' : 'COLLECTIONS', title: r.title, t: r.tag, dim: dis, img: r.img, action: 'rdm:' + r.id + (dis ? ':' + label : ''),
        meta: `<b class="ooc-pts-t">${fmt(r.pts)} pts</b>${r.stock !== undefined ? ` · ${r.stock > 0 ? r.stock + ' left' : 'Sold out'}` : ''}${why ? `<br><em class="ooc-warn">${why}</em>` : ''}` });
    };

    const RW_TABS = [['overview', 'Overview'], ['redeem', 'Redeem'], ['vouchers', 'My Vouchers'], ['history', 'Points History']];
    if (S.param && RW_TABS.some(t => t[0] === S.param)) { S.rwtab = S.param; S.param = null; history.replaceState(null, '', '#rewards'); }
    const tab = RW_TABS.some(t => t[0] === S.rwtab) ? S.rwtab : 'overview';
    const exp = `<div class="ooc-rw-exp"><b>${fmt(ME.expiring.pts)} ${esc(ME.expiring.type)}</b> expire on ${esc(ME.expiring.date)}<a href="#rewards/redeem" data-rwtab="redeem">Redeem now ›</a></div>`;
    const body = {
      overview: () => rcTiersSection() + howPoints,
      redeem: () => section('Reward Circle Collections', grid(COLLECTIONS.map(r => redeemTile(r, 'item'))))
        + section('Points to Vouchers', grid(VOUCHERS.map(r => redeemTile(r, 'voucher')))),
      vouchers: () => { const v = PAGES.vouchers(); return /No vouchers/.test(v) ? `<div class="ooc-muted-d">No vouchers yet. <a href="#rewards/redeem" data-rwtab="redeem">Exchange points for vouchers ›</a></div>` : v; },
      history: () => `<div class="ooc-list ooc-rw-hist">${S.ptsLog.map(h => `<div class="ooc-li ooc-ph"><div class="ooc-ph-1"><span>${esc(h.t)}</span><b class="${h.amount > 0 ? 'ooc-pos' : 'ooc-neg'}">${h.amount > 0 ? '+' : ''}${fmt(h.amount)} ${h.unit === PTS.lifestyle ? 'LP' : 'CP'}</b></div><div class="ooc-ph-2">${esc(h.title)}</div></div>`).join('') || '<div class="ooc-li"><span>No records.</span></div>'}</div>`,
    }[tab]();
    return head + tabs(RW_TABS, tab,   'rwtab', 'Reward Circle') + body;
  },

  stay() {
    const q = S.stayQ, n = nightsOf(q.ci, q.co), today = dayPlus(0);

    return `${resortTabs('stay')}
      <div class="ooc-panel bg-maroon-gradient">
        <form id="ooc-stay" class="ooc-form ooc-form6" novalidate>
          ${field('Check-in', `type="date" id="ci" value="${q.ci}" min="${today}"`)}
          ${field('Check-out', `type="date" id="co" value="${q.co}" min="${today}"`)}
          ${select('Rooms', 'rm', [1, 2, 3], q.rooms)}${select('Adults', 'ad', [1, 2, 3, 4], q.ad)}${select('Children', 'ch', [0, 1, 2, 3], q.ch)}
          <button type="submit" class="${UI.btnGold} ooc-form-btn">Search</button>
        </form><p class="ooc-err" id="stayErr" role="alert"></p>
      </div>
      ${offersBlock('stay', 'Stay Offers')}
      ${section('Rooms & Suites', `<div id="ooc-rooms" class="ooc-rooms">${ROOMS.map(r => roomRow(r, q, n)).join('')}</div>`)}`;
  },

  dine() {
    return `${resortTabs('dine')}${offersBlock('dine', 'Dining Offers')}
      ${section('Restaurants', grid(RESTS.map(r =>

      tile({ kicker: r.cuisine.toUpperCase(), title: r.title, t: r.tag, img: RIMG.rest(r.id), action: 'rsv:' + r.id, meta: `${r.meta}${r.deposit ? `<br><em class="ooc-warn">Deposit ${money(r.deposit)}</em>` : ''}` }))))}`;
  },

  wellness() {

    return `${resortTabs('wellness')}${offersBlock('wellness', 'Wellness Offers')}
      ${section('Treatments', grid(PRODUCTS.filter(p => p.mod === 'wellness').map(prodTile)))}`;
  },

  ent() {
    const l = PROMOS.filter(e => e.cat === 'entertainment');
    return `${resortTabs('ent')}
      ${section('Featured This Month', '<div class="ooc-offers">' + grid(l.filter(e => e.tag).map(offerCard)) + '</div>')}
      ${section('All Shows & Events', grid(l.map(offerCard)))}`;
  },
};
