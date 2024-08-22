const express = require('express')
const { connectToDb } = require('./db');
const { User } = require('./schema');
const app = express()
const port = 3000

connectToDb();

const initDb = async () => {
    await User.findOne({})
}
initDb()

app.get('/',async  (req, res) => {
  res.send('Hello World!')
 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

})