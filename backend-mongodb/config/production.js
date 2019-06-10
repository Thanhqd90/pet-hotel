module.exports = {
  env: 'production',

  database: {
    connection: 'mongodb://thanh:thanh123@ds235197.mlab.com:35197/pet-hotel',
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
    name: 'Pet Hotel',
    clientUrl:
      'https://pet-hotel-ab507.firebaseapp.com',
  },

  defaultUser: null,
};
