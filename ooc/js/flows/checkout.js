

function updateCheckout() {
  const d = S.draft; if (!d || !$('#ooc-co')) return;
  S.co.pts = +($('#coPts')?.value || 0);
  S.co.method = $('input[name=coM]:checked')?.value || 'wallet';
  S.co.agree = $('#coAgree')?.checked || false;
  S.co.card = $('input[name=coCard]:checked')?.value || S.co.card;
  const pk = $('#coCards'); if (pk) pk.hidden = S.co.method !== 'card';
  const c = calc(d), expired = d.holdExpires && Date.now() > d.holdExpires;
  $('#coP').textContent = c.pts ? '−' + money(c.pts) : '—';
  $('#coT').textContent = money(c.payable);
  $('#coPtsOut').textContent = `${fmt(c.pts)} pts (−${money(c.pts)})`;
  const low = ME.wallet < c.payable;
  if ($('#coWal')) $('#coWal').textContent = low ? `Balance ${money(ME.wallet)} · not enough for this order` : `Balance ${money(ME.wallet)}`;
  $$('.ooc-pm input').forEach(i => i.disabled = !c.payable);
  let err = '';
  if (c.payable && S.co.method === 'wallet' && low) err = 'Your platform account balance is too low. Use more points or pay by card — topping up the difference with a card isn\'t allowed.';
  $('#coErr').textContent = err;
  const b = $('#coPay');
  b.textContent = !c.payable ? 'Confirm with Points' : `Proceed to Payment · ${money(c.payable)}`;
  b.disabled = !!expired || !S.co.agree || !!err;
}
document.addEventListener('input', e => { if (e.target.closest('#ooc-co')) updateCheckout(); });
document.addEventListener('change', e => {
  if (!e.target.closest('#ooc-co')) return;
  if (e.target.id === 'coType' || e.target.id === 'coVoucher') { S.co[e.target.id === 'coType' ? 'ptsType' : 'voucher'] = e.target.value; S.co.pts = 0; S.co.agree = $('#coAgree').checked; S.co.method = $('input[name=coM]:checked')?.value; refresh(); }
  else updateCheckout();
});
