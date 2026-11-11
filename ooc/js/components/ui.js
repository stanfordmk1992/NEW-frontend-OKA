

const btn = (kind, label, attrs = '') => `<button type="button" class="${UI[kind]}" ${attrs}>${label}</button>`;
const tag = t => t ? `<div class="${t === 'hot' ? UI.tagHot : UI.tagNew}">${t === 'hot' ? 'Hot' : 'New'}</div>` : '';
const ph = () => `<div class="${UI.placeholderBg}"><img alt="" class="${UI.placeholderLogoCls}" src="${UI.placeholderLogo}"></div>`;

const tile = ({ title, meta, t, action, dim, label, img }) => `
  <div class="${UI.egWrap} ooc-tile${dim ? ' ooc-dim' : ''}" ${action ? `data-act="${action}" role="button" tabindex="0"` : ''}>
    ${tag(t)}
    <div class="gameTile eGameTile cursor-pointer"><div class="${UI.gameImage}">${img ? `<img class="ooc-tile-img" src="${img}" alt="" loading="lazy">` : ph()}
    </div></div>
    <span class="${UI.egTitle}">${label ? `<i class="ooc-ptag ooc-ptag-${label.toLowerCase().replace(/[^a-z]/g, '')}">${label}</i>` : ''}${esc(title)}</span>
    ${meta ? `<span class="ooc-meta">${meta}</span>` : ''}
  </div>`;

const SEC_AUTO_IC = {
  tag: 'M3 3h8.2a2 2 0 011.4.6l8.8 8.8a2 2 0 010 2.8l-6.2 6.2a2 2 0 01-2.8 0L3.6 12.6A2 2 0 013 11.2V3zm5 3a2 2 0 100 4 2 2 0 000-4z',
  sparkle: 'M10 2l1.8 5.2L17 9l-5.2 1.8L10 16l-1.8-5.2L3 9l5.2-1.8zM18 13l.9 2.1L21 16l-2.1.9L18 19l-.9-2.1L15 16l2.1-.9z',
  info: 'M12 2a10 10 0 110 20 10 10 0 010-20zm-1 8v7h2v-7h-2zm1-4a1.3 1.3 0 100 2.6A1.3 1.3 0 0012 6z',
  steps: 'M3 4h3v3H3zm5 .5h13v2H8zM3 10.5h3v3H3zm5 .5h13v2H8zM3 17h3v3H3zm5 .5h13v2H8z',
  gift: 'M4 9h16v4H4zM5 14h6v7H5zm8 0h6v7h-6zM12 8.5C10.6 5.6 7 4.4 6 6.1S7.8 8.5 12 8.5zm0 0c1.4-2.9 5-4.1 6-2.4S16.2 8.5 12 8.5z',
  crown: 'M2.5 7l4.8 4.2L12 4l4.7 7.2L21.5 7 19.4 19H4.6L2.5 7zM4.6 20.2h14.8V22H4.6z',
  badge: 'M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.9-2.9 3 .2zm-1.2 13.4l5.6-5.6-1.4-1.4-4.2 4.2-2-2-1.4 1.4z',
  coins: 'M12 2c4.4 0 8 1.6 8 3.5S16.4 9 12 9 4 7.4 4 5.5 7.6 2 12 2zM4 8.3C5.6 9.6 8.6 10.5 12 10.5s6.4-.9 8-2.2v3.2c0 1.9-3.6 3.5-8 3.5s-8-1.6-8-3.5V8.3zm0 6c1.6 1.3 4.6 2.2 8 2.2s6.4-.9 8-2.2v3.2c0 1.9-3.6 3.5-8 3.5s-8-1.6-8-3.5v-3.2z',
  search: 'M10.5 3a7.5 7.5 0 015.9 12.1l4.8 4.8-1.4 1.4-4.8-4.8A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z',
  calendar: 'M7 2h2v2h6V2h2v2h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2V2zM5 10v10h14V10H5zm2 2h4v4H7v-4z',
};
function secAuto(title) {
  const t = String(title).replace(/<[^>]+>/g, '').trim(), SO = typeof SOLID !== 'undefined' ? SOLID : {}, I = SEC_AUTO_IC;
  const map = [[/Offers/, I.tag], [/Rooms/, SO.stay], [/Restaurants/, SO.dine], [/Treatments/, SO.wellness], [/Featured/, I.sparkle], [/Shows|Events/, SO.ent], [/Products/, SO.shop],
    [/How Points Work/, I.info], [/How It Works/, I.steps], [/Collections/, I.gift], [/Vouchers/, SO.vouchers], [/Membership Tiers/, I.crown], [/Benefits/, I.badge],
    [/Withdraw To/, SO['payout-accounts']], [/^Amount/, I.coins], [/Saved Cards/, SO.cards], [/Other Payment/, typeof REC_ICON !== 'undefined' ? REC_ICON.wallet : null], [/^Payment/, SO.payments],
    [/Itinerary/, I.calendar], [/results?$/, I.search]];
  const hit = map.find(([re, d]) => d && re.test(t));
  return hit ? `<span class="ooc-sec-ic" aria-hidden="true">${solidI(hit[1])}</span>` : UI.sectionIcon;
}
const section = (title, body, { viewAll, icon = secAuto(title), extra = '', nav = '', href = '' } = {}) => `
  <div class="${UI.section}">
    <div class="${UI.sectionHeader}"><h2>${href ? `<a class="ooc-sec-link" href="${href}">${icon}<span>${title}</span><i aria-hidden="true">›</i></a>` : `${icon}<span>${title}</span>`}${extra}</h2>${UI.headerDivider}${nav}${viewAll ? `<a class="${UI.viewAll}" href="${viewAll}">View All</a>` : ''}</div>
    ${body}
  </div>`;
