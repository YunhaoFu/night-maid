const JSON_HEADERS = { 'content-type': 'application/json; charset=UTF-8', 'cache-control': 'no-store' };
const ID_PATTERN = /^[a-zA-Z0-9-]{16,80}$/;
const RECORD_PATTERN = /^[a-z0-9-]{1,64}$/;

function respond(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function text(value, limit) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/\r\n/g, '\n').slice(0, limit);
}

function visitorId(value) {
  return ID_PATTERN.test(value || '') ? value : '';
}

function recordId(value) {
  return RECORD_PATTERN.test(value || '') ? value : '';
}

async function guestbook(db, currentVisitor) {
  const entries = (await db.prepare(`
    SELECT entry.id, entry.body, entry.created_at,
      (SELECT COUNT(*) FROM guestbook_likes AS like_row WHERE like_row.entry_id = entry.id) AS likes,
      EXISTS(
        SELECT 1 FROM guestbook_likes AS like_row
        WHERE like_row.entry_id = entry.id AND like_row.visitor_id = ?
      ) AS liked
    FROM guestbook_entries AS entry
    WHERE entry.hidden = 0
    ORDER BY entry.created_at DESC
    LIMIT 50
  `).bind(currentVisitor).all()).results;

  const replies = (await db.prepare(`
    SELECT reply.id, reply.entry_id, reply.body, reply.created_at
    FROM guestbook_replies AS reply
    INNER JOIN guestbook_entries AS entry ON entry.id = reply.entry_id
    WHERE entry.hidden = 0 AND reply.hidden = 0
    ORDER BY reply.created_at ASC
  `).all()).results;
  const repliesByEntry = new Map();
  replies.forEach(reply => {
    const list = repliesByEntry.get(reply.entry_id) || [];
    list.push({ id: reply.id, text: reply.body, createdAt: reply.created_at });
    repliesByEntry.set(reply.entry_id, list);
  });

  return entries.map(entry => ({
    id: entry.id,
    message: entry.body,
    likes: Number(entry.likes),
    liked: Boolean(entry.liked),
    createdAt: entry.created_at,
    replies: repliesByEntry.get(entry.id) || []
  }));
}

async function recordCommunity(db, id) {
  const comments = (await db.prepare(`
    SELECT id, body, created_at
    FROM record_comments
    WHERE record_id = ? AND hidden = 0
    ORDER BY created_at DESC
    LIMIT 50
  `).bind(id).all()).results;
  const rating = await db.prepare(`
    SELECT COUNT(*) AS count, AVG(rating) AS average
    FROM record_ratings
    WHERE record_id = ?
  `).bind(id).first();

  return {
    comments: comments.map(comment => ({ id: comment.id, text: comment.body, createdAt: comment.created_at })),
    rating: { count: Number(rating?.count || 0), average: rating?.average === null || rating?.average === undefined ? null : Number(rating.average) }
  };
}

async function requestBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

async function entryExists(db, id) {
  return Boolean(await db.prepare('SELECT id FROM guestbook_entries WHERE id = ? AND hidden = 0').bind(id).first());
}

export async function onRequestGet(context) {
  const db = context.env.NIGHT_MAID_DB;
  if (!db) return respond({ error: 'Community storage is not configured.' }, 503);

  const url = new URL(context.request.url);
  const scope = url.searchParams.get('scope');
  const currentVisitor = visitorId(url.searchParams.get('visitor'));

  if (scope === 'guestbook') return respond({ entries: await guestbook(db, currentVisitor) });
  if (scope === 'record') {
    const id = recordId(url.searchParams.get('record'));
    if (!id) return respond({ error: 'Invalid record.' }, 400);
    return respond(await recordCommunity(db, id));
  }
  return respond({ error: 'Unknown scope.' }, 400);
}

export async function onRequestPost(context) {
  const db = context.env.NIGHT_MAID_DB;
  if (!db) return respond({ error: 'Community storage is not configured.' }, 503);

  const body = await requestBody(context.request);
  if (!body || typeof body !== 'object') return respond({ error: 'Invalid request body.' }, 400);
  const action = body.action;
  const currentVisitor = visitorId(body.visitor);
  if (!currentVisitor) return respond({ error: 'Invalid visitor.' }, 400);
  const now = Date.now();

  if (action === 'guestbook:create') {
    const message = text(body.message, 800);
    if (!message) return respond({ error: 'Message is required.' }, 400);
    await db.prepare('INSERT INTO guestbook_entries (id, body, visitor_id, created_at) VALUES (?, ?, ?, ?)')
      .bind(crypto.randomUUID(), message, currentVisitor, now).run();
    return respond({ entries: await guestbook(db, currentVisitor) }, 201);
  }

  if (action === 'guestbook:like') {
    const id = visitorId(body.id);
    if (!id || !await entryExists(db, id)) return respond({ error: 'Unknown entry.' }, 404);
    const existing = await db.prepare('SELECT entry_id FROM guestbook_likes WHERE entry_id = ? AND visitor_id = ?')
      .bind(id, currentVisitor).first();
    if (existing) await db.prepare('DELETE FROM guestbook_likes WHERE entry_id = ? AND visitor_id = ?').bind(id, currentVisitor).run();
    else await db.prepare('INSERT INTO guestbook_likes (entry_id, visitor_id, created_at) VALUES (?, ?, ?)').bind(id, currentVisitor, now).run();
    return respond({ entries: await guestbook(db, currentVisitor) });
  }

  if (action === 'guestbook:reply') {
    const id = visitorId(body.id);
    const message = text(body.message, 300);
    if (!id || !await entryExists(db, id)) return respond({ error: 'Unknown entry.' }, 404);
    if (!message) return respond({ error: 'Reply is required.' }, 400);
    await db.prepare('INSERT INTO guestbook_replies (id, entry_id, body, visitor_id, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(crypto.randomUUID(), id, message, currentVisitor, now).run();
    return respond({ entries: await guestbook(db, currentVisitor) }, 201);
  }

  if (action === 'record:comment') {
    const id = recordId(body.record);
    const message = text(body.message, 500);
    if (!id || !message) return respond({ error: 'Record and comment are required.' }, 400);
    await db.prepare('INSERT INTO record_comments (id, record_id, body, visitor_id, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(crypto.randomUUID(), id, message, currentVisitor, now).run();
    return respond(await recordCommunity(db, id), 201);
  }

  if (action === 'record:rating') {
    const id = recordId(body.record);
    const rating = Number(body.rating);
    if (!id || !Number.isInteger(rating) || rating < 0 || rating > 5) return respond({ error: 'Invalid rating.' }, 400);
    if (rating === 0) {
      await db.prepare('DELETE FROM record_ratings WHERE record_id = ? AND visitor_id = ?').bind(id, currentVisitor).run();
    } else {
      await db.prepare(`
        INSERT INTO record_ratings (record_id, visitor_id, rating, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(record_id, visitor_id) DO UPDATE SET rating = excluded.rating, updated_at = excluded.updated_at
      `).bind(id, currentVisitor, rating, now).run();
    }
    return respond(await recordCommunity(db, id));
  }

  return respond({ error: 'Unknown action.' }, 400);
}
