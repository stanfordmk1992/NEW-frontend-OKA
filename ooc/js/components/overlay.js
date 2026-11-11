

let lastFocus = null;
function modal(title, body, { ok = 'Confirm', cancel = 'Cancel', onOk, okDisabled = false, rg = false, alt, onAlt } = {}) {
  lastFocus = document.activeElement;
  $('#ooc-layer').innerHTML = `
    <div tabindex="-1" class="ooc-portal">
      <div class="${UI.backdrop}" data-close></div>
      <div class="${UI.modalWrap}" style="--visual-viewport-height:100dvh" data-close>
        <section role="dialog" aria-modal="true" aria-labelledby="ooc-mt" class="${UI.modal}">
          <header class="${UI.modalHeader}"><img alt="Okada" class="${UI.modalLogoCls}" src="${UI.modalLogo}"><h2 id="ooc-mt" class="${UI.modalTitle}">${title}</h2></header>
          <div class="${UI.modalBody}">${body}</div>
          <footer class="${UI.modalFooter}">${rg ? UI.rgCard : ''}
            <div class="${UI.modalActions}">
              ${cancel ? `<button type="button" class="${UI.modalBtnExit}" data-close>${cancel}</button>` : ''}
              ${alt ? `<button type="button" class="${UI.modalBtnExit}" id="ooc-alt"${okDisabled ? ' disabled' : ''}>${alt}</button>` : ''}
              ${ok ? `<button type="button" class="${UI.modalBtnAccept}" id="ooc-ok"${okDisabled ? ' disabled' : ''}>${ok}</button>` : ''}
            </div></footer>
        </section></div></div>`;
  document.documentElement.style.overflow = 'hidden';
  const wire = (el, fn) => { if (el && fn) el.onclick = async () => {
    el.disabled = true; const t = el.textContent; el.textContent = 'Processing…';
    try { await fn(); } catch (e) { el.disabled = false; el.textContent = t; }
  }; };
  wire($('#ooc-ok'), onOk); wire($('#ooc-alt'), onAlt);
  setTimeout(() => ($('#ooc-layer [role=dialog] input, #ooc-layer [role=dialog] select, #ooc-ok, #ooc-layer [data-close]') || {}).focus?.(), 30);
}
const setOk = on => ['#ooc-ok', '#ooc-alt'].forEach(s => { const b = $(s); if (b) b.disabled = !on; });

function closeLayer() {
  const layer = $('#ooc-layer'), cur = layer.firstElementChild;
  if (cur && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ghost = document.createElement('div'); ghost.className = 'ooc-leaving'; ghost.setAttribute('aria-hidden', 'true'); ghost.inert = true;
    ghost.append(cur); document.body.append(ghost); setTimeout(() => ghost.remove(), 220);
  }
  layer.innerHTML = ''; document.documentElement.style.overflow = ''; lastFocus?.focus?.({ preventScroll: true });
}
function toast(msg, err) { const t = $('#ooc-toast'); t.textContent = msg; t.className = 'on' + (err ? ' err' : ''); clearTimeout(t._t); t._t = setTimeout(() => t.className = '', 2600); }

function drawer() {
  lastFocus = document.activeElement;
  const recent = S.orders.slice(0, 3);
  $('#ooc-layer').innerHTML = `
    <div tabindex="-1" class="ooc-portal"><div class="${UI.backdrop}" data-close></div>
    <aside class="ooc-drawer ooc-lbd ooc-mdr" role="dialog" aria-modal="true" aria-label="My Account">
      <!-- v0.98：右側抽屜統一排行榜色彩計畫（深紫標題區 + 淺色內容區、白卡） -->
      <header class="ooc-lbd-h"><div class="ooc-lbd-ht"><h2>My Account</h2><button type="button" class="ooc-x" data-close aria-label="Close">×</button></div>
        <div class="ooc-mdr-who"><b>${esc(ME.full || ME.name)}</b><span>${ME.om ? ME.om + ' · ' + ME.tier : 'No OM membership yet · <a href="#kyc">Verify identity</a>'}</span></div></header>
      <div class="ooc-lbd-b ooc-mdr-b">
        ${isUnverified() ? '' : `<div class="ooc-mdr-stats">
          <a href="#wallet"><small>Wallet</small><b>${money(ME.wallet)}</b></a>
          <a href="#rewards"><small>Circle Points</small><b>${fmt(ME.circle)}</b></a>
          <a href="#rewards"><small>Lifestyle</small><b>${fmt(ME.lifestyle)}</b></a>
        </div>
        <div class="ooc-mdr-card"><div class="ooc-tier-row ooc-small"><span>Tier Points ${fmt(ME.tierPts)}</span><span>${fmt(ME.tierGoal - ME.tierPts)} to ${ME.next}</span></div><div class="ooc-bar"><i style="width:${ME.tierPts / ME.tierGoal * 100}%"></i></div>
          <p>${fmt(ME.expiring.pts)} ${ME.expiring.type} expire on ${ME.expiring.date}</p></div>
        <div class="ooc-row2"><button type="button" class="${UI.btnGold}" data-action="deposit">Deposit</button><button type="button" class="${UI.btnPlum}" data-action="withdraw">Withdraw</button></div>`}
        <h3 class="ooc-mdr-h">Recent Bookings</h3>
        ${recent.length ? `<div class="ooc-lbd-list">${recent.map(o => `<a class="ooc-bk" href="#bookings"><span class="ooc-bk-ic">${KIND[o.kind][0]}</span><div class="ooc-bk-i"><b>${esc(o.title)}</b><span>${esc(o.sub)}</span></div><span class="ooc-status s-${o.status.toLowerCase()}">${STATUS[o.status]}</span></a>`).join('')}</div>`
      : `<div class="ooc-ntf-empty">No bookings yet.</div>`}
        <a class="${UI.btnGold}" href="#account">My Account</a>
        <div class="ooc-row2"><a class="${UI.btnPlum}" href="#bookings">My Bookings</a>${isUnverified() ? '' : `<a class="${UI.btnPlum}" href="#rewards/vouchers">My Vouchers</a>`}</div>
        <button type="button" class="ooc-mdr-out" data-action="logout">Log Out</button>
      </div></aside></div>`;
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => $('.ooc-drawer [data-close]')?.focus(), 30);
}
