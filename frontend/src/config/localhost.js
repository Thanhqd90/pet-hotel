const firebaseConfig = {
  apiKey: "AIzaSyC9Z0z47OpYs3PMMkhY7BXZH5aoWuqP7ag",
  authDomain: "pet-hotel-ab507.firebaseapp.com",
  databaseURL: "https://pet-hotel-ab507.firebaseio.com",
  projectId: "pet-hotel-ab507",
  storageBucket: "pet-hotel-ab507.appspot.com",
  messagingSenderId: "305427123152",
  appId: "1:305427123152:web:6e392809d7f7536c"
};

// Cloud Functions
// const backendUrl = `http://localhost:5000/${
//   firebaseConfig.projectId
// }/us-central1/api/graphql`;

// App Engine / Debug
const backendUrl = `http://localhost:8080`;

export default {
  firebaseConfig,
  backendUrl,
};
