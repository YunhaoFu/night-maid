import fs from 'node:fs';

const output = new URL('../dist/', import.meta.url);

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
fs.copyFileSync(new URL('../index.html', import.meta.url), new URL('index.html', output));
fs.copyFileSync(new URL('../404.html', import.meta.url), new URL('404.html', output));
fs.copyFileSync(new URL('../credits.html', import.meta.url), new URL('credits.html', output));
fs.copyFileSync(new URL('../_routes.json', import.meta.url), new URL('_routes.json', output));
fs.cpSync(new URL('../assets/', import.meta.url), new URL('assets/', output), { recursive: true });
fs.cpSync(new URL('../data/', import.meta.url), new URL('data/', output), { recursive: true });

console.log(`Built static site in ${output.pathname}`);
