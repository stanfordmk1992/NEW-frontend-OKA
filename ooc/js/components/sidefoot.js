

const LANGS = { en: 'English' };

let langAnchor = null;
const CHEVRON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';

const LANG_ABBR = { en: 'EN', zh: 'ZH', ko: 'KO', ja: 'JA' };
const langTrigger = () => `<button type="button" class="ooc-lang-trigger" aria-haspopup="menu" aria-expanded="false" aria-label="Language: ${LANGS[S.lang]}">${S.langFlag || UI.langFlag ? `<img alt="" src="${S.langFlag || UI.langFlag}">` : ''}<span>${LANG_ABBR[S.lang]}</span>${CHEVRON}</button>`;
const csTrigger = () => `<button type="button" class="ooc-cs-trigger" data-action="support" aria-label="Customer Service" title="Customer Service"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 3h14a2 2 0 012 2v10a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2zm3 6.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm4 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm4 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill-rule="evenodd"/></svg></button>`;
const sideFoot = () => `<div class="ooc-sidefoot">${langTrigger()}${csTrigger()}</div>`;
function closePop() { $('#ooc-pop').innerHTML = ''; $('#ooc-pop').classList.remove('on'); langAnchor?.setAttribute('aria-expanded', 'false'); }
function langMenu(b) {
  const pop = $('#ooc-pop');
  if (pop.innerHTML) { closePop(); if (langAnchor === b) return; }
  langAnchor = b; pop.classList.add('on');
  pop.innerHTML = `<div class="ooc-pop-wrap">${UI.langMenu}</div>`;
  pop.querySelectorAll('li[data-lang]').forEach(li => {
    const on = li.dataset.lang === S.lang;
    li.setAttribute('aria-checked', on); li.tabIndex = on ? 0 : -1;
    on ? li.setAttribute('data-selected', 'true') : li.removeAttribute('data-selected');
    const mark = li.querySelector(':scope > span:last-child'); if (mark) mark.innerHTML = on ? UI.langCheck : '';
    const hi = v => v ? li.setAttribute('data-hover', 'true') : li.removeAttribute('data-hover');
    li.onmouseenter = () => hi(true); li.onmouseleave = () => hi(false);
    li.onfocus = () => hi(true); li.onblur = () => hi(false);
  });

  const r = b.getBoundingClientRect(), wrap = pop.firstElementChild;
  if (innerHeight - r.bottom < 240) wrap.style.bottom = (innerHeight - r.top + 6) + 'px'; else wrap.style.top = (r.bottom + 6) + 'px';

  wrap.style.left = '0px'; const w = wrap.getBoundingClientRect().width;
  wrap.style.left = Math.max(8, Math.min(r.left, innerWidth - w - 8)) + 'px';
  b.setAttribute('aria-expanded', 'true');
  pop.querySelector('li[aria-checked="true"]')?.focus({ preventScroll: true });
}
function setLang(code, li) {
  S.lang = code; S.langFlag = li.querySelector('img')?.getAttribute('src') || S.langFlag;
  $$('.ooc-lang-trigger').forEach(t => t.outerHTML = langTrigger());
  closePop(); toast(`Language: ${LANGS[code]} (mock)`);
}
