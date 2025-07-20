import { build } from 'esbuild';
import { readdirSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

const srcDir = resolve('src/js');
const outDir = resolve('public/js');

mkdirSync(outDir, { recursive: true });

function buildAll(watch = false) {
  const files = readdirSync(srcDir).filter(f => f.endsWith('.js'));
  return Promise.all(files.map(file =>
    build({
      entryPoints: [join(srcDir, file)],
      bundle: true,
      format: 'esm',
      minify: true,
      outfile: join(outDir, file),
      watch,
    }).then(() => console.log(`Built ${file}`))
  ));
}

buildAll(true); // true = watch mode
