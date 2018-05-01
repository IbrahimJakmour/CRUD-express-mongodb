const express =require ('express');   //run express
const bodyParser= require('body-parser')  //to get the inputs
const app =express();  //run express
const MongoClient = require('mongodb').MongoClient
app.set('view engine', 'ejs');
app.use(express.static('public')); //to let express read from public
app.use(bodyParser.json()) // to let express read json


var db

MongoClient.connect('mongodb://star-wars-quotes:123456@ds161939.mlab.com:61939/star-wars-quotes', (err, client) => {
  if (err) return console.log(err)
  db = client.db('star-wars-quotes') 
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.use(bodyParser.urlencoded({extended: true}))

/*app.get('/', (req, res) => {
  res.send('Hello World')
})
*/

app.get('/', (req, res) => {
  var cursor = db.collection('quotes').find()
  cursor.toArray(function(err, results) {
if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: results})
  })
})


app.get('/',(req,res)=>{
  res.sendFile(__dirname +'/index.html')
})

/*app.post('/quotes', (req, res) => {
  console.log(req.body)
})*/

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name}, 
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vader quote got deleted')
  })
})


/*db.collections('quotes').findOneAndUpdate(
  query, 
  update, 
  options,
  callback
)
*/

/*
db.collections('quotes').findOneAndDelete(
  query, 
  options,
  callback
)
*/







