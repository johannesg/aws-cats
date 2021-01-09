module.exports = {
  siteMetadata: {
    title: "My favourite Cats",
  },
  // flags: { PRESERVE_WEBPACK_CACHE: true },
  plugins: [
    'amplify',
    'top-layout',
    {
      resolve: 'gatsby-plugin-material-ui',
      // If you want to use styled components you should change the injection order.
      options: {
        // stylesProvider: {
        //   injectFirst: true,
        // },
      },
    },
    // If you want to use styled components you should add the plugin here.
    // 'gatsby-plugin-styled-components',
    'gatsby-plugin-react-helmet',
  ],
};
