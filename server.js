const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://ajassharaf:cybQA8RGfFTZZ@cluster0.ll1kd6g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true";

MongoClient.connect(uri, ({ useUnifiedTopology: true }))
  .then(client => {
    console.log('Connected to Database!!!')
    const db = client.db('star-wars-quotes')
    const quotesCollection = db.collection('quotes')
    app.set('view engine', 'ejs')

    // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.get('/', (req, res) => {
      quotesCollection
        .find()
        .toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results })
        })
        .catch(error => console.log(error))
    })
    app.post('/quotes', (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.log(error))
    })
    app.put('/quotes', (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: 'Yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          })
        .then(result => {
          res.json('Success')
        })
        .catch(error => console.error(error))
    })
    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT}`);
    })
  })
  .catch(error => console.error(error))