

const PROMO_RULE = {
  o1: { bonus: 1000, goal: 20000, prog: 12400, ends: 'Nov 30' },
  o2: { bonus: 200, goal: 2000, prog: 2000, ends: 'Nov 15' },
  o3: { bonus: 500, goal: 30000, prog: 0, ends: 'Nov 24' },
  o4: { link: '#invite', ends: 'Dec 31' },
};
S.joined.add('o1'); S.joined.add('o2');
const promoClaimed = new Set();
const promoState = id => { const r = PROMO_RULE[id] || {}; return promoClaimed.has(id) ? 'done' : r.goal && r.prog >= r.goal ? 'claim' : 'todo'; };
const promoClaimable = () => [...S.joined].filter(id => PROMOS.find(e => e.id === id)?.cat === 'online' && promoState(id) === 'claim');
const taskClaimCount = () => TASKS.filter(t => taskState(t) === 'claim').length + promoClaimable().length;

function myPromos() {
  const online = [...S.joined].map(id => PROMOS.find(e => e.id === id)).filter(e => e && e.cat === 'online')
    .sort((a, b) => ({ claim: 0, todo: 1, done: 2 })[promoState(a.id)] - ({ claim: 0, todo: 1, done: 2 })[promoState(b.id)]);
  const onsite = S.orders.filter(o => o.kind === 'event' && o.meta?.ev && PROMOS.find(e => e.id === o.meta.ev)?.cat === 'onsite' && o.status === 'CONFIRMED');
  if (!online.length && !onsite.length) return `<div class="ooc-card ooc-wd-empty"><p>You haven't joined any promotions yet.</p><a class="${UI.btnGold}" href="#promo">Browse Promotions</a></div>`;
  const onl = online.map(e => {
    const r = PROMO_RULE[e.id] || {}, st = promoState(e.id), pct = r.goal ? Math.min(100, Math.round(r.prog / r.goal * 100)) : 0;
    const badge = st === 'done' ? '<i class="ooc-pm-st st-done">Claimed</i>' : st === 'claim' ? '<i class="ooc-pm-st st-claim">Completed</i>' : '<i class="ooc-pm-st st-on">In progress</i>';
    const act = st === 'done' ? '<span class="ooc-task-done">Claimed</span>' : st === 'claim' ? btn('btnGold', 'Claim', `data-pclaim="${e.id}"`) : `<a class="${UI.btnPlum}" href="${r.link || '#promo/' + e.id}">${r.link ? 'Go' : 'Play'}</a>`;
    return `<div class="ooc-task ooc-pm${st === 'claim' ? ' is-ready' : ''}${st === 'done' ? ' is-done' : ''}">
      <img class="ooc-pm-img" src="${RIMG.promo(e.id)}" alt="" loading="lazy">
      <div class="ooc-task-i"><div class="ooc-pm-h"><b>${esc(e.title)}</b>${badge}</div>
        ${r.goal ? `<div class="ooc-bar ooc-task-bar"><i style="width:${pct}%"></i></div><span class="ooc-task-p">Wagered ${money(r.prog)} / ${money(r.goal)}</span>` : `<p>${esc(e.meta)}</p>`}
        <span class="ooc-task-rw">${r.bonus ? `🎁 ${money(r.bonus)} Free Play · ` : ''}Ends ${r.ends}</span></div>
      <div class="ooc-task-a">${act}</div></div>`;
  }).join('');
  const ons = onsite.map(o => { const e = PROMOS.find(x => x.id === o.meta.ev); return `<a class="ooc-task ooc-pm" href="#bookings">
      <img class="ooc-pm-img" src="${RIMG.promo(e.id)}" alt="" loading="lazy">
      <div class="ooc-task-i"><div class="ooc-pm-h"><b>${esc(e.title)}</b><i class="ooc-pm-st st-reg">Registered</i></div><p>${esc(e.meta)}</p><span class="ooc-task-rw">📅 ${pretty(o.date)} · ${o.slot}</span></div>
      <div class="ooc-task-a"><span class="ooc-task-todo">›</span></div></a>`; }).join('');
  return `<div class="ooc-tasks">${onl ? `<h3 class="ooc-mdr-h">Online</h3>${onl}` : ''}${ons ? `<h3 class="ooc-mdr-h">On-site</h3>${ons}` : ''}</div>`;
}

document.addEventListener('click', e => {
  const c = e.target.closest('[data-pclaim]'); if (!c) return;
  const id = c.dataset.pclaim, r = PROMO_RULE[id], p = PROMOS.find(x => x.id === id); if (!r || promoState(id) !== 'claim') return;
  if (isUnverified()) { claimKycGate({ reward: { fp: r.bonus } }); return; }
  promoClaimed.add(id); FP.claimed.unshift({ t: clock(), title: 'Promotion reward', sub: p.title, amt: r.bonus });
  if (typeof notify === 'function') notify({ cat: 'promo', title: 'Promotion reward credited', body: `${money(r.bonus)} Free Play from ${p.title}.`, link: '#wallet' });
  toast(`${money(r.bonus)} Free Play claimed`); refresh(); renderAuth();
});
