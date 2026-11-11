
const DEMO_OTP = '123456';

const ACCOUNTS = {
  '9175550142': { first: 'Juan', last: 'Dela Cruz', email: 'juan.dc@example.com', kyc: 'verified', om: ME.om },
  '9170000000': { first: 'Maria', last: 'Santos', email: 'maria.s@example.com', kyc: 'none', kycDeadline: Date.now() + 50 * 36e5 },
  '9171111111': { first: 'Paolo', last: 'Reyes', email: 'paolo.r@example.com', kyc: 'none', kycDeadline: Date.now() - 36e5 },
};
const AUTH = { step: 'phone', phone: '', resendAt: 0 };

const DEMO_ME = JSON.parse(JSON.stringify(ME)), DEMO_ORDERS = JSON.parse(JSON.stringify(S.orders)), DEMO_PTSLOG = JSON.parse(JSON.stringify(S.ptsLog));

function goLogin(returnHash = location.hash || '#lobby') {
  if (!/^#login/.test(returnHash)) S.returnHash = returnHash;
  go('login');
}

function loginModal() { goLogin(); }
function accountGuide(next = 'account') { goLogin('#' + next); }
function requireLogin(next) { if (S.login) return true; S.after = next; goLogin(); return false; }

const SUBMIT_OFF = ['pointer-events-none', 'opacity-50', 'cursor-not-allowed'];
const maskPhone = p => `+63 ${p.slice(0, 3)} ${p.slice(3, 6)} ${p.slice(6)}`;
function setInput(inp, { id, placeholder, type = 'text', inputmode, maxlength, autocomplete, value = '' }) {
  inp.id = id; inp.type = type; inp.value = value; inp.placeholder = placeholder; inp.setAttribute('aria-label', placeholder);
  ['inputmode', 'maxlength', 'autocomplete', 'data-type'].forEach(k => inp.removeAttribute(k));
  if (inputmode) inp.setAttribute('inputmode', inputmode);
  if (maxlength) inp.setAttribute('maxlength', maxlength);
  if (autocomplete) inp.setAttribute('autocomplete', autocomplete);
}
function setSubmit(label) {
  const b = $('#ooc-login-form .checkboxSubmitContainer > button'); if (!b) return;
  b.id = 'ooc-login-submit'; b.type = 'submit'; b.textContent = label;
}
function syncSubmit() {
  const b = $('#ooc-login-submit'); if (!b) return;
  const v = id => ($('#' + id)?.value || '').trim();
  const ok = AUTH.step === 'phone' ? /^0?9\d{9}$/.test(v('authPhone').replace(/\s/g, '')) && $('#isRead')?.checked
    : AUTH.step === 'otp' ? /^\d{6}$/.test(v('authOtp'))
    : v('regFirst') && v('regLast') && /^\S+@\S+\.\S+$/.test(v('regEmail'));
  b.disabled = !ok; b.toggleAttribute('data-disabled', !ok); if (!ok) b.setAttribute('data-disabled', 'true');
  SUBMIT_OFF.forEach(c => b.classList.toggle(c, !ok));
}
function cardText(html) {
  const p = $('#ooc-auth-note'); if (p) { p.innerHTML = html; p.hidden = !html; }
}
function renderAuthStep() {
  const form = $('#ooc-login-form'); if (!form || !AUTH.orig) return;
  form.innerHTML = AUTH.orig;
  const [b1, b2, b3] = form.children;
  const omLabel = b1.querySelector('.om_label'), omInput = b1.querySelector('input');
  const pinWrap = b2?.querySelector('.inputWrap'), forgot = b2?.querySelector('.forgotpin');
  const tncBox = b3?.querySelector('.checkboxContainer'), remember = $('#read-agree')?.closest('.flex');
  const np = $('#ooc-auth-note'), cs = np && getComputedStyle(np);
  const lead = html => {
    const p = document.createElement('p'); p.className = 'ooc-auth-lead'; p.innerHTML = html;
    if (cs) Object.assign(p.style, { fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, lineHeight: cs.lineHeight, color: cs.color });
    form.insertBefore(p, b1);
  };
  if (AUTH.step === 'phone') {
    omLabel.textContent = '+63';
    setInput(omInput, { id: 'authPhone', placeholder: 'Enter your mobile number', type: 'tel', inputmode: 'numeric', maxlength: 11, autocomplete: 'tel-national', value: AUTH.phone });
    b2.remove(); remember?.remove();
    setSubmit('Send OTP');
    cardText('Log in or sign up with your mobile number. No password needed.');
  } else if (AUTH.step === 'otp') {
    lead(`Enter the 6-digit code sent to <b>${maskPhone(AUTH.phone)}</b>`);
    omLabel.textContent = 'OTP';
    setInput(omInput, { id: 'authOtp', placeholder: 'Enter the 6-digit code', inputmode: 'numeric', maxlength: 6, autocomplete: 'one-time-code' });
    pinWrap?.remove();

    const a = forgot.querySelector('a');
    const link = (key, text) => { const x = a.cloneNode(true); x.textContent = text; x.href = 'javascript:void 0'; x.setAttribute('data-auth', key); x.removeAttribute('data-action'); return x; };
    forgot.innerHTML = ''; forgot.classList.add('ooc-auth-links');
    const resend = link('resend', ''); resend.id = 'authResend';
    forgot.append(link('change', 'Change number'), resend);
    tncBox?.remove();
    setSubmit('Verify');
    cardText(`Demo code: ${DEMO_OTP}`);
    updateResend();
  } else if (AUTH.step === 'register') {
    lead(`<b>Welcome to Okada Online!</b><br>${maskPhone(AUTH.phone)} is new here.`);
    omLabel.remove(); [omInput, ...b1.querySelectorAll('[data-has-start-content]')].forEach(x => x.removeAttribute('data-has-start-content'));
    setInput(omInput, { id: 'regFirst', placeholder: 'First name', autocomplete: 'given-name' });
    const pinInput = pinWrap.querySelector('input'); pinWrap.querySelectorAll('button').forEach(x => x.remove());
    setInput(pinInput, { id: 'regLast', placeholder: 'Last name', autocomplete: 'family-name' });
    const email = b1.cloneNode(true); setInput(email.querySelector('input'), { id: 'regEmail', placeholder: 'Email', type: 'email', inputmode: 'email', autocomplete: 'email' });
    forgot.remove(); form.insertBefore(email, b3);
    tncBox?.remove();
    setSubmit('Create Account');
    cardText('');
  }
  syncSubmit();
  form.classList.remove('ooc-step-in'); void form.offsetWidth; form.classList.add('ooc-step-in');
  setTimeout(() => form.querySelector('input:not([type=checkbox])')?.focus({ preventScroll: true }), 50);
}
function updateResend() {
  const b = $('#authResend'); if (!b) return;
  const s = Math.ceil((AUTH.resendAt - Date.now()) / 1000);
  b.toggleAttribute('aria-disabled', s > 0); b.classList.toggle('ooc-auth-wait', s > 0); b.textContent = s > 0 ? `Resend in ${s}s` : 'Resend code';
}
setInterval(updateResend, 1000);
document.addEventListener('input', e => { if (e.target.closest('#ooc-login-form')) syncSubmit(); });
document.addEventListener('click', e => { if (e.target.closest('[data-login-back]')) { S.returnHash = null; S.after = null; } }, true);
document.addEventListener('change', e => { if (e.target.closest('#ooc-login-form')) syncSubmit(); });

function showLogin() {
  if (!$('#ooc-loginview')) {
    document.body.insertAdjacentHTML('beforeend', UI.loginView);
    const lang = $('#ooc-login-lang'); if (lang) lang.innerHTML = langTrigger();

    lang?.insertAdjacentHTML('beforebegin', `<a href="#lobby" class="ooc-login-back" data-login-back aria-label="Back to home"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15.4 5.4L14 4l-8 8 8 8 1.4-1.4L8.8 12z" fill="currentColor"/></svg><span>Home</span></a>`);

    $$('#ooc-loginview video').forEach(v => { v.autoplay = false; v.loop = false; v.removeAttribute('autoplay'); v.removeAttribute('loop'); v.preload = 'auto'; v.pause(); v.currentTime = 0; });
    AUTH.orig = $('#ooc-login-form').innerHTML;
    const note = $$('#ooc-loginview p').find(p => /member/i.test(p.textContent)); if (note) note.id = 'ooc-auth-note';
  }
  AUTH.step = 'phone';
  renderAuthStep();
  document.body.classList.add('login', 'ooc-loginpage');
  document.documentElement.style.overflow = '';
  window.scrollTo(0, 0);
}
function hideLogin() {
  $('#ooc-loginview')?.remove();
  document.body.classList.remove('login', 'ooc-loginpage');
}
function loginError(msg) {
  const card = $('#ooc-loginview .loginCard'); card?.classList.remove('shake'); void card?.offsetWidth; card?.classList.add('shake');
  toast(msg, true);
}
const busy = async (label, ms = 600) => { const b = $('#ooc-login-submit'); if (b) { b.disabled = true; b.textContent = label; } await sleep(ms); };

function completeLogin(acc, isNew) {
  if (acc.kyc === 'verified' && acc.om === DEMO_ME.om) {
    Object.assign(ME, JSON.parse(JSON.stringify(DEMO_ME)));
    S.orders = JSON.parse(JSON.stringify(DEMO_ORDERS)); S.ptsLog = JSON.parse(JSON.stringify(DEMO_PTSLOG));
  } else {
    Object.assign(ME, { name: `${acc.first} ${acc.last[0]}.`, full: `${acc.first} ${acc.last}`, email: acc.email, phone: maskPhone(AUTH.phone),
      om: acc.kyc === 'verified' ? acc.om : null, wallet: 0, circle: 0, lifestyle: 0, tierPts: 0, vouchers: [] });
    S.orders = []; S.ptsLog = []; S.fav = new Set(); S.recent = [];
  }
  ME.phone = maskPhone(AUTH.phone);
  S.account = AUTH.phone; S.kyc = acc.kyc; S.kycDeadline = acc.kyc === 'verified' ? null : (acc.kycDeadline || Date.now() + 72 * 36e5);
  if (acc.kyc !== 'verified') acc.kycDeadline = S.kycDeadline;
  S.login = true; renderAuth();
  const back = S.returnHash || '#lobby', next = S.after; S.returnHash = null; S.after = null;
  if (location.hash === back) route(); else location.hash = back;
  toast(isNew ? `Welcome, ${acc.first}! Your account is ready.` : 'Welcome back, ' + ME.name);
  setTimeout(() => S.kyc !== 'verified' ? kycPrompt(next) : next?.(), 350);
}

document.addEventListener('submit', async e => {
  if (e.target.id !== 'ooc-login-form') return; e.preventDefault();
  if (AUTH.step === 'phone') {
    const v = ($('#authPhone')?.value || '').replace(/\D/g, '').replace(/^0/, '');
    if (!/^9\d{9}$/.test(v)) return loginError('Please enter a valid mobile number (e.g. 917 555 0142).');
    if (!$('#isRead')?.checked) return loginError('Please agree to the Terms and Conditions to continue.');
    await busy('Sending…');
    AUTH.phone = v; AUTH.step = 'otp'; AUTH.resendAt = Date.now() + 60e3;
    renderAuthStep(); toast(`OTP sent to ${maskPhone(v)}`);
  } else if (AUTH.step === 'otp') {
    const v = ($('#authOtp')?.value || '').trim();
    if (!/^\d{6}$/.test(v)) return loginError('Please enter the 6-digit code.');
    if (v !== DEMO_OTP) return loginError('Incorrect code. Please try again.');
    await busy('Verifying…');
    const acc = ACCOUNTS[AUTH.phone];
    if (acc) completeLogin(acc, false);
    else { AUTH.step = 'register'; renderAuthStep(); }
  } else if (AUTH.step === 'register') {
    const first = $('#regFirst').value.trim(), last = $('#regLast').value.trim(), email = $('#regEmail').value.trim();
    if (!first || !last) return loginError('Please enter your first and last name.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return loginError('Please enter a valid email address.');
    await busy('Creating account…');
    const acc = ACCOUNTS[AUTH.phone] = { first, last, email, kyc: 'none' };
    completeLogin(acc, true);
  }
});
document.addEventListener('click', e => {
  const a = e.target.closest('[data-auth]'); if (!a) return;
  if (a.dataset.auth === 'change') { AUTH.step = 'phone'; renderAuthStep(); }
  if (a.dataset.auth === 'resend' && !a.hasAttribute('aria-disabled')) { AUTH.resendAt = Date.now() + 60e3; updateResend(); toast(`New code sent to ${maskPhone(AUTH.phone)}`); }
});
document.addEventListener('change', e => {
  if (e.target.matches('#ooc-loginview input[type=checkbox]')) e.target.setAttribute('aria-checked', e.target.checked);
});
