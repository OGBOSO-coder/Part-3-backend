const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))
const mongoose = require('mongoose')
const morgan = require('morgan')
app.use(morgan('tiny'))

require('dotenv').config()
const Person = require('./models/person')

morgan.token('body', function (req, res) {
	return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/api/persons',(req, res) => {
	Person.find({}).then(Persons => {
		res.json(Persons)
	})
}) 

app.get('/info',(req, res,) => {
	const currentDate = new Date()
	res.send(`<h2>Phonebook has info for ${Persons.length} people</h2> <h2>${currentDate}</h2>`)
}) 

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
}) 

app.delete('/api/persons/:id',(request, response) => {
	Person
		.findByIdAndDelete(request.params.id)
		.then(result => {
			response.json(result).status(204)
		})
		.catch(error => next(error))
})

const generateId = () => {
	const maxId = Persons.length > 0
		? Math.max(...Persons.map(n => n.id))
		: 0
	return maxId + 1
}

app.post('/api/persons', (request, response, next) => {
	const body = request.body

	if (!body.name) {
		return response.status(400).json({
			error: 'name not specified'
		})
	}

	if (!body.number) {
		return response.status(400).json({
			error: 'number not specified'
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person
		.save().then(savedPerson => {
			response.json(savedPerson)
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person
		.findByIdAndUpdate(request.params.id, person, { new: true })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})