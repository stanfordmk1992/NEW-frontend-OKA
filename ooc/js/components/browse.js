

function browse() {
  lastFocus = document.activeElement;
  $('#ooc-layer').innerHTML = UI.browseDrawer;
  buildBrowse($('#ooc-layer'));
  $$('#ooc-layer [data-slot="wrapper"], #ooc-layer [class*="h-[--visual-viewport-height]"]').forEach(w => w.style.setProperty('--visual-viewport-height', '100dvh'));
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => { const d = $('#ooc-layer [role=dialog]'); if (d) { d.tabIndex = -1; d.focus({ preventScroll: true }); } }, 30);
}
const browseOpen = () => !!$('#ooc-layer .ooc-bitem');
function supportModal() {
  modal('Customer Service', `
    <div class="ooc-cs">
      <button type="button" class="${UI.btnGold}" data-cs="chat">Live Chat</button>
      <a class="${UI.btnPlum}" href="tel:+63288880777">Call +632 8888 0777</a>
      <button type="button" class="${UI.btnPlum}" data-cs="msg">Send a Message</button>
    </div>`, { ok: null, cancel: 'Close' });
}

function buildBrowse(root) {
  const tpl = root.querySelector('a[class*="MobileFooter_links"]'); if (!tpl) return;
  const wrapCls = root.querySelector('[class*="MobileFooter_quickLinkWrapper"]')?.className.replace('ooc-browse-group', '').trim() || '';
  const item = (href, label, iconHtml, attrs = '') => { const a = tpl.cloneNode(true); a.setAttribute('href', href); a.removeAttribute('data-action'); a.className = a.className.replace('ooc-support', '').trim() + ' ooc-bitem';
    const logo = a.querySelector('[class*="MobileFooter_logo"]'); if (logo) { logo.removeAttribute('style'); logo.innerHTML = iconHtml; }
    const lab = a.querySelector('[class*="MobileFooter_label"]'); if (lab) lab.textContent = label;
    attrs.split(' ').filter(Boolean).forEach(kv => { const [k, v] = kv.split('='); a.setAttribute(k, v || ''); }); return a.outerHTML; };

  const group = (title, items) => `<div class="ooc-bgroup" role="group" aria-label="${title}"><div class="${wrapCls} ooc-bgrid">${items.join('')}</div></div>`;
  const R = { stay: 'M3 18v-6a3 3 0 013-3h12a3 3 0 013 3v6M3 18h18M3 18v2M21 18v2M7 9V6h10v3', dine: 'M7 2v9a2 2 0 002 2v9M11 2v7M3 2v7a4 4 0 004 4M17 22V2c2.5 1.5 4 4.5 4 8h-4',
    wellness: 'M12 21c-4.5-2-8-5.5-8-10a8 8 0 018-8 8 8 0 018 8c0 4.5-3.5 8-8 10zM12 21V9', ent: 'M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z',
    shop: 'M6 7h12l1 14H5L6 7zM9 7a3 3 0 016 0', rewards: 'M12 2l2.9 6.2 6.8.8-5 4.6 1.4 6.7L12 17l-6.1 3.3 1.4-6.7-5-4.6 6.8-.8z', prov: 'M4 7h16M4 12h16M4 17h10', recent: 'M8 5v14l11-7z',
    cs: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' };
  const body = root.querySelector('[class*="MobileFooter_quickLinkWrapper"]')?.parentElement; if (!body) return;

  body.insertAdjacentHTML('beforebegin', '<div class="ooc-blogo"><a href="#lobby" aria-label="Okada · Lobby"><img class="ooc-blogo-mark" alt="" src="../ooc/resort/okada-mark.svg"><img class="ooc-blogo-word" alt="Okada" src="../ooc/resort/okada-word.svg"></a></div>');
  body.innerHTML =
    (S.login ? group('My Games', [item('#fav', 'Favourites', solidI(SOLID.fav)), item('#recent', 'Continue Playing', solidI(SOLID.recent))]) : '')

    + `<nav class="ooc-gcats2 ooc-bcats" aria-label="Game categories">
        <div class="ooc-grow ooc-grow2">${GCATS.slice(0, 2).map(catCell).join('')}</div>
        <div class="ooc-grow ooc-grow2">${GCATS.slice(2, 4).map(catCell).join('')}</div>
        <div class="ooc-grow ooc-grow3">${GCATS.slice(4, 7).map(catCell).join('')}</div></nav>`

    + `<a class="ooc-binv" href="#invite"><span class="ooc-binv-ic">${solidI(SOLID.invite)}</span><span class="ooc-binv-t"><b>Invite Friends</b><small>Get ₱3,000 Free Play per friend</small></span><span aria-hidden="true">›</span></a>`
    + `<a class="ooc-binv ooc-brc" href="#rewards"><span class="ooc-binv-ic">${solidI(SOLID.rewards)}</span><span class="ooc-binv-t"><b>Reward Circle</b></span><span aria-hidden="true">›</span></a>`
    + group('Games', [...SUBCATS.map(([c, l]) => item('#games/sub:' + c, l, subIcon(c))),
        item('#providers', 'Providers', solidI(SOLID.providers))])
    + group('Book', [item('#stay', 'Stay', solidI(SOLID.stay)), item('#dine', 'Dine', solidI(SOLID.dine)), item('#wellness', 'Wellness', solidI(SOLID.wellness)), item('#ent', 'Entertainment', solidI(SOLID.ent)),
        item('#shop', 'E-Shop', solidI(SOLID.shop))])
    ;

  const foot = root.querySelector('footer[class*="MobileFooter_footer"]'); (foot || body).insertAdjacentHTML(foot ? 'beforebegin' : 'afterend', sideFoot());

  const dlg = root.querySelector('[role=dialog]');
  dlg?.querySelector('header')?.remove();
  dlg?.querySelectorAll('button[data-close], [aria-label="Close"]').forEach(b => { if (b.offsetParent !== null || b.closest('[role=dialog]') === dlg) b.remove(); });
  dlg?.setAttribute('aria-label', 'Browse');
}
