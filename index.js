const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorHandler")
const Person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

// custom token for the request body
morgan.token("reqBody", (req) => {
  if (req.method === "POST") return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqBody"
  )
);

// let persons = [{
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/info", (request, response) => {
  Person.find({}).then((collection) => {
    response.send(
      `<p>The phonebook has ${collection.length} numbers</p>
      <p>${new Date()}<p>`
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      // If next was called without a parameter, then the execution would simply move onto the next route or middleware.
      // If the next function is called with a parameter, then the execution will continue to the error handler middleware.
      // next must be a param
      next(error)
    });
});

app.delete("/api/persons/:id", (request, response) => {
  const idToDelete = request.params.id;
  Person.findByIdAndDelete(idToDelete)
    .then((result) => {
      response.json(result);
      response.status(204).end();
    })
    .catch((error) => console.log(error));
});

app.post("/api/persons/", (request, response, next) => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  let body = request.body;
  const personToAdd = new Person({
    name: body.name,
    number: body.number,
  });

  personToAdd.save().then((savedPerson) => {
    response.json(savedPerson);
    console.log("savedPerson :>> ", savedPerson);
  }).catch(error=>next(error));
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler)