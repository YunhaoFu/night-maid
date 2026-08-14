import fs from 'node:fs';
import vm from 'node:vm';

function loadWindowScript(path, key) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path, 'utf8'), sandbox, { filename: path });
  return sandbox.window[key];
}

const records = loadWindowScript('data/catalogue.js', 'NIGHT_INDEX_RECORDS');
const covers = loadWindowScript('data/covers.js', 'NIGHT_INDEX_COVERS');
const types = new Set(['film', 'series', 'anime', 'book', 'manga', 'game']);

if (records.length !== 80) throw new Error(`Expected 80 records, found ${records.length}`);
if (new Set(records.map(record => record.id)).size !== records.length) throw new Error('Record IDs must be unique');

for (const record of records) {
  if (!types.has(record.type)) throw new Error(`Unknown type for ${record.id}`);
  if (!record.title || !record.original || !record.year || !record.score || !record.summary) throw new Error(`Incomplete record: ${record.id}`);
  if (!covers[record.id]?.src?.startsWith('https://')) throw new Error(`Missing HTTPS cover for ${record.id}`);
}

if (Object.keys(covers).length !== records.length) throw new Error('Cover manifest and record count differ');
console.log(`Validated ${records.length} records and ${Object.keys(covers).length} cover entries.`);
