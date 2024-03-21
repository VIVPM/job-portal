// firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('../job-portal-4e7b4-firebase-adminsdk-jqruf-740e19ab0a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://job-portal-4e7b4.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
