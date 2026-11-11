
const KYC_WINDOW = 72 * 36e5;
const isUnverified = () => S.login && S.kyc && S.kyc !== 'verified';
const isSuspended = () => isUnverified() && S.kycDeadline && Date.now() >= S.kycDeadline;
const hms = ts => { const ms = Math.max(0, ts - Date.now()), h = Math.floor(ms / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; };

const cdMax = ts => { const ms = Math.max(0, ts - Date.now()); return ms >= 36e5 ? Math.floor(ms / 36e5) + 'h' : ms >= 6e4 ? Math.floor(ms / 6e4) + 'm' : Math.floor(ms / 1e3) + 's'; };
const KYC_ICON = 'M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3zm-1.2 13.6l5.4-5.4-1.4-1.4-4 4-1.9-1.9-1.4 1.4 3.3 3.3z';

const kycPct = () => Math.max(0, Math.min(100, (S.kycDeadline - Date.now()) / KYC_WINDOW * 100));
const kycChip = () => isUnverified() && !isSuspended()
  ? `<a role="button" href="#kyc" class="ooc-kyc-chip" aria-label="Verify your identity. Time left ${cdMax(S.kycDeadline)}"><span class="ooc-kyc-chip-t">KYC</span><span class="ooc-kyc-ring"><svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="16.5" pathLength="100" class="ooc-kyc-ring-bg"/><circle cx="18" cy="18" r="16.5" pathLength="100" class="ooc-kyc-ring-fg" data-kyc-ring stroke-dashoffset="${100 - kycPct()}"/></svg><b data-kyc-cd="max">${cdMax(S.kycDeadline)}</b></span></a>` : '';

function kycPrompt(next) {
  if (!isUnverified() || isSuspended()) { if (isSuspended()) showKycLock(); else next?.(); return; }
  modal('Verify Your Identity', `
    <p class="ooc-small">Complete KYC within <b>${hms(S.kycDeadline)}</b> to keep full access.</p>
    <ul class="ooc-guide">
      <li>${solidI(SOLID.rewards)}<span>Get your Reward Circle (OM) membership</span></li>
      <li>${solidI(SOLID.payments)}<span>Withdraw winnings and pay for resort bookings</span></li>
      <li>${solidI(KYC_ICON)}<span>Accounts not verified in 72 hours are suspended</span></li>
    </ul>`,
    { ok: 'Verify Now', alt: 'Skip for Now', cancel: null,
      onOk: async () => { closeLayer(); go('kyc'); },
      onAlt: async () => { closeLayer(); next?.(); } });
}

function showKycBubble() {
  hideKycBubble();
  if (!isUnverified() || isSuspended()) return;
  const chip = [...$$('.ooc-kyc-chip')].find(c => c.offsetParent !== null); if (!chip) return;
  const r = chip.getBoundingClientRect();
  document.body.insertAdjacentHTML('beforeend', `
    <div id="ooc-kyc-bubble" class="ooc-kyc-bubble" role="status" style="top:${r.bottom + 10}px;right:${Math.max(8, innerWidth - r.right)}px">
      <a href="#kyc" class="ooc-kyc-bubble-b"><b>Verify your identity</b><span>Complete KYC within <b data-kyc-cd>${hms(S.kycDeadline)}</b> to get your OM membership and keep full access.</span></a>
      <button type="button" class="ooc-kyc-bubble-x" data-kyc-bubble-close aria-label="Dismiss">×</button>
    </div>`);
}
const hideKycBubble = () => $('#ooc-kyc-bubble')?.remove();

function showKycLock() {
  if (!isSuspended() || $('#ooc-kyclock')) return;
  hideKycBubble();
  document.body.insertAdjacentHTML('beforeend', `
    <div id="ooc-kyclock" class="ooc-kyclock bg-maroon-gradient" role="alertdialog" aria-modal="true" aria-labelledby="kyclockT">
      <div class="ooc-kyclock-in">
        <img alt="Okada Online" src="${UI.modalLogo}" class="ooc-kyclock-logo">
        <div class="ooc-kyclock-ic">${solidI(KYC_ICON)}</div>
        <h2 id="kyclockT">Account Suspended</h2>
        <p>Your 72-hour verification period has ended. Complete KYC to restore access to your account.</p>
        ${btn('btnGold', 'Verify Now', 'data-kyc-go')}
        <button type="button" class="ooc-auth-link" data-action="logout">Log Out</button>
      </div>
    </div>`);
  document.documentElement.style.overflow = 'hidden';
  setTimeout(() => $('#ooc-kyclock [data-kyc-go]')?.focus(), 30);
}
function hideKycLock() { if ($('#ooc-kyclock')) { $('#ooc-kyclock').remove(); document.documentElement.style.overflow = ''; } }

function kycAfterRoute(r) {
  hideKycBubble();
  if (isSuspended() && r !== 'kyc') return showKycLock();
  hideKycLock();
  if (r === 'lobby' && isUnverified()) setTimeout(showKycBubble, 300);
}

const ID_TYPES = ['Passport', "Driver's License", 'UMID', 'PhilSys National ID', 'SSS ID'];
Object.assign(TITLES, { kyc: 'Verify Identity' });
Object.assign(PAGES, {
  kyc() {
    if (S.kyc === 'verified') return `<div class="ooc-panel bg-maroon-gradient ooc-result">
        <div class="ooc-result-ic" aria-hidden="true">✓</div><h1 class="ooc-hero-t">Identity Verified</h1>
        <p class="ooc-hero-s">Your Reward Circle membership is active · <b>${ME.om}</b></p>
        <div class="ooc-row-btns"><a class="${UI.btnGold}" href="#account">My Account</a><a class="${UI.btnPlum}" href="#lobby">Lobby</a></div></div>`;
    const max = iso(new Date(Date.now() - 21 * 365.25 * 864e5));
    return `${isSuspended() ? '<p class="ooc-rg-note">Your account is suspended. Complete verification to restore access.</p>'
        : `<p class="ooc-rg-note">Time left to verify: <b data-kyc-cd>${hms(S.kycDeadline)}</b></p>`}
      <form id="ooc-kyc" class="ooc-panel bg-maroon-gradient ooc-kyc" novalidate>
        <h3 class="ooc-h3">1 · Personal Details</h3>
        <div class="ooc-form2">${field('Full name', `value="${esc(ME.full)}" readonly`)}${field('Date of birth', `type="date" id="kycDob" max="${max}" required`)}</div>
        <div class="ooc-form2">${select('Nationality', 'kycNat', ['Filipino', 'Other'], 'Filipino')}${field('Address', 'id="kycAddr" autocomplete="street-address" required')}</div>
        <h3 class="ooc-h3">2 · ID Document</h3>
        <div class="ooc-form2">${select('ID type', 'kycIdType', ID_TYPES, ID_TYPES[0])}${field('ID number', 'id="kycIdNo" required')}</div>
        ${input('Upload ID (front)', '<input type="file" id="kycIdFile" accept="image/*,.pdf" class="ooc-file">')}
        <h3 class="ooc-h3">3 · Selfie</h3>
        ${input('Selfie holding your ID', '<input type="file" id="kycSelfie" accept="image/*" capture="user" class="ooc-file">')}
        <p class="ooc-err" id="kycErr" role="alert"></p>
        <button type="submit" class="${UI.btnGold} ooc-co-btn" id="kycSubmit">Submit for Verification</button>
      </form>`;
  },
});
document.addEventListener('submit', async e => {
  if (e.target.id !== 'ooc-kyc') return; e.preventDefault();
  const err = $('#kycErr'), dob = $('#kycDob').value;
  const age = dob ? (Date.now() - new Date(dob + 'T00:00')) / (365.25 * 864e5) : 0;
  err.textContent = !dob ? 'Please enter your date of birth.' : age < 21 ? 'You must be 21 or older to play (PAGCOR).' : !$('#kycAddr').value.trim() ? 'Please enter your address.'
    : !$('#kycIdNo').value.trim() ? 'Please enter your ID number.' : !$('#kycIdFile').files.length ? 'Please upload your ID.' : !$('#kycSelfie').files.length ? 'Please upload a selfie.' : '';
  if (err.textContent) return;
  const b = $('#kycSubmit'); b.disabled = true; b.textContent = 'Verifying…';
  await sleep(1200);
  S.kyc = 'verified'; S.kycDeadline = null;
  ME.om = 'OM ' + String(100000000 + Math.floor(Math.random() * 899999999)).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  if (ACCOUNTS[S.account]) Object.assign(ACCOUNTS[S.account], { kyc: 'verified', om: ME.om, kycDeadline: null });
  hideKycLock(); renderAuth(); refresh(); toast('Identity verified · ' + ME.om);
});

setInterval(() => {
  $$('[data-kyc-cd]').forEach(el => { el.textContent = el.dataset.kycCd === 'max' ? cdMax(S.kycDeadline) : hms(S.kycDeadline); });
  $$('[data-kyc-ring]').forEach(el => el.setAttribute('stroke-dashoffset', 100 - kycPct()));
  if (isSuspended() && !$('#ooc-kyclock') && $('#ooc-main').dataset.page !== 'kyc' && !$('#ooc-loginview')) { renderAuth(); showKycLock(); }
}, 1000);
document.addEventListener('click', e => {
  if (e.target.closest('[data-kyc-bubble-close]')) { hideKycBubble(); return; }
  if (e.target.closest('[data-kyc-go]')) { hideKycLock(); go('kyc'); }
  if (e.target.closest('#ooc-kyc-bubble a')) hideKycBubble();
  if (e.target.closest('[data-action="logout"]')) { hideKycLock(); hideKycBubble(); S.kyc = null; S.kycDeadline = null; S.account = null; }
}, true);
addEventListener('resize', () => { if ($('#ooc-kyc-bubble')) showKycBubble(); });
