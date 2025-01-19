const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passportConfig = require('./lib/passportConfig');
const cors = require('cors');
const pdf = require('html-pdf');
const fs = require('fs');
const pdfTemplate = require('./documents');
require('dotenv').config();
const functions = require('firebase-functions');

// MongoDB
mongoose
  .connect(process.env.mongo_url
    // ,{
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false
  // }
  )
  .then((res) => console.log('Connected to DB'))
  .catch((err) => console.log(err));

// initialising directories
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}
if (!fs.existsSync('./public/resume')) {
  fs.mkdirSync('./public/resume');
}
if (!fs.existsSync('./public/profile')) {
  fs.mkdirSync('./public/profile');
}

const app = express();
const port = process.env.port || 4444;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/', express.static('/build'))

// Setting up middlewares
// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,            //access-control-allow-credentials:true
//   optionSuccessStatus: 200
// }
app.use(cors({ origin: true }));
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use('/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/apiRoutes'));
app.use('/upload', require('./routes/uploadRoutes'));
app.use('/host', require('./routes/downloadRoutes'));

exports.api = functions.https.onRequest(app);

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
