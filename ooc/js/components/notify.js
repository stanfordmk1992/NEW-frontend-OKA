
const NTF_TABS = [['all', 'All'], ['account', 'Account'], ['promo', 'Promotions'], ['booking', 'Bookings']];
const NTF_ICON = {
  account: 'M3 7a3 3 0 013-3h12a2 2 0 012 2v1h-2V6H6a1 1 0 000 2h14a2 2 0 012 2v8a3 3 0 01-3 3H6a3 3 0 01-3-3V7zm14 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  promo: 'M18.5 3.2a1 1 0 011.5.9v15.8a1 1 0 01-1.5.9L12.8 17H11l1 4.2a.8.8 0 01-.8.8H9a1 1 0 01-1-.8L6.9 17H5a3 3 0 01-3-3v-4a3 3 0 013-3h7.8l5.7-3.8zM21.5 9.5a2.5 2.5 0 010 5v-5z',
  booking: 'M7 2h2v2h6V2h2v2h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2V2zM5 10v10h14V10H5zm2 2h4v4H7v-4z',
};
const BELL = 'M12 2a6 6 0 00-6 6v3.6L4.3 15A1 1 0 005.2 16.5h13.6a1 1 0 00.9-1.5L18 11.6V8a6 6 0 00-6-6zm-2.5 16a2.5 2.5 0 005 0h-5z';
const NTF = [
  { id: 'n1', cat: 'account', t: '10 min ago', title: 'Referral reward credited', body: '₱3,000 Free Play from your friend R*****o88 has been added to your account.', link: '#wallet', read: false },
  { id: 'n2', cat: 'booking', t: '1 hr ago', title: 'Check-in tomorrow', body: 'Deluxe Room · Check-in from 15:00 at Okada Manila Hotel. Show your booking at the front desk.', link: '#bookings', read: false },
  { id: 'n3', cat: 'promo', t: '3 hr ago', title: 'Cash Chase is live', body: 'Win a share of the PHP 1,000,000 weekly cash grand prize. Register on-site this week.', link: '#promo/c1', read: false },
  { id: 'n4', cat: 'account', t: 'Yesterday', title: '3,200 Circle Points expire Dec 31', body: 'Redeem them for vouchers, dining or Reward Circle Collections before they expire.', link: '#rewards/redeem', read: false },
  { id: 'n5', cat: 'account', t: 'Yesterday', title: 'Task ready to claim', body: 'You unlocked a Welcome Bonus. Open the Task Center to claim it.', link: '#tasks', read: true },
  { id: 'n6', cat: 'promo', t: 'Nov 08', title: 'Habanero Happy Hour', body: 'Daily happy hour on Habanero slots. Opt in on the Promotions page.', link: '#promo/o2', read: true },
  { id: 'n7', cat: 'booking', t: 'Nov 07', title: 'Payment received', body: 'Your payment for Deluxe Room · Member Rate was successful.', link: '#bookings', read: true },
];
let ntfTab = 'all';
const ntfUnread = () => NTF.filter(n => !n.read).length;

function notify(n) { NTF.unshift({ id: 'n' + Date.now().toString(36), t: 'Just now', read: false, cat: 'account', ...n }); renderAuth(); if (ntfOpen()) ntfRefresh(); }

function notifBtn() {
  const n = ntfUnread();
  return `<a role="button" href="javascript:void 0" class="${UI.btnPlum} ooc-taskbtn ooc-bell" data-action="notif" aria-label="Notifications${n ? ', ' + n + ' unread' : ''}">${solidI(BELL)}${n ? `<i class="ooc-taskbtn-n">${n > 9 ? '9+' : n}</i>` : ''}</a>`;
}
const ntfList = () => {
  const l = NTF.filter(n => ntfTab === 'all' || n.cat === ntfTab);
  return l.length ? `<div class="ooc-lbd-list">${l.map(n => `
    <button type="button" class="ooc-ntf-row${n.read ? '' : ' is-unread'}" data-ntf="${n.id}">
      <span class="ooc-ntf-ic ooc-ntf-${n.cat}">${solidI(NTF_ICON[n.cat])}</span>
      <span class="ooc-ntf-i"><b>${esc(n.title)}</b><span>${esc(n.body)}</span><small>${esc(n.t)}</small></span>
      ${n.read ? '' : '<i class="ooc-ntf-dot" aria-label="Unread"></i>'}</button>`).join('')}</div>`
    : '<div class="ooc-ntf-empty">You\'re all caught up.</div>';
};
const ntfOpen = () => !!$('#ooc-layer .ooc-ntf');
function ntfRefresh() {
  $('#ooc-ntf-tabs').innerHTML = tabs(NTF_TABS, ntfTab, 'ntftab', 'Notification types');
  $('#ooc-ntf-b').innerHTML = ntfList();
  $('#ooc-ntf-sub').innerHTML = `${ntfUnread() ? `${ntfUnread()} unread` : 'No unread notifications'}${ntfUnread() ? '<button type="button" class="ooc-ntf-all" data-ntf-all>Mark all as read</button>' : ''}`;
}
function ntfDrawer() {
  lastFocus = document.activeElement;
  $('#ooc-layer').innerHTML = `
    <div tabindex="-1" class="ooc-portal"><div class="${UI.backdrop}" data-close></div>
    <aside class="ooc-drawer ooc-lbd ooc-ntf" role="dialog" aria-modal="true" aria-label="Notifications">
      <header class="ooc-lbd-h"><div class="ooc-lbd-ht"><h2>Notifications</h2><button type="button" class="ooc-x" data-close aria-label="Close">×</button></div>
        <div class="ooc-lbd-tabs" id="ooc-ntf-tabs"></div><p class="ooc-lbd-sub ooc-ntf-sub" id="ooc-ntf-sub"></p></header>
      <div class="ooc-lbd-b" id="ooc-ntf-b"></div>
    </aside></div>`;
  ntfRefresh();
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => $('.ooc-ntf [role=tab][aria-selected="true"]')?.focus({ preventScroll: true }), 30);
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-action="notif"]')) { e.preventDefault(); e.stopImmediatePropagation(); ntfDrawer(); return; }
  if (!ntfOpen()) return;
  if (!e.target.closest('.ooc-ntf')) { e.preventDefault(); e.stopImmediatePropagation(); closeLayer(); return; }
  const t = e.target.closest('[data-ntftab]');
  if (t) { e.stopImmediatePropagation(); ntfTab = t.dataset.ntftab; ntfRefresh(); $('#ooc-ntf-b').scrollTop = 0; $('.ooc-ntf [role=tab][aria-selected="true"]')?.focus({ preventScroll: true }); return; }
  if (e.target.closest('[data-ntf-all]')) { e.stopImmediatePropagation(); NTF.forEach(n => n.read = true); ntfRefresh(); renderAuth(); return; }
  const r = e.target.closest('[data-ntf]');
  if (r) { e.stopImmediatePropagation(); const n = NTF.find(x => x.id === r.dataset.ntf); if (!n) return; n.read = true; renderAuth(); closeLayer(); if (n.link) location.hash = n.link; }
}, true);
