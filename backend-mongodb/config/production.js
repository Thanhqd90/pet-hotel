module.exports = {
  env: 'production',

  database: {
    connection: '<insert connection url here>',
    transactions: true,
  },

  email: {
    comment: 'See https://nodemailer.com',
    host: null,
    auth: {
      user: null,
      pass: null,
    },
  },

  graphiql: false,

  project: {
    name: 'app.title',
    clientUrl:
      'https://<insert project id here>.firebaseapp.com',
  },

  defaultUser: null,
};
