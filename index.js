const express = require("express")
const app = express()
//const PORT = 3001
app.use(express.json())
const cors = require('cors')
app.use(cors())

const morgan = require(`morgan`)
app.use(morgan(`tiny`))

morgan.token(`body`, function (req, res) {
  return `${JSON.stringify(req.body)}`
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1,
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2,
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3,
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4,
    }
]

app.get("/api/persons",(req, res) => {
    res.json(persons)
}) 

app.get("/info",(req, res,) => {
  const currentDate = new Date()
  res.send(`<h2>Phonebook has info for ${persons.length} people</h2> <h2>${currentDate}</h2>`)
}) 

app.get("/api/persons/:id",(req, res) => {
  const id = req.params.id
  const entry = persons.find(entry => entry. id == id)

  if(entry){
      res.json(entry)
  } else {
      res.status(404).end()   
  }
}) 

app.delete("/api/persons/:id",(req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(entry => entry.id != id)
  res.status(204).end();
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.post("/api/persons", (req,res) => {
  const body = req.body

  if(!body.name){
    return res.status(400).json({eror: "name is missing"})
  }

  if(!body.number){
    return res.status(400).json({eror: "number is missing"})
  }

  if(persons.some(entry => entry.name === body.name)){
    return res.status(409).json({eror: "name must be unique"})
  }


  let entry = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  
  persons.push(entry)
  res.json(entry)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port jeppis ${PORT}`)
})