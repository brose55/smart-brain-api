const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

// (req, res) gets automatically passed as the parameters of the second callback
// in the corresponding ./controllers/ file therefore do not need to be explicitly
// injected into the 'handle' functions.
// NOTE: I just think it looks cleaner
app.get('/', (req, res) => { res.send(db.users) })
app.post('/signin', signIn.handleSignIn(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))
app.put('/image', image.handleImage(db))
app.post('/imageUrl', (req, res) => { image.handleApiCall(req, res) })

app.listen(process.env.PORT || 8000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
})
