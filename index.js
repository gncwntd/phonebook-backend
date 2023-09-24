require('dotenv').config()
const express = require("express");
const app = express();
const cors = require('cors')
const morgan = require("morgan")

const Person = require('./models/person')

morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method  :url  :status - :body'))


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


app.use(cors())
app.use(express.json())
app.use(express.static('build'))




app.get("/api/persons",(request,response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
app.get("/info",(request,response)=>{
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <br/> ${Date()}`)
  })  
})


app.get("/api/persons/:id",(request, response, next) => {
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


app.delete("/api/persons/:id",(request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedperson => {
      response.json(updatedperson)
    })
    .catch(error => next(error))
})


// const generateId = () => {
//     const maxId = persons.length > 0
//       ? Math.max(...persons.map(n => n.id))
//       : 0
//     return maxId + 1
//   }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    const persons =   Person.find({})
  
    console.log(persons)
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number 
      // id: generateId(),
    }
 
    if(body.name === persons.name){
      return response.status(400).json({
        error:"Name must be unique!"
      })
    }
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT);
console.log(`Server running on port ${PORT}`);





// app.get("/api/persons",(request,response)=>{
//   response.json(persons)
// })
// app.get("/info",(request,response)=>{
//   response.send(`<p>Phonebook has info for ${persons.length} people</p> <br/> ${Date()}`)
// })


// app.get("/api/persons/:id",(request,response)=>{
//   const id = Number(request.params.id)
//   const person = persons.find(person => person.id === id)
//   if(person){
//       response.json(person)
//   }else{
//       response.status(404).end()
//   }
// })


// app.delete("/api/persons/:id",(request,response)=> {
//   const id = Number(request.params.id);
//   persons = persons.filter((person) => person.id !== id);

//   response.status(204).end();
// })

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// app.post('/api/persons', (request, response) => {
//   const body = request.body

//   if (!body.name) {
//     return response.status(400).json({ 
//       error: 'name missing' 
//     })
//   }
//   if (!body.number) {
//     return response.status(400).json({ 
//       error: 'number missing' 
//     })
//   }

//   const person = {
//     name: body.name,
//     number: body.number ,
//     id: generateId(),
//   }

//   persons = persons.concat(person)
//   console.log(persons.name)
//   if(body.name === persons.name){
//     return response.status(400).json({
//       error:"Name must be unique!"
//     })
//   }
//   response.json(person)
// })