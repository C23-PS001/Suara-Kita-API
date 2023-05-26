require('dotenv/config');
const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(fileUpload());

require('./user/routes/user.routes')(app)

app.get('/', (req, res) => {
  res.status(200).send("<h1>Welcome to Suara Kita API</h1>");
})

const PORT = process.env.PORT || 8090
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`)
})
