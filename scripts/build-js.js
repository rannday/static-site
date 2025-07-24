import esbuild from 'esbuild';

const isWatching = process.argv.includes('--watch');

const ctx = await esbuild.context({
  entryPoints: ['src/js/highlight.js'],
  bundle: true,
  outdir: 'public/js',
  minify: !isWatching,
});

if (isWatching) {
  console.log('Watching Javascript...');
  await ctx.watch();
} else {
  console.log('Building Javascript...');
  await ctx.rebuild();
  ctx.dispose();
}
