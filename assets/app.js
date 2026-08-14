const art = {
  corridor: 'https://images.unsplash.com/photo-1620342484818-f709dda63d20?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1000',
  theatre: 'https://images.unsplash.com/photo-1713514116766-d9be318edaf8?auto=format&fit=crop&fm=jpg&ixlib=rb-4.1.0&q=80&w=1000',
  static: 'https://images.unsplash.com/photo-1665166357844-884711bff962?auto=format&fit=crop&fm=jpg&ixlib=rb-4.0.3&q=80&w=1000',
  cure: 'https://image.tmdb.org/t/p/w780/dsLG9eNNtdKaMRSnMDI7rrDR0So.jpg'
};

const records = window.NIGHT_INDEX_RECORDS || [];
const covers = window.NIGHT_INDEX_COVERS || {};
const bookQuotes = window.NIGHT_MAID_QUOTES || [];
const grid = document.getElementById('catalogueGrid');
const search = document.getElementById('search');
const resultCount = document.getElementById('resultCount');
const empty = document.getElementById('emptyState');
const modal = document.getElementById('modal');
const filterStatus = document.getElementById('filterStatus');
const filterStatusText = document.getElementById('filterStatusText');
const apiPath = '/api/community';
const state = { media: 'all', watch: 'all', query: '', savedOnly: false };
const storageKeys = {
  saved: 'night-maid-saved',
  watch: 'night-maid-watch-state',
  ratings: 'night-maid-ratings',
  notes: 'night-maid-notes',
  guestbook: 'night-maid-guestbook',
  visitor: 'night-maid-visitor'
};

function readStored(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}
function newId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function storedVisitor() {
  const existing = localStorage.getItem(storageKeys.visitor);
  if (existing && /^[a-zA-Z0-9-]{16,80}$/.test(existing)) return existing;
  const id = newId();
  localStorage.setItem(storageKeys.visitor, id);
  return id;
}

let saved = new Set(readStored(storageKeys.saved, readStored('night-index-saved', [])));
let watchState = readStored(storageKeys.watch, {});
let ratings = readStored(storageKeys.ratings, {});
let notes = readStored(storageKeys.notes, {});
let guestbookEntries = readStored(storageKeys.guestbook, []);
let recordCommunity = {};
let posterObserver = null;
let activeRecordId = null;
let lastTrigger = null;
const visitor = storedVisitor();

