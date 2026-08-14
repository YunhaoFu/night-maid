
const art = {
  corridor: 'https://images.unsplash.com/photo-1620342484818-f709dda63d20?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1000',
  theatre: 'https://images.unsplash.com/photo-1713514116766-d9be318edaf8?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1000',
  static: 'https://images.unsplash.com/photo-1665166357844-884711bff962?auto=format&fit=crop&fm=jpg&ixlib=rb-4.0.3&q=80&w=1000',
  cure: 'https://image.tmdb.org/t/p/w780/dsLG9eNNtdKaMRSnMDI7rrDR0So.jpg'
};
const records = window.NIGHT_INDEX_RECORDS || [];
const covers = window.NIGHT_INDEX_COVERS || {};

const grid = document.getElementById('catalogueGrid');
const search = document.getElementById('search');
const resultCount = document.getElementById('resultCount');
const empty = document.getElementById('emptyState');
const modal = document.getElementById('modal');
const filterStatus = document.getElementById('filterStatus');
const filterStatusText = document.getElementById('filterStatusText');
const state = { media: 'all', query: '', path: null, savedOnly: false };
let saved = new Set(JSON.parse(localStorage.getItem('night-index-saved') || '[]'));
let lastTrigger = null;
let posterObserver = null;
let activeRecordId = null;

