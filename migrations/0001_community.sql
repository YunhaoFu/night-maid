CREATE TABLE IF NOT EXISTS guestbook_entries (
  id TEXT PRIMARY KEY,
  body TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  hidden INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS guestbook_likes (
  entry_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (entry_id, visitor_id)
);

CREATE TABLE IF NOT EXISTS guestbook_replies (
  id TEXT PRIMARY KEY,
  entry_id TEXT NOT NULL,
  body TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  hidden INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS record_comments (
  id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL,
  body TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  hidden INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS record_ratings (
  record_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (record_id, visitor_id)
);

CREATE INDEX IF NOT EXISTS guestbook_entries_created_at ON guestbook_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS guestbook_replies_entry_id ON guestbook_replies (entry_id, created_at);
CREATE INDEX IF NOT EXISTS record_comments_record_id ON record_comments (record_id, created_at DESC);
CREATE INDEX IF NOT EXISTS record_ratings_record_id ON record_ratings (record_id);
