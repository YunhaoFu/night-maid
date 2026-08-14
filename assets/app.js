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
const state = { media: 'all', watch: 'all', query: '', savedOnly: false };
const storageKeys = {
  saved: 'night-maid-saved',
  watch: 'night-maid-watch-state',
  ratings: 'night-maid-ratings',
  notes: 'night-maid-notes'
};

let saved = new Set(JSON.parse(localStorage.getItem(storageKeys.saved) || localStorage.getItem('night-index-saved') || '[]'));
let watchState = JSON.parse(localStorage.getItem(storageKeys.watch) || '{}');
let ratings = JSON.parse(localStorage.getItem(storageKeys.ratings) || '{}');
let notes = JSON.parse(localStorage.getItem(storageKeys.notes) || '{}');
let posterObserver = null;
let activeRecordId = null;
let lastTrigger = null;

function icon(name) { return `<i data-lucide="${name}"></i>`; }
function typeCode(type) { return ({ film: 'FILM', series: 'SERIES', anime: 'ANIMATION', book: 'PRINT', manga: 'MANGA', game: 'GAME' })[type]; }
function coverFor(record) { return covers[record.id]?.src || ''; }
function recordById(id) { return records.find(record => record.id === id); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
function sourceUrl(record) {
  const query = record.platform === 'Bangumi' ? record.original : `${record.title} ${record.original}`;
  return record.platform === 'Bangumi'
    ? `https://bgm.tv/subject_search/${encodeURIComponent(query)}?cat=all`
    : `https://www.douban.com/search?q=${encodeURIComponent(query)}`;
}
function persist() {
  localStorage.setItem(storageKeys.saved, JSON.stringify([...saved]));
  localStorage.setItem(storageKeys.watch, JSON.stringify(watchState));
  localStorage.setItem(storageKeys.ratings, JSON.stringify(ratings));
  localStorage.setItem(storageKeys.notes, JSON.stringify(notes));
}
function updateSavedCount() { document.getElementById('savedCount').textContent = saved.size; }
function attachPoster(node) {
  const record = recordById(node.dataset.posterId);
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
function setManifesto() {
  const notes = [
    ['今晚别先睡。', '这页不负责替你选“必看”。它只把值得花时间的东西放到同一张桌上。', '80 部 / 6 种媒介\n分数在角落，偏见在前面。\n每次打开，会换一张便签。'],
    ['这页不卖“神作”。', '有些作品分数高得合理，有些只是恰好对胃口。把它们放在一起，是为了少刷几次首页。', '收录中 / 80 部\n电影、书和游戏混在一起。\n算法今天休息。'],
    ['还醒着？', '那就别再看短视频了。挑一部，给它二十分钟；不合适，随时关掉。', '深夜编选 / ISSUE 01\n没有观看顺序。\n也没有标准答案。'],
    ['别把灯全关了。', '这份清单里有老片、有新作，也有几部很难向别人解释为什么喜欢。', '馆内现有 / 80 部\n媒体不分高低。\n只看你今天想不想看。'],
    ['先别相信评分。', '分数能帮你绕开一些坑，不能替你判断一部作品会不会留下来。', '编辑便签 / 00:13\n六种媒介，八十个条目。\n慢慢翻。']
  ];
  const selected = notes[Math.floor(Math.random() * notes.length)];
  document.getElementById('manifestoTitle').textContent = selected[0];
  document.getElementById('manifestoCopy').textContent = selected[1];
  document.getElementById('manifestoMeta').innerHTML = `<b>${selected[2].split('\n')[0]}</b><br>${selected[2].split('\n').slice(1).join('<br>')}`;
}
function setFeaturedRecord() {
  const picks = ['cure', 'silence', 'twinpeaks', 'perfectblue', 'houseleaves', 'ringu', 'monster', 'hereditary', 'silenthill2', 'rebecca'];
  const record = recordById(picks[Math.floor(Math.random() * picks.length)]) || records[0];
  const photo = document.getElementById('featurePhoto');
  const source = coverFor(record) || art[record.art];
  photo.style.setProperty('--feature-art', `url('${source}')`);
  document.getElementById('featureNumber').textContent = `${typeCode(record.type)} / ${record.year}`;
  document.getElementById('featureTitle').textContent = record.title;
  document.getElementById('featureCopy').textContent = record.summary;
  document.getElementById('featureRating').innerHTML = `${icon('star')} ${record.score}`;
  document.getElementById('featureAnnotation').textContent = `${record.signal}。${record.tags.split(' ').join(' / ')}`;
  document.getElementById('featureTags').innerHTML = record.tags.split(' ').map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
  document.getElementById('featureCredit').textContent = `COVER / ${covers[record.id]?.provider || 'ARCHIVE'}`;
  document.getElementById('featureOpen').dataset.recordId = record.id;
}
function activeFilterLabels() {
  const labels = [];
  if (state.media !== 'all') labels.push(document.querySelector(`[data-filter="${state.media}"]`).textContent);
  if (state.watch !== 'all') labels.push(state.watch === 'watched' ? '已看' : '未看');
  if (state.query) labels.push(`检索：${state.query}`);
  if (state.savedOnly) labels.push('我的清单');
  return labels;
}
function updateFilterStatus() {
  const labels = activeFilterLabels();
  filterStatus.hidden = labels.length === 0;
  filterStatusText.textContent = labels.length ? `当前查看 / ${labels.join(' · ')}` : '';
}
function draw() {
  const query = state.query.toLowerCase();
  const shown = records.filter(record =>
    (state.media === 'all' || record.type === state.media) &&
    (state.watch === 'all' || watchState[record.id] === state.watch) &&
    (!state.savedOnly || saved.has(record.id)) &&
    `${record.title} ${record.original} ${record.tags} ${record.summary} ${record.year}`.toLowerCase().includes(query)
  );
  grid.innerHTML = shown.map((record, index) => {
    const status = watchState[record.id];
    const statusLabel = status === 'watched' ? '已看' : status === 'unwatched' ? '未看' : '';
    return `
      <article class="entry" tabindex="0" data-id="${record.id}" style="--art: url('${art[record.art]}')" aria-label="查看 ${record.title} 详情">
        <div class="entry-poster" data-poster-id="${record.id}"><img alt="${record.title} 封面" decoding="async" referrerpolicy="no-referrer"></div>
        ${statusLabel ? `<span class="entry-status ${status}">${statusLabel}</span>` : ''}
        <div class="entry-top"><span class="entry-type">${typeCode(record.type)} / ${String(index + 1).padStart(2, '0')}</span><span class="entry-year">${record.year}</span></div>
        <div><h4 class="entry-title">${record.title}</h4><div class="entry-original">${record.original}</div></div>
        <div class="entry-bottom"><span class="entry-score">${record.score}</span><span class="entry-signal">${record.signal}</span><button class="save-entry ${saved.has(record.id) ? 'is-saved' : ''}" type="button" data-save="${record.id}" title="${saved.has(record.id) ? '从我的清单移除' : '加入我的清单'}" aria-label="${saved.has(record.id) ? '从我的清单移除' : '加入我的清单'} ${record.title}">${icon('bookmark')}</button></div>
      </article>`;
  }).join('');
  empty.style.display = shown.length ? 'none' : 'block';
  empty.textContent = state.savedOnly ? '还没有加入清单的作品。可使用卡片右下角的书签，或在详情页加入。' : '未找到相符作品。请更换关键词或清除筛选。';
  resultCount.textContent = `${shown.length} / ${records.length} 条记录`;
  document.querySelectorAll('.filter').forEach(button => button.classList.toggle('active', button.dataset.filter === state.media));
  document.querySelectorAll('.watch-filter').forEach(button => button.classList.toggle('active', button.dataset.watchFilter === state.watch));
  updateFilterStatus();
  lucide.createIcons();
  loadVisiblePosters();
}
function toggleSaved(id) {
  saved.has(id) ? saved.delete(id) : saved.add(id);
  persist();
  updateSavedCount();
  draw();
  if (activeRecordId === id) renderPersonalControls(recordById(id));
}
function setWatchStatus(id, status) {
  if (status === 'clear') delete watchState[id];
  else watchState[id] = status;
  persist();
  draw();
  renderPersonalControls(recordById(id));
}
function setRating(id, rating) {
  ratings[id] = ratings[id] === rating ? 0 : rating;
  if (!ratings[id]) delete ratings[id];
  persist();
  renderPersonalControls(recordById(id));
}
function renderPersonalControls(record) {
  if (!record) return;
  document.querySelectorAll('[data-watch-status]').forEach(button => button.classList.toggle('active', watchState[record.id] === button.dataset.watchStatus));
  document.querySelectorAll('[data-rating]').forEach(button => button.classList.toggle('active', Number(button.dataset.rating) <= (ratings[record.id] || 0)));
  const saveButton = document.getElementById('dialogSave');
  const savedHere = saved.has(record.id);
  saveButton.classList.toggle('is-saved', savedHere);
  saveButton.querySelector('span').textContent = savedHere ? '已加入我的清单' : '加入我的清单';
  const recordNotes = notes[record.id] || [];
  document.getElementById('noteList').innerHTML = recordNotes.map(note => `<div class="note-item">${escapeHtml(note.text)}<button type="button" data-delete-note="${note.id}" aria-label="删除笔记">删除</button></div>`).join('');
}
function setDialogPoster(record) {
  const dialogArt = document.getElementById('dialogArt');
  dialogArt.style.setProperty('--dialog-art', `url('${coverFor(record) || art[record.art]}')`);
}
function openRecord(id, trigger) {
  const record = recordById(id);
  if (!record) return;
  lastTrigger = trigger || document.activeElement;
  activeRecordId = record.id;
  setDialogPoster(record);
  document.getElementById('dialogCode').textContent = `ARCHIVE / ${String(records.indexOf(record) + 1).padStart(3, '0')}`;
  document.getElementById('dialogMeta').textContent = `${typeCode(record.type)} / ${record.year} / ${record.platform} 中文资料`;
  document.getElementById('dialogTitle').textContent = record.title;
  document.getElementById('dialogOriginal').textContent = record.original;
  document.getElementById('dialogSummary').textContent = record.summary;
  document.getElementById('dialogScore').textContent = record.score;
  document.getElementById('dialogLink').href = sourceUrl(record);
  document.getElementById('dialogLinkLabel').textContent = `前往 ${record.platform}`;
  document.getElementById('noteInput').value = '';
  renderPersonalControls(record);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  lucide.createIcons();
  document.getElementById('closeModal').focus();
}
function closeModal() {
  activeRecordId = null;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (lastTrigger) lastTrigger.focus();
}
function clearFilters() {
  state.media = 'all';
  state.watch = 'all';
  state.query = '';
  state.savedOnly = false;
  search.value = '';
  draw();
}
function showSaved() {
  state.media = 'all';
  state.watch = 'all';
  state.query = '';
  state.savedOnly = true;
  search.value = '';
  draw();
  document.getElementById('catalogue').scrollIntoView({ behavior: 'smooth' });
}
function saveNote(event) {
  event.preventDefault();
  if (!activeRecordId) return;
  const input = document.getElementById('noteInput');
  const text = input.value.trim();
  if (!text) return;
  const recordNotes = notes[activeRecordId] || [];
  recordNotes.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text });
  notes[activeRecordId] = recordNotes.slice(0, 20);
  persist();
  input.value = '';
  renderPersonalControls(recordById(activeRecordId));
}
function sendGuestbook(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.getElementById('guestbookMessage').value.trim();
  if (!message) return;
  const params = new URLSearchParams({ subject: 'night-maid 留言', body: message });
  window.location.href = `mailto:${form.dataset.email}?${params.toString()}`;
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => { state.media = button.dataset.filter; draw(); }));
document.querySelectorAll('.watch-filter').forEach(button => button.addEventListener('click', () => { state.watch = button.dataset.watchFilter; draw(); }));
search.addEventListener('input', () => { state.query = search.value.trim(); draw(); });
grid.addEventListener('click', event => {
  const saveButton = event.target.closest('[data-save]');
  if (saveButton) { event.stopPropagation(); toggleSaved(saveButton.dataset.save); return; }
  const entry = event.target.closest('.entry');
  if (entry) openRecord(entry.dataset.id, entry);
});
grid.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.classList.contains('entry')) { event.preventDefault(); openRecord(event.target.dataset.id, event.target); }
});
document.getElementById('featureOpen').addEventListener('click', event => openRecord(event.currentTarget.dataset.recordId, event.currentTarget));
document.getElementById('savedButton').addEventListener('click', showSaved);
document.getElementById('finalSaved').addEventListener('click', showSaved);
document.getElementById('clearFilters').addEventListener('click', clearFilters);
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('dialogSave').addEventListener('click', () => activeRecordId && toggleSaved(activeRecordId));
document.getElementById('noteForm').addEventListener('submit', saveNote);
document.getElementById('guestbookForm').addEventListener('submit', sendGuestbook);
modal.addEventListener('click', event => {
  if (event.target === modal) { closeModal(); return; }
  const watchButton = event.target.closest('[data-watch-status]');
  if (watchButton && activeRecordId) { setWatchStatus(activeRecordId, watchButton.dataset.watchStatus); return; }
  const ratingButton = event.target.closest('[data-rating]');
  if (ratingButton && activeRecordId) { setRating(activeRecordId, Number(ratingButton.dataset.rating)); return; }
  const deleteButton = event.target.closest('[data-delete-note]');
  if (deleteButton && activeRecordId) {
    notes[activeRecordId] = (notes[activeRecordId] || []).filter(note => note.id !== deleteButton.dataset.deleteNote);
    persist();
    renderPersonalControls(recordById(activeRecordId));
  }
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
window.addEventListener('mousemove', event => { const light = document.querySelector('.cursor-light'); light.style.left = `${event.clientX}px`; light.style.top = `${event.clientY}px`; });

setManifesto();
setFeaturedRecord();
persist();
updateSavedCount();
draw();
