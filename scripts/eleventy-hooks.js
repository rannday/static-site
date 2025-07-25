import esbuild from 'esbuild';

export async function buildCSS(isWatch) {
  const ctx = await esbuild.context({
    entryPoints: [
      'src/css/highlight.css',
      'src/css/highlight-light.css',
      'src/css/highlight-dark.css',
    ],
    bundle: true,
    outdir: 'public/css',
    minify: !isWatch,
  });

  if (isWatch) {
    await ctx.rebuild();
    ctx.dispose();
  } else {
    await ctx.rebuild();
    ctx.dispose();
  }
}

export async function buildJS(isWatch) {
  const ctx = await esbuild.context({
    entryPoints: [
      'src/js/search.js',
      'src/js/highlight.js'
    ],
    bundle: true,
    outdir: 'public/js',
    minify: !isWatch,
  });

  if (isWatch) {
    await ctx.rebuild();
    ctx.dispose();
  } else {
    await ctx.rebuild();
    ctx.dispose();
  }
}
