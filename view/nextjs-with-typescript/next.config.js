/** @type {import('next').NextConfig} */
const withLinaria = require('next-linaria');
module.exports = withLinaria({
  reactStrictMode: true
  // webpack: (config, options) => {
  //   config.module.rules.push({
  //     test: /\.mdx/,
  //     use: [
  //       options.defaultLoaders.babel,
  //       {
  //         loader: '@mdx-js/loader',
  //         options: pluginOptions.options
  //       }
  //     ]
  //   });

  //   return config;
  // }
});
