
document.addEventListener('input', e => {
  if (e.target.id === 'ooc-gsq') searchHome(e.target.value);
  if (e.target.id === 'ooc-gfq') { S.gf.q = e.target.value; clearTimeout(S.gf.t); S.gf.t = setTimeout(refreshGamesBody, 200); }
});
document.addEventListener('change', e => { if (e.target.id === 'ooc-gfp') { S.gf.prov = e.target.value; refreshGamesBody(); } });
document.addEventListener('click', e => {
  const c = e.target.closest('[data-car]'); if (c) { const [id, dir] = c.dataset.car.split(':'), t = $(`[data-track="${id}"]`); t?.scrollBy({ left: +dir * t.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  const f = e.target.closest('[data-fav]'); if (f) { e.stopPropagation(); const id = +f.dataset.fav; S.fav.has(id) ? S.fav.delete(id) : S.fav.add(id);
    $$(`[data-fav="${id}"]`).forEach(b => { b.classList.toggle('on', S.fav.has(id)); b.setAttribute('aria-pressed', S.fav.has(id)); });
    toast(S.fav.has(id) ? 'Added to Favourites' : 'Removed from Favourites'); if ($('#ooc-main').dataset.page === 'fav') render('fav'); }
}, true);
document.addEventListener('scroll', e => {
  const t = e.target.closest?.('[data-track]'); if (!t) return;
  const i = Math.round(t.scrollLeft / Math.max(1, t.clientWidth));
  t.parentElement.querySelectorAll('.ooc-car-dots i').forEach((d, k) => d.classList.toggle('on', k === i));
  const id = t.dataset.track; $(`[data-car="${id}:-1"]`)?.toggleAttribute('disabled', t.scrollLeft < 4); $(`[data-car="${id}:1"]`)?.toggleAttribute('disabled', t.scrollLeft + t.clientWidth >= t.scrollWidth - 4);
}, true);
matchMedia('(orientation: portrait)').addEventListener('change', () => { if ($('#ooc-main').dataset.page === 'lobby') render('lobby'); });
loadGames();
