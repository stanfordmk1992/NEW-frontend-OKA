
Object.assign(PAGES, {

  shop() {

    const list = PRODUCTS.filter(p => p.shop);
    return `${resortTabs('shop')}${offersBlock('shop', 'Shopping Offers')}
      ${section('Products', grid(list.map(prodTile)))}`;
  },

  checkout() {
    const d = S.draft;
    if (!d) return (`<div class="ooc-card ooc-empty"><p>Nothing to check out.</p><div class="ooc-row-btns"><a class="${UI.btnGold}" href="#stay">Book at the Resort</a><a class="${UI.btnPlum}" href="#bookings">My Bookings</a></div></div>`);
    if (!S.login) return loginPanel('Log in to check out with your platform account, card or points.');
    const types = ELIG[d.kind];
    if (!types.includes(S.co.ptsType)) S.co.ptsType = types.find(t => ME[t] > 0) || types[0];
    const vouchers = ME.vouchers.filter(v => !v.used && v.kinds.includes(d.kind));
    if (S.co.voucher && !vouchers.some(v => v.code === S.co.voucher)) S.co.voucher = '';
    const c = calc(d), expired = d.holdExpires && Date.now() > d.holdExpires;
    return (`<div class="ooc-co" id="ooc-co">
      <div class="ooc-card">
        <h3>Order Summary</h3>
        <div class="ooc-li-h"><span class="ooc-bk-ic">${KIND[d.kind][0]}</span><div><b>${esc(d.title)}</b><span class="ooc-muted-d ooc-small">${esc(d.sub)}</span></div></div>
        ${d.items.map(i => kv(`${esc(i.title)}<small>${esc(i.sub)}</small>`, money(i.amount))).join('')}
        ${d.holdExpires ? `<div class="ooc-hold${expired ? ' is-exp' : ''}">${expired ? 'Room hold expired — please search again.' : `Room held for you · ${cd(d.holdExpires)}`} ${note('R25')}</div>` : ''}
        ${kv('Subtotal', money(d.subtotal))}
        ${d.discount ? kv(d.discLabel, '−' + money(d.discount), 'is-neg') : ''}
        ${kv('Voucher', c.vAmt ? '−' + money(c.vAmt) : '—', 'is-neg', 'coV')}
        ${kv('Points', c.pts ? `−${money(c.pts)}` : '—', 'is-neg', 'coP')}
        ${kv('Amount to pay', money(c.payable), 'is-total', 'coT')}
        <p class="ooc-small ooc-muted-d">${esc(d.rule.text)}</p>
      </div>
      <div class="ooc-panel bg-maroon-gradient ooc-co-pay">
        <h3 class="ooc-h3">Voucher</h3>
        ${select('Apply a voucher', 'coVoucher', [['', vouchers.length ? 'No voucher' : 'No vouchers available'], ...vouchers.map(v => [v.code, `${v.title} · ${v.code}`])], S.co.voucher || '')}
        <h3 class="ooc-h3">Use Points</h3>
        ${select('Point type', 'coType', types.map(t => [t, `${PTS[t]} · ${fmt(ME[t])} available`]), S.co.ptsType)}
        <div class="ooc-pts-row"><input type="range" id="coPts" class="ooc-range" min="0" max="${c.maxPts}" step="1" value="${c.pts}" aria-label="Points to use" aria-describedby="coPtsOut">
          <button type="button" class="ooc-link ooc-link-l" data-co-max>Max</button></div>
        <div class="ooc-kv"><span>Points used</span><b id="coPtsOut">${fmt(c.pts)} pts (−${money(c.pts)})</b></div>
        <h3 class="ooc-h3">Payment Method ${note('R22 分流')}</h3>
        <div class="ooc-pm" role="radiogroup" aria-label="Payment method">
          ${isUnverified() ? '' : `<label><input type="radio" name="coM" value="wallet"${S.co.method === 'wallet' ? ' checked' : ''}><span><b>Platform Account</b><small id="coWal">Balance ${money(ME.wallet)}</small></span></label>`}
          <label><input type="radio" name="coM" value="card"${S.co.method === 'card' ? ' checked' : ''}><span><b>Credit / Debit Card</b><small>Visa · Mastercard · JCB</small></span></label>
          ${coCardPicker()}
          ${EWALLETS.map(([k, t, sub]) => `<label><input type="radio" name="coM" value="${k}"${S.co.method === k ? ' checked' : ''}><span><b>${t}</b><small>${sub}</small></span></label>`).join('')}
        </div>
        <p class="ooc-err" id="coErr" role="alert"></p>
        <label class="ooc-check"><input type="checkbox" id="coAgree"${S.co.agree ? ' checked' : ''}> <span>I agree to the booking terms and cancellation policy.</span></label>
        <button type="button" class="${UI.btnGold} ooc-co-btn" id="coPay" data-co-pay${expired ? ' disabled' : ''}>Continue</button>
      </div></div>`);
  },

  result() {
    const o = S.orders.find(x => x.id === S.param);
    if (!o) return section('Payment', `<div class="ooc-card ooc-empty"><p>Order not found.</p><a class="${UI.btnGold}" href="#bookings">My Bookings</a></div>`);
    const ok = o.status === 'CONFIRMED', pend = o.status === 'PENDING_PAYMENT';
    let head, text, actions;
    if (ok) {
      head = { stay: 'Reservation Confirmed', dine: 'Table Reserved', reward: 'Redeemed', event: 'You\'re Registered' }[o.kind] || 'Booking Confirmed';
      text = `Confirmation <b>${o.refs.conf}</b>${o.earned ? ` · +${fmt(o.earned)} Lifestyle Points earned` : ''}`;
      actions = o.kind === 'reward' ? `<a class="${UI.btnGold}" href="#rewards">Back to Reward Circle</a>${/Voucher/.test(o.title) ? `<a class="${UI.btnPlum}" href="#rewards/vouchers">My Vouchers</a>` : ''}` : `<a class="${UI.btnGold}" href="#bookings">View My Bookings</a><a class="${UI.btnPlum}" href="#${{ reward: 'rewards', event: 'ent', shop: 'shop', stay: 'stay', dine: 'dine', wellness: 'wellness' }[o.kind] || 'stay'}">Back</a>`;
    } else if (pend) {
      head = 'Payment Not Completed';
      text = `We're holding your order for ${cd(o.expires)}. Points and vouchers stay reserved until then.`;
      actions = `${btn('btnGold', 'Continue Payment', `data-oact="pay:${o.id}"`)}${btn('btnPlum', 'Cancel Order', `data-oact="abort:${o.id}"`)}`;
    } else if (o.status === 'FAILED') {
      head = 'Payment Failed';
      text = o.method === 'wallet' ? `The withdrawal was reversed — ${money(o.payable)} is back in your platform account.` : 'Your card was not charged.';
      if (o.pts) text += ` ${fmt(o.pts)} ${PTS[o.ptsType]} returned.`;
      actions = `${btn('btnGold', 'Try Again · Platform Account', `data-oact="retry:${o.id}:wallet"${ME.wallet < o.payable ? ' disabled' : ''}`)}${btn('btnPlum', 'Pay by Card', `data-oact="retry:${o.id}:card"`)}`;
    } else if (o.status === 'REFUNDED' && o.fail === 'synxis') {
      head = "We Couldn't Confirm Your Room";
      text = `Your payment of ${money(o.payable)} has been fully refunded to your ${o.method === 'wallet' ? 'platform account' : payVia(o)}${o.pts ? ` and ${fmt(o.pts)} ${PTS[o.ptsType]} returned` : ''}. Our team will contact you shortly.`;
      actions = `<a class="${UI.btnGold}" href="#stay">Search Again</a>${btn('btnPlum', 'Contact Us', 'data-action="support"')}`;
    } else {
      head = STATUS[o.status]; text = 'This order is no longer active.';
      actions = `<a class="${UI.btnGold}" href="#bookings">My Bookings</a>`;
    }
    return `<div class="ooc-panel bg-maroon-gradient ooc-result">
        <div class="ooc-result-ic${ok ? '' : ' is-bad'}" aria-hidden="true">${ok ? '✓' : pend ? '…' : '!'}</div>
        <h1 class="ooc-hero-t">${head}</h1><p class="ooc-hero-s">${text}</p>
        <div class="ooc-row-btns">${actions}</div>
      </div>
      <div class="ooc-card ooc-result-card">
        <h3>Booking Record ${note('API 回傳預定紀錄')}</h3>
        ${kv('Order', o.id)}${o.refs.conf ? kv('Confirmation', o.refs.conf) : ''}${kv('Type', KIND[o.kind][1])}${kv('Booking', esc(o.title))}${kv('Details', esc(o.sub))}
        ${o.items.map(i => kv(`${esc(i.title)}<small>${esc(i.sub)}</small>`, money(i.amount))).join('')}
        ${kv('Payment', esc(payText(o)))}${kv('Policy', esc(o.rule.text))}${kv('Status', STATUS[o.status])}
      </div>`;
  },

  promo() {
    if (S.param) return promoDetail(S.param);
    const list = PROMOS.filter(e => ['online', 'onsite'].includes(e.cat));
    return `<div class="ooc-grid ooc-promo-list">${list.map(promoCard).join('')}</div>`;
  },

  account() {
    const up = S.orders.filter(o => ['CONFIRMED', 'PENDING_PAYMENT'].includes(o.status) && o.date && o.date >= dayPlus(0)).sort((a, b) => a.date.localeCompare(b.date));

    const kyc = !isUnverified();
    const menu = [...(kyc ? [['freeplay', 'Free Play']] : [])  , ['bookings', 'My Bookings'], ...(kyc ? [['spending', 'Spending Records'], ['bets', 'Bet Records']] : [])  ,  , ['cards', 'Payment Accounts'], ['rg', 'Responsible Gaming']  ];
    return `<div class="ooc-panel ooc-wal-light ooc-acct-head"><a class="ooc-acct-pf" href="#profile" aria-label="Profile" title="Profile">${solidI(SOLID.profile)}</a>
        <div class="ooc-tier"><div><div class="ooc-name">${esc(ME.full)}</div><div class="ooc-acct-om">${ME.om ? `${ME.om}<span class="ooc-tier-badge">★ ${esc(ME.tier)}</span>` : 'No OM membership yet · KYC required'}</div></div>${ME.om ? '' : '<a class="' + UI.btnGold + '" href="#kyc">Verify Identity</a>'}</div>
        ${kyc ? `<!-- v1.01：Tier 進度移到會員編號下方（無底色，只留已有點數 / 進度條 / 下一等級）；另兩種點數區塊底色加深 -->
        <div class="ooc-acct-tier"><div class="ooc-acct-tier-t"><span><b>${fmt(ME.tierPts)}</b> Tier Points</span><span>${fmt(ME.tierGoal - ME.tierPts)} to ${ME.next}</span></div>
          <div class="ooc-bar"><i style="width:${ME.tierPts / ME.tierGoal * 100}%"></i></div></div>
        <div class="ooc-bal ooc-bal2 ooc-acct-pts">
          <div><small>CIRCLE POINTS</small><b>${fmt(ME.circle)}</b><span>${fmt(ME.expiring.pts)} expire ${ME.expiring.date}</span></div>
          <div><small>LIFESTYLE POINTS</small><b>${fmt(ME.lifestyle)}</b></div>
        </div>` : ''}
      </div>
      ${inviteRow()} <!-- v0.78 邀請碼展示列 → 邀請頁；v0.80 未 KYC 顯示鎖定版；v0.83 上方為 KYC 後的四個紀錄 / 任務圖標入口 -->
      <nav class="ooc-portrait-only ooc-acct-menu" aria-label="My Account">${menu.map(([r, l]) => `<a href="#${r}"><i class="ooc-am-ic">${solidI(SOLID[r] || SOLID.account)}</i><span class="ooc-am-t">${l}</span><span aria-hidden="true">›</span></a>`).join('')}<button type="button" data-action="logout"><i class="ooc-am-ic">${solidI('M10 3H5a2 2 0 00-2 2v14a2 2 0 002 2h5v-2H5V5h5V3zm6.6 4.4L15.2 8.8 17.4 11H9v2h8.4l-2.2 2.2 1.4 1.4L21.2 12l-4.6-4.6z')}</i><span class="ooc-am-t">Log Out</span><span aria-hidden="true">›</span></button></nav>
      ${section('My Itinerary', up.length ? `<div class="ooc-trips">${up.map(tripCard).join('')}</div>` : '<div class="ooc-muted-d">No upcoming bookings.</div>', { viewAll: '#bookings' })}`;
  },

  bookings() {

    const today = dayPlus(0), key = o => (o.date || '') + ' ' + (o.slot || '');
    const all = S.orders.filter(o => o.kind !== 'reward');
    const list = [...all.filter(o => (o.date || '') >= today).sort((a, b) => key(a).localeCompare(key(b))), ...all.filter(o => (o.date || '') < today).sort((a, b) => key(b).localeCompare(key(a)))];
    return acctBack() + (list.length ? `<div class="ooc-orders">${list.map(orderCard).join('')}</div>` : '<div class="ooc-muted-d">No bookings yet.</div>');
  },
  vouchers() {
    return (`<div class="ooc-orders">${ME.vouchers.length ? ME.vouchers.map(v => `
      <div class="ooc-order"><span class="ooc-bk-ic">${v.used ? 'USED' : 'VC'}</span>
        <div class="ooc-order-i"><b>${esc(v.title)}</b><span>${v.code} · Valid 12 months · Use on: ${v.kinds.map(k => KIND[k][1]).join(', ')}</span><span>${v.used ? 'Used on order ' + v.used : 'Choose it at checkout'}</span></div>
        <span class="ooc-status s-${v.used ? 'cancelled' : 'confirmed'}">${v.used ? 'Used' : 'Available'}</span></div>`).join('') : '<div class="ooc-muted-d">No vouchers.</div>'}</div>`);
  },
  points() {
    const pt = [['all', 'All'], ['circle', 'Circle Points'], ['lifestyle', 'Lifestyle Points']];
    const list = S.ptsLog.filter(h => S.ptcat === 'all' || h.unit === PTS[S.ptcat]);
    return acctBack() + tabs(pt, S.ptcat, 'ptcat', 'Point types') + (`<div class="ooc-list">
      <div class="ooc-li"><span><b>Expiring soon</b></span><span>${fmt(ME.expiring.pts)} ${ME.expiring.type} · ${ME.expiring.date}</span></div>
      ${list.map(h => `<div class="ooc-li"><span>${esc(h.title)}</span><span class="${h.amount > 0 ? 'ooc-pos' : ''}">${h.amount > 0 ? '+' : ''}${fmt(h.amount)} ${h.unit === PTS.lifestyle ? 'LP' : 'CP'} · ${h.t}</span></div>`).join('') || '<div class="ooc-li"><span>No records.</span></div>'}</div>`);
  },
  payments() {
    const rows = S.ledger.filter(l => ['PAYMENT', 'REFUND_WALLET', 'REFUND_CARD'].includes(l.type));
    return (`<div class="ooc-list">${rows.map(l => {
      const o = S.orders.find(x => x.id === l.order), refund = l.type !== 'PAYMENT';
      const via = refund ? (l.type === 'REFUND_WALLET' ? 'Refund → Platform account' : 'Refund → ' + payVia(S.orders.find(x => x.id === l.order))) : (l.ch === 'wallet' ? 'Platform account' : payVia(S.orders.find(x => x.id === l.order)));
      return `<div class="ooc-li"><span>${esc(o ? o.title : l.order)}<em>${l.order} · ${via}</em></span><span class="${refund ? 'ooc-pos' : ''}">${refund ? '+' : '−'}${money(l.amount)} · ${l.status === 'FAILED' ? 'Failed' : l.t}</span></div>`;
    }).join('') || '<div class="ooc-li"><span>No payments yet.</span></div>'}</div>`);
  },
  profile() {
    return (`<div class="ooc-panel bg-maroon-gradient"><div class="ooc-form2">
        ${field('Full name', `value="${esc(ME.full)}" readonly`)}${field('OM number', `value="${ME.om || 'Available after KYC'}" readonly`)}
        ${field('Email', `id="pfMail" type="email" value="${esc(ME.email)}"`)}${field('Mobile', `id="pfTel" value="${esc(ME.phone)}"`)}</div>
        <label class="ooc-check"><input type="checkbox" checked> <span>Booking confirmations and reminders by email</span></label>
        <label class="ooc-check"><input type="checkbox"> <span>Resort offers and events</span></label>
        ${btn('btnGold', 'Save Changes', 'data-action="profile-save"')}</div>`);
  },
});