const grid = items => `<div class="ooc-grid">${items.join('')}</div>`;

const tabs = (list, cur, key, label) => `
  <div class="${UI.tabWrap}"><div role="tablist" aria-label="${label}" class="${UI.tabList}">
    ${list.map(([k, l]) => `<button type="button" role="tab" data-slot="tab" data-${key}="${k}" aria-selected="${cur === k}" data-selected="${cur === k}" tabindex="${cur === k ? 0 : -1}" class="${UI.tabBtn}">${cur === k ? UI.tabCursor : ''}<div class="${UI.tabContent}" data-slot="tabContent">${l}</div></button>`).join('')}
  </div></div>`;
const input = (label, inner) => `
  <label class="ooc-field"><span class="ooc-label">${label}</span>
    <div class="${UI.inputBase}" data-slot="base" data-filled="true"><div data-slot="main-wrapper" class="h-full flex flex-col">
      <div data-slot="input-wrapper" class="${UI.inputWrapper}"><div data-slot="inner-wrapper" class="${UI.inputInner}">${inner}</div></div>
    </div></div></label>`;
const field = (label, attrs) => input(label, `<input data-slot="input" class="${UI.input}" ${attrs}>`);
const select = (label, id, opts, val) => input(label, `<select id="${id}" class="${UI.input} ooc-select">${opts.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${v}"${v == val ? ' selected' : ''}>${l}</option>`; }).join('')}</select>`);
const skeleton = n => grid(Array.from({ length: n }, () => `<div class="${UI.egWrap}"><div class="gameTile eGameTile"><div class="${UI.gameImage} ooc-skel"></div></div><span class="${UI.egTitle} ooc-skel-line">&nbsp;</span></div>`));
const kv = (k, v, cls = '', id = '') => `<div class="ooc-kv ${cls}"><span>${k}</span><b${id ? ` id="${id}"` : ''}>${v}</b></div>`;
const loginPanel = msg => `<div class="ooc-panel bg-maroon-gradient"><div class="ooc-tier"><div><div class="ooc-big ooc-big-s">Members Only</div><div class="ooc-muted">${msg}</div></div>${btn('btnGold', 'Login', 'data-action="login"')}</div></div>`;

