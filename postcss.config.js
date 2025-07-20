module.exports = {
  plugins: [
    require('postcss-import'),
    require('autoprefixer'),
    ...(process.env.ELEVENTY_ENV === 'production'
      ? [require('cssnano')({ preset: 'default' })]
      : [])
  ]
};