function icon(name) { return `<i data-lucide="${name}"></i>`; }
function refreshIcons() { window.lucide?.createIcons(); }
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
  localStorage.setItem(storageKeys.guestbook, JSON.stringify(guestbookEntries));
}
function updateSavedCount() { document.getElementById('savedCount').textContent = saved.size; }
async function communityRequest(method, query, body) {
  const url = new URL(apiPath, window.location.origin);
  Object.entries(query || {}).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify({ ...body, visitor }) : undefined
  });
  if (!response.ok) throw new Error(`Community request failed: ${response.status}`);
  return response.json();
}
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
  document.getElementById('bookQuote').textContent = bookQuotes[Math.floor(Math.random() * bookQuotes.length)] || '';
}
function setFeaturedRecord() {
  const picks = ['cure', 'silence', 'twinpeaks', 'perfectblue', 'houseleaves', 'ringu', 'monster', 'hereditary', 'silenthill2', 'rebecca'];
  const record = recordById(picks[Math.floor(Math.random() * picks.length)]) || records[0];
  const photo = document.getElementById('featurePhoto');
  photo.style.setProperty('--feature-art', `url('${coverFor(record) || art[record.art]}')`);
  document.getElementById('featureNumber').textContent = `${typeCode(record.type)} / ${record.year}`;
  document.getElementById('featureTitle').textContent = record.title;
  document.getElementById('featureCopy').textContent = record.summary;
  document.getElementById('featureRating').innerHTML = `${icon('star')} ${record.score}`;
  document.getElementById('featureAnnotation').textContent = `${record.signal}。${record.tags.split(' ').join(' / ')}`;
  document.getElementById('featureTags').innerHTML = record.tags.split(' ').map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
  document.getElementById('featureCredit').textContent = `COVER / ${covers[record.id]?.provider || 'ARCHIVE'}`;
  document.getElementById('featureOpen').dataset.recordId = record.id;
  refreshIcons();
}
function activeFilterLabels() {
  const labels = [];
  if (state.media !== 'all') labels.push(document.querySelector(`[data-filter="${state.media}"]`).textContent);
  if (state.watch !== 'all') labels.push(({ watched: '已看', unwatched: '未看', 'to-watch': '待看' })[state.watch]);
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
    (state.watch === 'all' || (state.watch === 'unwatched' ? watchState[record.id] !== 'watched' : watchState[record.id] === state.watch)) &&
    (!state.savedOnly || saved.has(record.id)) &&
    `${record.title} ${record.original} ${record.tags} ${record.summary} ${record.year}`.toLowerCase().includes(query)
  );
  grid.innerHTML = shown.map((record, index) => {
    const status = watchState[record.id];
    const statusLabel = ({ watched: '已看', unwatched: '未看', 'to-watch': '待看' })[status] || '';
    return `<article class="entry" tabindex="0" data-id="${record.id}" style="--art: url('${art[record.art]}')" aria-label="查看 ${record.title} 详情">
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
  refreshIcons();
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
  communityRequest('POST', null, { action: 'record:rating', record: id, rating: ratings[id] || 0 })
    .then(data => {
      recordCommunity[id] = data;
      if (activeRecordId === id) renderPersonalControls(recordById(id));
    })
    .catch(() => {});
}
function communityLabel(data) {
  if (!data || !data.rating?.count) return '暂无标星';
  return `${data.rating.average.toFixed(1)} / ${data.rating.count} 人`;
}
function renderPersonalControls(record) {
  if (!record) return;
  document.querySelectorAll('[data-watch-status]').forEach(button => {
    const isUnwatched = button.dataset.watchStatus === 'unwatched' && (!watchState[record.id] || watchState[record.id] === 'unwatched');
    button.classList.toggle('active', isUnwatched || watchState[record.id] === button.dataset.watchStatus);
  });
  document.querySelectorAll('[data-rating]').forEach(button => button.classList.toggle('active', Number(button.dataset.rating) <= (ratings[record.id] || 0)));
  const saveButton = document.getElementById('dialogSave');
  const savedHere = saved.has(record.id);
  saveButton.classList.toggle('is-saved', savedHere);
  saveButton.querySelector('span').textContent = savedHere ? '已加入我的清单' : '加入我的清单';
  const community = recordCommunity[record.id];
  const recordNotes = community?.comments || notes[record.id] || [];
  document.getElementById('communityRating').textContent = communityLabel(community);
  document.getElementById('noteList').innerHTML = recordNotes.map(note => `<div class="note-item">${escapeHtml(note.text)}</div>`).join('');
}
async function loadRecordCommunity(id) {
  try {
    recordCommunity[id] = await communityRequest('GET', { scope: 'record', record: id, visitor });
    if (activeRecordId === id) renderPersonalControls(recordById(id));
  } catch {}
}
function setDialogPoster(record) {
  document.getElementById('dialogArt').style.setProperty('--dialog-art', `url('${coverFor(record) || art[record.art]}')`);
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
  refreshIcons();
  document.getElementById('closeModal').focus();
  void loadRecordCommunity(record.id);
}
function closeModal() {
  activeRecordId = null;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lastTrigger?.focus();
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
async function saveNote(event) {
  event.preventDefault();
  if (!activeRecordId) return;
  const input = document.getElementById('noteInput');
  const message = input.value.trim();
  if (!message) return;
  input.value = '';
  try {
    recordCommunity[activeRecordId] = await communityRequest('POST', null, { action: 'record:comment', record: activeRecordId, message });
    delete notes[activeRecordId];
  } catch {
    const fallback = notes[activeRecordId] || [];
    fallback.unshift({ id: newId(), text: message });
    notes[activeRecordId] = fallback.slice(0, 20);
  }
  persist();
  renderPersonalControls(recordById(activeRecordId));
}
function renderGuestbook() {
  const guestbookList = document.getElementById('guestbookList');
  guestbookList.innerHTML = guestbookEntries.map(entry => {
    const replies = entry.replies || [];
    return `<article class="guest-entry" data-guest-id="${entry.id}">
      <p>${escapeHtml(entry.message)}</p>
      <div class="guest-actions">
        <button class="guest-action ${entry.liked ? 'is-liked' : ''}" type="button" data-guest-like="${entry.id}" aria-pressed="${entry.liked ? 'true' : 'false'}">${icon('heart')} <span>${entry.likes || 0}</span></button>
        <button class="guest-action" type="button" data-guest-reply-toggle="${entry.id}">${icon('message-square')} <span>${replies.length || '评论'}</span></button>
      </div>
      <form class="guest-reply-form" data-guest-reply-form="${entry.id}" hidden><input maxlength="300" required aria-label="回复留言" placeholder="写下评论"><button type="submit">评论</button></form>
      <div class="guest-replies">${replies.map(reply => `<div class="guest-reply">${escapeHtml(reply.text)}</div>`).join('')}</div>
    </article>`;
  }).join('');
  refreshIcons();
}
async function loadGuestbook() {
  try {
    const data = await communityRequest('GET', { scope: 'guestbook', visitor });
    guestbookEntries = data.entries;
    persist();
    renderGuestbook();
  } catch {}
}
async function sendGuestbook(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.getElementById('guestbookMessage').value.trim();
  if (!message) return;
  try {
    const data = await communityRequest('POST', null, { action: 'guestbook:create', message });
    guestbookEntries = data.entries;
  } catch {
    guestbookEntries.unshift({ id: newId(), message, likes: 0, liked: false, replies: [] });
    guestbookEntries = guestbookEntries.slice(0, 50);
  }
  persist();
  form.reset();
  renderGuestbook();
}
async function updateGuestbook(event) {
  const likeButton = event.target.closest('[data-guest-like]');
  const replyToggle = event.target.closest('[data-guest-reply-toggle]');
  if (likeButton) {
    const entry = guestbookEntries.find(item => item.id === likeButton.dataset.guestLike);
    if (!entry) return;
    entry.liked = !entry.liked;
    entry.likes = Math.max(0, (entry.likes || 0) + (entry.liked ? 1 : -1));
    renderGuestbook();
    try {
      const data = await communityRequest('POST', null, { action: 'guestbook:like', id: entry.id });
      guestbookEntries = data.entries;
    } catch {}
    persist();
    renderGuestbook();
    return;
  }
  if (replyToggle) {
    const form = document.querySelector(`[data-guest-reply-form="${replyToggle.dataset.guestReplyToggle}"]`);
    if (form) form.hidden = !form.hidden;
  }
}
async function saveGuestReply(event) {
  const form = event.target.closest('[data-guest-reply-form]');
  if (!form) return;
  event.preventDefault();
  const input = form.querySelector('input');
  const message = input.value.trim();
  const entry = guestbookEntries.find(item => item.id === form.dataset.guestReplyForm);
  if (!message || !entry) return;
  try {
    const data = await communityRequest('POST', null, { action: 'guestbook:reply', id: entry.id, message });
    guestbookEntries = data.entries;
  } catch {
    entry.replies = entry.replies || [];
    entry.replies.push({ id: newId(), text: message });
  }
  persist();
  renderGuestbook();
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
document.getElementById('guestbookList').addEventListener('click', updateGuestbook);
document.getElementById('guestbookList').addEventListener('submit', saveGuestReply);
modal.addEventListener('click', event => {
  if (event.target === modal) { closeModal(); return; }
  const watchButton = event.target.closest('[data-watch-status]');
  if (watchButton && activeRecordId) { setWatchStatus(activeRecordId, watchButton.dataset.watchStatus); return; }
  const ratingButton = event.target.closest('[data-rating]');
  if (ratingButton && activeRecordId) { setRating(activeRecordId, Number(ratingButton.dataset.rating)); }
});
document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
window.addEventListener('mousemove', event => { const light = document.querySelector('.cursor-light'); light.style.left = `${event.clientX}px`; light.style.top = `${event.clientY}px`; });

setManifesto();
setFeaturedRecord();
persist();
updateSavedCount();
draw();
renderGuestbook();
void loadGuestbook();