function icon(name) { return `<i data-lucide="${name}"></i>`; }
function typeCode(type) { return ({film:'FILM', series:'SERIES', anime:'ANIMATION', book:'PRINT', manga:'MANGA', game:'GAME'})[type]; }
function sourceUrl(record) {
  const query = record.platform === 'Bangumi' ? record.original : `${record.title} ${record.original}`;
  return record.platform === 'Bangumi'
    ? `https://bgm.tv/subject_search/${encodeURIComponent(query)}?cat=all`
    : `https://www.douban.com/search?q=${encodeURIComponent(query)}`;
}
function coverFor(record) { return covers[record.id]?.src || ''; }
function attachPoster(node) {
  const record = records.find(item => item.id === node.dataset.posterId);
  if (!record || node.dataset.loading) return;
  node.dataset.loading = 'true';
  const source = coverFor(record);
  if (!source || !node.isConnected) return;
  const image = node.querySelector('img');
  image.addEventListener('load', () => image.classList.add('loaded'), { once: true });
  image.addEventListener('error', () => node.classList.add('failed'), { once: true });
  image.src = source;
}
function loadVisiblePosters() {
  posterObserver?.disconnect();
  const nodes = [...grid.querySelectorAll('[data-poster-id]')];
  if (!('IntersectionObserver' in window)) { nodes.forEach(attachPoster); return; }
  posterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      attachPoster(entry.target);
      posterObserver.unobserve(entry.target);
    });
  }, { rootMargin: '480px 0px' });
  nodes.forEach(node => posterObserver.observe(node));
}
function activeFilterLabels() {
  const labels = [];
  if (state.media !== 'all') labels.push(document.querySelector(`[data-filter="${state.media}"]`).textContent);
  if (state.query) labels.push(`检索：${state.query}`);
  if (state.path) labels.push(`路径：${({sealed:'封闭空间', town:'小镇异闻', mind:'身份与记忆', detective:'调查与谜案'})[state.path]}`);
  if (state.savedOnly) labels.push('我的留档');
  return labels;
}
function updateFilterStatus() {
  const labels = activeFilterLabels();
  filterStatus.hidden = labels.length === 0;
  filterStatusText.textContent = labels.length ? `当前查看 / ${labels.join(' · ')}` : '';
}
function draw() {
  const query = state.query.toLowerCase();
  const shown = records.filter(r =>
    (state.media === 'all' || r.type === state.media) &&
    (!state.path || r.path === state.path) &&
    (!state.savedOnly || saved.has(r.id)) &&
    `${r.title} ${r.original} ${r.tags} ${r.summary} ${r.year}`.toLowerCase().includes(query)
  );
  grid.innerHTML = shown.map((r, index) => `
    <article class="entry" tabindex="0" data-id="${r.id}" style="--art: url('${art[r.art]}')" aria-label="查看 ${r.title} 详情">
      <div class="entry-poster" data-poster-id="${r.id}"><img alt="${r.title} 封面" decoding="async" referrerpolicy="no-referrer"></div>
      <div class="entry-top"><span class="entry-type">${typeCode(r.type)} / ${String(index + 1).padStart(2,'0')}</span><span class="entry-year">${r.year}</span></div>
      <div><h4 class="entry-title">${r.title}</h4><div class="entry-original">${r.original}</div></div>
      <div class="entry-bottom"><span class="entry-score">${r.score}</span><span class="entry-signal">${r.signal}</span><button class="save-entry ${saved.has(r.id) ? 'is-saved' : ''}" type="button" data-save="${r.id}" aria-label="${saved.has(r.id) ? '取消留档' : '留档'} ${r.title}">${icon('bookmark')}</button></div>
    </article>`).join('');
  empty.style.display = shown.length ? 'none' : 'block';
  empty.textContent = state.savedOnly ? '还没有留档作品。' : '未找到相符作品。请更换关键词或清除筛选。';
  resultCount.textContent = `${shown.length} / ${records.length} 条记录`;
  document.querySelectorAll('.filter').forEach(button => button.classList.toggle('active', button.dataset.filter === state.media));
  updateFilterStatus();
  lucide.createIcons();
  loadVisiblePosters();
}
function updateSaved() {
  localStorage.setItem('night-index-saved', JSON.stringify([...saved]));
  document.getElementById('savedCount').textContent = saved.size;
}
function setDialogPoster(record) {
  const dialogArt = document.getElementById('dialogArt');
  dialogArt.style.setProperty('--dialog-art', `url('${art[record.art]}')`);
  const source = coverFor(record);
  if (source && activeRecordId === record.id) dialogArt.style.setProperty('--dialog-art', `url('${source}')`);
}
function openRecord(id, trigger) {
  const r = records.find(item => item.id === id);
  if (!r) return;
  lastTrigger = trigger || document.activeElement;
  activeRecordId = r.id;
  setDialogPoster(r);
  document.getElementById('dialogCode').textContent = `ARCHIVE / ${String(records.indexOf(r) + 1).padStart(3,'0')}`;
  document.getElementById('dialogMeta').textContent = `${typeCode(r.type)} / ${r.year} / ${r.platform} 中文资料`;
  document.getElementById('dialogTitle').textContent = r.title;
  document.getElementById('dialogOriginal').textContent = r.original;
  document.getElementById('dialogSummary').textContent = r.summary;
  document.getElementById('dialogScore').textContent = r.score;
  document.getElementById('dialogLink').href = sourceUrl(r);
  document.getElementById('dialogLinkLabel').textContent = `前往 ${r.platform}`;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
  document.getElementById('closeModal').focus();
}
function closeModal() {
  activeRecordId = null;
  modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open');
  if (lastTrigger) lastTrigger.focus();
}
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  state.media = button.dataset.filter;
  draw();
}));
search.addEventListener('input', () => { state.query = search.value.trim(); draw(); });
grid.addEventListener('click', event => {
  const saveButton = event.target.closest('[data-save]');
  if (saveButton) { event.stopPropagation(); const id = saveButton.dataset.save; saved.has(id) ? saved.delete(id) : saved.add(id); updateSaved(); draw(); return; }
  const entry = event.target.closest('.entry'); if (entry) openRecord(entry.dataset.id, entry);
});
grid.addEventListener('keydown', event => { if ((event.key === 'Enter' || event.key === ' ') && event.target.classList.contains('entry')) { event.preventDefault(); openRecord(event.target.dataset.id, event.target); } });
document.querySelector('[data-open="cure"]').addEventListener('click', event => openRecord('cure', event.currentTarget));
document.getElementById('closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
function clearFilters() {
  state.media = 'all'; state.query = ''; state.path = null; state.savedOnly = false;
  search.value = '';
  draw();
}
function showSaved() { state.savedOnly = true; draw(); document.getElementById('catalogue').scrollIntoView({behavior:'smooth'}); }
document.getElementById('savedButton').addEventListener('click', showSaved);
document.getElementById('finalSaved').addEventListener('click', showSaved);
document.getElementById('clearFilters').addEventListener('click', clearFilters);
document.querySelectorAll('[data-path]').forEach(link => link.addEventListener('click', event => { event.preventDefault(); state.path = link.dataset.path; draw(); document.getElementById('catalogue').scrollIntoView({behavior:'smooth'}); }));
window.addEventListener('mousemove', e => { const light = document.querySelector('.cursor-light'); light.style.left = e.clientX + 'px'; light.style.top = e.clientY + 'px'; });
updateSaved(); draw();
