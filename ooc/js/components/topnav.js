
const COIN_ICON = `<svg class="ooc-coin" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><text x="12" y="16.5" text-anchor="middle" font-size="13" font-weight="800" font-family="Arial, sans-serif" fill="var(--ooc-plum, #4a0d3a)">₱</text></svg>`;
const USER_ICON = 'M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.4 0-9 2.2-9 5v3h18v-3c0-2.8-4.6-5-9-5z';
function renderAuth() {
  const a = $('#ooc-auth');
  if (a) a.innerHTML = S.login
    ? `${kycChip()}${isUnverified() ? '' : `
       <div class="ooc-wallet-g">
         <a role="button" href="#wallet" class="${UI.btnPlum} ooc-wallet" aria-label="Wallet balance ${money(ME.wallet)}. Open wallet">${COIN_ICON}<b class="ooc-wallet-amt">${fmt(ME.wallet)}</b></a>
         <a role="button" href="javascript:void 0" class="${UI.btnGold} ooc-wallet-plus" data-action="deposit" aria-label="Deposit"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" fill="currentColor"/></svg></a>
       </div>`}${taskBtn()}${typeof notifBtn === 'function' ? notifBtn() : ''}<!-- v1.02：順序 Logo / 錢包 / 任務中心 / 通知中心 -->
       <a role="button" href="javascript:void 0" class="${UI.btnPlum} ooc-avatar ooc-landscape-only" data-action="drawer" aria-label="My Account">${solidI(USER_ICON)}</a>`
    : UI.authLoggedOut;
  document.body.classList.toggle('ooc-logged', S.login);
  document.body.classList.toggle('ooc-unverified', isUnverified());
}

const DEPOSIT_AMTS = [500, 1000, 5000, 10000];
const DEPOSIT_METHODS = [['gcash', 'GCash'], ['maya', 'Maya'], ['bank', 'Bank Transfer'], ['otc', '7-Eleven']];
function depositModal() {
  if (!S.login) return goLogin(location.hash);
  const st = { amt: 1000, m: 'gcash' };
  modal('Deposit', `
    <div class="ooc-dep">
      <div class="ooc-dep-g" role="radiogroup" aria-label="Amount">${DEPOSIT_AMTS.map(v => `<button type="button" role="radio" class="ooc-dep-o" data-dep-amt="${v}" aria-checked="${v === st.amt}">${money(v)}</button>`).join('')}</div>
      <div class="ooc-dep-g" role="radiogroup" aria-label="Method">${DEPOSIT_METHODS.map(([k, t]) => `<button type="button" role="radio" class="ooc-dep-o" data-dep-m="${k}" aria-checked="${k === st.m}">${t}</button>`).join('')}</div>
    </div>`, {
    ok: 'Continue', onOk: async () => {
      const rgErr = typeof rgDepositCheck === 'function' ? rgDepositCheck(st.amt) : ''; if (rgErr) { toast(rgErr, true); throw 0; }
      await new Promise(r => setTimeout(r, 600));
      ME.wallet += st.amt;
      ledger?.('DEP-' + Date.now().toString(36), 'GATEWAY', st.amt, { label: `Deposit via ${DEPOSIT_METHODS.find(m => m[0] === st.m)[1]}` });
      closeLayer(); renderAuth(); toast(`${money(st.amt)} added to your wallet`);
    } });
  $('#ooc-layer .ooc-dep').addEventListener('click', e => {
    const b = e.target.closest('.ooc-dep-o'); if (!b) return;
    const key = b.dataset.depAmt ? 'depAmt' : 'depM';
    b.parentElement.querySelectorAll('.ooc-dep-o').forEach(x => x.setAttribute('aria-checked', x === b));
    if (key === 'depAmt') st.amt = +b.dataset.depAmt; else st.m = b.dataset.depM;
  });
}

function taskBtn() {
  const n = typeof taskClaimCount === 'function' ? taskClaimCount() : 0;
  const ic = typeof REC_ICON !== 'undefined' ? solidI(REC_ICON.tasks) : '';
  return `<a role="button" href="#tasks" class="${UI.btnPlum} ooc-taskbtn" data-route="tasks" aria-label="Task Center${n ? ', ' + n + ' ready to claim' : ''}">${ic}${n ? `<i class="ooc-taskbtn-n">${n}</i>` : ''}</a>`;
}
