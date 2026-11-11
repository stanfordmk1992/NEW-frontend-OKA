
const I3_SHADOW = '<ellipse cx="24" cy="44.5" rx="12" ry="2.2" fill="#000" opacity=".28"/>';
const I3_HL = (cx, cy, rx, ry, rot = -30) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="#fff" opacity=".55"/>`;
const ICON3D = {
  hot: `<defs><linearGradient id="i3-hot-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb547"/><stop offset=".55" stop-color="#ff5a1f"/><stop offset="1" stop-color="#c81e3c"/></linearGradient>
      <linearGradient id="i3-hot-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbd0"/><stop offset="1" stop-color="#ffbf1a"/></linearGradient></defs>
    ${I3_SHADOW}
    <path d="M25.5 2.5c2.2 6.2-2 9.4-2 13.4 0 2.4 1.7 4 3.8 4 2.6 0 4.3-2.2 3.8-5.5C35.6 18 38.5 23.4 38.5 29a14.5 14.5 0 01-29 0c0-8.2 6.2-13.7 9.6-18.4 1.8-2.6 4.6-5 6.4-8.1z" fill="url(#i3-hot-a)"/>
    <path d="M24.6 21.5c1.1 3.6-1.2 5.2-1.2 7.4 0 1.3.9 2.3 2.1 2.3 1.5 0 2.5-1.2 2.2-3.1 2.7 2.1 4 4.8 4 7.6a7.6 7.6 0 01-15.2 0c0-4.1 2.9-6.8 4.8-9.3 1.1-1.4 2.5-2.9 3.3-4.9z" fill="url(#i3-hot-b)"/>
    <path d="M16.5 23.5c-2.1 3-3 6.2-2.4 9.4" stroke="#fff" stroke-opacity=".6" stroke-width="2.2" stroke-linecap="round" fill="none"/>`,
  slots: `<defs><linearGradient id="i3-sl-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5d7a"/><stop offset="1" stop-color="#a50d36"/></linearGradient>
      <linearGradient id="i3-sl-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe7a0"/><stop offset="1" stop-color="#d49a2a"/></linearGradient>
      <linearGradient id="i3-sl-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9e1cc"/></linearGradient>
      <radialGradient id="i3-sl-d" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#ff8a8a"/><stop offset="1" stop-color="#c0102a"/></radialGradient></defs>
    ${I3_SHADOW}
    <rect x="37.2" y="13" width="2.6" height="15" rx="1.3" fill="#9aa3ad"/>
    <circle cx="38.5" cy="11.5" r="3.6" fill="url(#i3-sl-d)"/>${I3_HL(37.3, 10.3, 1.3, .8)}
    <path d="M9 13a6 6 0 016-6h12a6 6 0 016 6v1H9z" fill="url(#i3-sl-b)"/>
    <rect x="6" y="13" width="30" height="27" rx="5" fill="url(#i3-sl-a)"/>
    <rect x="6" y="13" width="30" height="5" rx="2.5" fill="#fff" opacity=".18"/>
    <rect x="9.5" y="18.5" width="23" height="13" rx="2.5" fill="url(#i3-sl-c)" stroke="#7a0a28" stroke-width="1.2"/>
    <path d="M17.2 19v12M24.8 19v12" stroke="#d8cdb2" stroke-width="1"/>
    <g fill="#d11a3d" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="9.5" text-anchor="middle"><text x="13.4" y="28.6">7</text><text x="21" y="28.6">7</text><text x="28.6" y="28.6">7</text></g>
    <rect x="9" y="34" width="24" height="4" rx="2" fill="url(#i3-sl-b)"/>`,
  'live-casino': `<defs><linearGradient id="i3-lc-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#b9821f"/></linearGradient>
      <radialGradient id="i3-lc-b" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#c8902a"/></radialGradient></defs>
    ${I3_SHADOW}
    <circle cx="24" cy="23" r="19" fill="url(#i3-lc-a)"/>
    <circle cx="24" cy="23" r="15.5" fill="#1f1a1d"/>
    <circle cx="24" cy="23" r="12" fill="none" stroke="#d61f3c" stroke-width="7" pathLength="100" stroke-dasharray="6.25 6.25"/>
    <circle cx="24" cy="23" r="8.4" fill="#0f6b3a"/>
    <circle cx="24" cy="23" r="5.2" fill="url(#i3-lc-b)"/>
    <path d="M24 17.8v10.4M18.8 23h10.4" stroke="#a8761c" stroke-width="1.2"/>
    <circle cx="33.5" cy="15.5" r="2.2" fill="#fff"/>
    ${I3_HL(16, 10, 7, 2.6)}`,
  poker: `<defs><linearGradient id="i3-pk-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e7dfcb"/></linearGradient></defs>
    ${I3_SHADOW}
    <g transform="rotate(-14 18 26)"><rect x="6" y="8" width="22" height="31" rx="3.5" fill="url(#i3-pk-a)" stroke="#cdbf9c" stroke-width="1"/>
      <path d="M17 15c-2.8 3.4-6 5.4-6 8.3a3.1 3.1 0 005.4 2.1l-1.2 3.6h3.6l-1.2-3.6a3.1 3.1 0 005.4-2.1c0-2.9-3.2-4.9-6-8.3z" fill="#24202a"/></g>
    <g transform="rotate(12 30 26)"><rect x="19" y="8" width="22" height="31" rx="3.5" fill="url(#i3-pk-a)" stroke="#cdbf9c" stroke-width="1"/>
      <path d="M30 31.5s-7.5-4.6-7.5-9.4a3.9 3.9 0 017.5-1.6 3.9 3.9 0 017.5 1.6c0 4.8-7.5 9.4-7.5 9.4z" fill="#e0213f"/>
      <ellipse cx="27" cy="20.6" rx="1.4" ry=".9" fill="#fff" opacity=".7"/></g>`,
  arcade: `<defs><linearGradient id="i3-ar-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#4c1d95"/></linearGradient>
      <linearGradient id="i3-ar-b" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6b7280"/><stop offset=".5" stop-color="#e5e7eb"/><stop offset="1" stop-color="#6b7280"/></linearGradient>
      <radialGradient id="i3-ar-c" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#ff8f8f"/><stop offset="1" stop-color="#c3102c"/></radialGradient></defs>
    ${I3_SHADOW}
    <path d="M6 33a18 6 0 0136 0v4a18 6 0 01-36 0z" fill="url(#i3-ar-a)"/>
    <ellipse cx="24" cy="33" rx="18" ry="6" fill="#c4b5fd"/>
    <ellipse cx="24" cy="33" rx="5" ry="1.8" fill="#3b0f7a"/>
    <rect x="22.4" y="14" width="3.2" height="19" rx="1.6" fill="url(#i3-ar-b)"/>
    <circle cx="24" cy="12" r="7.5" fill="url(#i3-ar-c)"/>${I3_HL(21.4, 9.3, 2.6, 1.5)}
    <circle cx="13" cy="33.2" r="2" fill="#facc15"/><circle cx="35" cy="33.2" r="2" fill="#22c55e"/>`,
  sports: `<defs><radialGradient id="i3-sp-a" cx=".38" cy=".32" r=".78"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#e3e7ec"/><stop offset="1" stop-color="#a9b2bd"/></radialGradient></defs>
    ${I3_SHADOW}
    <circle cx="24" cy="24" r="18" fill="url(#i3-sp-a)"/>
    <path d="M24 16.5l6.2 4.5-2.4 7.3h-7.6l-2.4-7.3z" fill="#1f2430"/>
    <path d="M24 6a18 18 0 016.7 1.3L28.9 11 24 12.2 19.1 11l-1.8-3.7A18 18 0 0124 6zM41.4 19.4a18 18 0 01.3 9.6l-3.6-1.5-1.6-4.9 1.9-4.6zM35.3 38.1a18 18 0 01-8.3 3.7l.2-4 3.9-3.3 4.4.2zM21 41.8a18 18 0 01-8.4-3.6l.2-3.8 4.4-.3 3.9 3.3zM6.3 29a18 18 0 01.3-9.6l3.4.5 1.6 4.6-1.6 4.9z" fill="#1f2430"/>
    <path d="M24 12.2v4.3M30.2 21l5-1.7M27.8 28.3l3.2 4.6M20.2 28.3L17 32.9M17.8 21l-5-1.7" stroke="#1f2430" stroke-width="1.1"/>
    ${I3_HL(16.5, 13, 5.5, 2.4)}`,
  bingo: `<defs><radialGradient id="i3-bg-a" cx=".36" cy=".3" r=".78"><stop offset="0" stop-color="#7cc4ff"/><stop offset=".65" stop-color="#2563eb"/><stop offset="1" stop-color="#1e3a8a"/></radialGradient></defs>
    ${I3_SHADOW}
    <circle cx="24" cy="24" r="18" fill="url(#i3-bg-a)"/>
    <circle cx="24" cy="24" r="10" fill="#fff"/>
    <circle cx="24" cy="24" r="10" fill="none" stroke="#1e3a8a" stroke-opacity=".15" stroke-width="1.5"/>
    <text x="24" y="28.2" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="11.5" fill="#1e3a8a" text-anchor="middle">75</text>
    ${I3_HL(15.5, 12.5, 5.5, 2.4)}`,

  new: `<defs><linearGradient id="i3-nw-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1a8"/><stop offset=".55" stop-color="#f6c02c"/><stop offset="1" stop-color="#c47f0e"/></linearGradient></defs>
    ${I3_SHADOW}
    <path d="M24 3.5l6 12.4 13.6 1.9-9.9 9.5 2.4 13.5L24 34.3l-12.1 6.5 2.4-13.5-9.9-9.5L18 15.9z" fill="url(#i3-nw-a)" stroke="#b5730c" stroke-width="1" stroke-linejoin="round"/>
    <path d="M24 10l3.8 7.8 2.4.4" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round" fill="none"/>
    ${I3_HL(19, 18, 3.4, 1.6)}`,
};
const icon3d = code => ICON3D[code] ? `<svg class="ooc-i3" viewBox="0 0 48 48" width="36" height="36" aria-hidden="true">${ICON3D[code]}</svg>` : '';
