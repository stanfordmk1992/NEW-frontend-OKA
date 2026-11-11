
const EWALLETS = [['gcash', 'GCash', 'Pay with your GCash account'], ['maya', 'Maya', 'Pay with your Maya account']];
const ewName = m => (EWALLETS.find(e => e[0] === m) || [])[1] || '';
const cardLabel = c => `${c.brand} •••• ${c.last4}`;
const defCard = () => ME.cards.find(c => c.def) || ME.cards[0] || null;

function payVia(o) {
  if (!o) return 'Card';
  if (ewName(o.method)) return ewName(o.method);
  return 'Card ' + (o.cardLabel || (defCard() ? cardLabel(defCard()) : ME.card));
}
const CARD_BRAND = n => /^4/.test(n) ? 'Visa' : /^(5[1-5]|2[2-7])/.test(n) ? 'Mastercard' : /^35/.test(n) ? 'JCB' : /^3[47]/.test(n) ? 'Amex' : 'Card';
const cardRow = (c, pick) => `
  <div class="ooc-cardrow${pick ? '' : ' ooc-cardrow-m'}">
    ${pick ? `<label class="ooc-cardrow-l"><input type="radio" name="coCard" value="${c.id}"${S.co.card === c.id ? ' checked' : ''}>` : '<div class="ooc-cardrow-l">'}
      <span class="ooc-cardbrand ooc-cb-${c.brand.toLowerCase()}">${c.brand === 'Mastercard' ? 'MC' : c.brand}</span>
      <span class="ooc-cardrow-i"><b>•••• ${c.last4}</b><small>Expires ${c.exp}</small></span>${c.def ? '<i class="ooc-carddef">Default</i>' : ''}
    ${pick ? '</label>' : '</div>'}
    ${pick ? '' : `<div class="ooc-cardrow-a">${c.def ? '' : `<button type="button" class="ooc-link" data-card-def="${c.id}">Set as default</button>`}<button type="button" class="ooc-link" data-card-del="${c.id}">Remove</button></div>`}
  </div>`;

function coCardPicker() {
  if (!S.co.card) S.co.card = defCard()?.id || 'new';
  return `<div id="coCards" class="ooc-cardpick" role="radiogroup" aria-label="Choose a card"${S.co.method === 'card' ? '' : ' hidden'}>
    ${ME.cards.map(c => cardRow(c, true)).join('')}
    <div class="ooc-cardrow"><label class="ooc-cardrow-l"><input type="radio" name="coCard" value="new"${S.co.card === 'new' ? ' checked' : ''}><span class="ooc-cardbrand">＋</span><span class="ooc-cardrow-i"><b>Use a new card</b><small>Enter it on the secure payment page</small></span></label></div>
    <button type="button" class="ooc-link ooc-link-l" data-card-add>Add a card</button>
  </div>`;
}

Object.assign(TITLES, { cards: 'Payment Methods' });
Object.assign(PAGES, {
  cards() {
    return `${section('Saved Cards', `<div class="ooc-cardlist">${ME.cards.length ? ME.cards.map(c => cardRow(c, false)).join('') : '<div class="ooc-muted-d">No saved cards.</div>'}</div>
        <button type="button" class="${UI.btnGold} ooc-card-addbtn" data-card-add>Add a Card</button>`)}
      ${section('Other Payment Methods', `<div class="ooc-cardlist">${EWALLETS.map(([k, t]) => `<div class="ooc-cardrow ooc-cardrow-m"><div class="ooc-cardrow-l"><span class="ooc-cardbrand ooc-cb-${k}">${t}</span><span class="ooc-cardrow-i"><b>${t}</b><small>Choose ${t} at checkout. You'll approve each payment in the app.</small></span></div></div>`).join('')}</div>`)}`;
  },
});

function addCardModal(after) {
  modal('Add a Card', `
    <div class="ooc-form ooc-addcard">
      ${field('Card number', 'id="acNo" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="23"')}
      <div class="ooc-form2">${field('Expiry (MM/YY)', 'id="acExp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/YY" maxlength="5"')}${field('CVC', 'id="acCvc" inputmode="numeric" autocomplete="cc-csc" placeholder="123" maxlength="4"')}</div>
      ${field('Name on card', `id="acName" autocomplete="cc-name" value="${esc(ME.full)}"`)}
      <label class="ooc-check"><input type="checkbox" id="acDef"${ME.cards.length ? '' : ' checked disabled'}> <span>Set as default card</span></label>
      <p class="ooc-err" id="acErr" role="alert"></p>

    </div>`, {
    ok: 'Save Card', onOk: async () => {
      const no = $('#acNo').value.replace(/\D/g, ''), exp = $('#acExp').value.trim(), err = $('#acErr');
      const [mm, yy] = exp.split('/').map(Number);
      const now = new Date(), expOk = mm >= 1 && mm <= 12 && yy >= 0 && (2000 + yy > now.getFullYear() || (2000 + yy === now.getFullYear() && mm >= now.getMonth() + 1));
      if (no.length < 13 || no.length > 19) { err.textContent = 'Please enter a valid card number.'; throw 0; }
      if (!expOk) { err.textContent = 'Please enter a valid expiry date.'; throw 0; }
      if (!/^\d{3,4}$/.test($('#acCvc').value.trim())) { err.textContent = 'Please enter the CVC.'; throw 0; }
      if (ME.cards.some(c => c.last4 === no.slice(-4) && c.brand === CARD_BRAND(no))) { err.textContent = 'This card is already saved.'; throw 0; }
      await sleep(700);
      const c = { id: rid('CD'), brand: CARD_BRAND(no), last4: no.slice(-4), exp: `${String(mm).padStart(2, '0')}/${String(yy).padStart(2, '0')}` };
      if ($('#acDef').checked || !ME.cards.length) ME.cards.forEach(x => x.def = false), c.def = true;
      ME.cards.push(c);
      closeLayer(); toast(`${cardLabel(c)} saved`); after?.(c);
    } });

  $('#acNo')?.addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 '); });
  $('#acExp')?.addEventListener('input', e => { const d = e.target.value.replace(/\D/g, '').slice(0, 4); e.target.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; });
}

function saveGwCard(o) {
  if (ME.cards.some(c => c.last4 === '1111' && c.brand === 'Visa')) { o.cardLabel = 'Visa •••• 1111'; return; }
  const c = { id: rid('CD'), brand: 'Visa', last4: '1111', exp: '12/29', def: !ME.cards.length };
  ME.cards.push(c); o.cardId = c.id; o.cardLabel = cardLabel(c);
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-card-add]');
  if (add) { e.preventDefault(); const inCo = !!add.closest('#ooc-co'); addCardModal(c => { if (inCo) { S.co.card = c.id; S.co.method = 'card'; } refresh(); }); return; }
  const def = e.target.closest('[data-card-def]');
  if (def) { ME.cards.forEach(c => c.def = c.id === def.dataset.cardDef); toast('Default card updated'); refresh(); return; }
  const del = e.target.closest('[data-card-del]');
  if (del) {
    const c = ME.cards.find(x => x.id === del.dataset.cardDel); if (!c) return;
    modal('Remove Card', `<p class="ooc-small">Remove ${cardLabel(c)} from your account? Existing bookings and refunds are not affected.</p>`, { ok: 'Remove', onOk: async () => {
      ME.cards = ME.cards.filter(x => x.id !== c.id);
      if (c.def && ME.cards[0]) ME.cards[0].def = true;
      if (S.co.card === c.id) S.co.card = defCard()?.id || 'new';
      closeLayer(); toast('Card removed'); refresh();
    } });
  }
});
