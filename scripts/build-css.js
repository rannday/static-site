import esbuild from 'esbuild';

const isWatching = process.argv.includes('--watch');

const ctx = await esbuild.context({
  entryPoints: [
    'src/css/highlight.css',
    'src/css/highlight-light.css',
    'src/css/highlight-dark.css',
  ],
  bundle: true,
  outdir: 'public/css',
  minify: !isWatching,
});

if (isWatching) {
  console.log('Watching CSS...');
  await ctx.watch();
} else {
  console.log('Building CSS...');
  await ctx.rebuild();
  ctx.dispose();
}
