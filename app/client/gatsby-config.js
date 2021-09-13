require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: "My favourite Cats",
  },
  // flags: { PRESERVE_WEBPACK_CACHE: true },
  plugins: [
    {
      resolve: 'amplify',
      options: {
        region: process.env.AWS_REGION,
        userPoolId: process.env.AWS_USER_POOL_ID,
        userPoolWebClientId: process.env.AWS_USER_POOL_CLIENTID
      }
    },
    {
      resolve: 'apollo',
      options: {
        baseUrl: process.env.APOLLO_BASEURL
      }
    },
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
