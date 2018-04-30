const express =require ('express');
const bodyParser= require('body-parser')
const app =express();
const MongoClient = require('mongodb').MongoClient
app.set('view engine', 'ejs')

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












