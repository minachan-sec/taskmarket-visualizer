#!/bin/sh
# Build the single-file bundle used for API deploys (wrangler deploy does not need it).
set -e
mkdir -p dist
python3 - << 'PYEOF'
og = open('og.js').read().replace('export const OG_PNG_BASE64', 'const OG_PNG_BASE64')
page = open('page.js').read().replace('export const HTML', 'const HTML')
worker = open('worker.js').read()
worker = '\n'.join(l for l in worker.split('\n') if not l.startswith('import '))
open('dist/worker.js', 'w').write(og + '\n' + page + '\n' + worker)
print('dist/worker.js written')
PYEOF
