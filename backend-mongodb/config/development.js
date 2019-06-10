module.exports = {
  env: 'development',

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

  graphiql: 'true',

  project: {
    name: 'Pet Hotel',
    clientUrl:
      'https://pet-hotel-ab507.firebaseapp.com',
  },

  defaultUser: 'thanhqd1990@gmail.com',
};
