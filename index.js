const express = require("express");
const cors = require("cors")
const morgan = require("morgan")
const app = express();

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
// custom token for the request body
morgan.token('reqBody', (req) => {
  if (req.method === "POST") return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

let persons = [{
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  response.send(
    `<p>The phonebook has ${persons.length} numbers</p>
     <p>${new Date()}<p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const thePerson = persons.find((person) => person.id === id)
  if (thePerson) {
    response.json(thePerson);
    response.status(200).end()
  } else response.status(404).end()
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const thePerson = persons.find((person) => person.id === id)
  persons = persons.filter(person => person != thePerson )
  response.json(thePerson)
  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  let body = request.body
  if (persons.find((person) => person.name === body.name)) {
    response.json({
      error: "name already exists"
    })
    response.status(400).end()
  } else if (!body.number) {
    response.json({
      error: "number is missing"
    })
    response.status(400).end()
  } else if (!body.name) {
    response.json({
      error: "name is missing"
    })
    response.status(400).end()
  } else {
    const newPerson = {
      id: getRandomInt(9999),
      name: body.name,
      number: body.number,
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
    response.status(204).end()
  }
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});