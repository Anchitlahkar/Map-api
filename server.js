const express = require('express')
const bodyParser = require('body-parser')
const api = express();
api.set("view engine", "ejs");

let route, pos

api.use(express.static('public'))
api.use(bodyParser.json())

api.listen(process.env.PORT || 3000, () => {
  console.log('Api Running')
})

api.get("/", (req, res) => {
  res.render("index")
})

api.get("/api", (req, res) => {
  res.send(route)
})

api.get("/locationPage", (req, res) => {
  res.render("locationPage")
})

api.post("/get-location", (req, res) => {
  console.log(req.body)
  pos = req.body
})

api.get("/take-location",(req,res)=>{
  res.send(pos)
})


api.post('/location-details', (req, res) => {
  console.log(req.body)
  route = req.body
})

api.get('/remove-details', (req, res)=>{
  route = ""
  pos = ""
  res.send("Reset Details....")
})


