const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const sauceRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv/config');

console.log(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_COLL}`)
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_COLL}`,
   { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex:true }
  )

  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

//middleware
app.use(cors());

app.use(helmet());

app.use(bodyParser.json());

app.use(express.static(__dirname + '/dist'));

app.get('/web/*', function(req,res) {      
  res.sendFile(path.join(__dirname+'/dist/index.html'))
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);

 
module.exports = app;