module.exports = {
  env: 'localhost',

  database: {
    // connection:
    //   'mongodb://localhost:27017,localhost:27018,localhost:27019/development?replicaSet=rs',
    // transactions: true,
    connection: 'mongodb://thanh:thanh123@ds235197.mlab.com:35197/pet-hotel',
    transactions: false,
  },

  email: {
    comment: 'See https://nodemailer.com',
    host: null,
    auth: {
      user: null,
      pass: null,
    },
  },

  graphiql: true,

  project: {
    name: 'app.title',
    clientUrl:
      'https://<insert project id here>.firebaseapp.com',
  },

  defaultUser: '<insert your email here>',
};
