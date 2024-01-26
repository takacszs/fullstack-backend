const mongoose = require("mongoose");
require("dotenv").config()

const url = process.env.MONGO_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength:3,
  },
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }


// const name=process.argv[3]
// const number=process.argv[4]

// if (!name && !number) {
//   //list
//   Person.find({}).then((result) => {
//     console.log("Phonebook:")
//     result.forEach((person) => {
//       console.log(`${person.name} ${person.number}`);
//     });
//     mongoose.connection.close();
//   });
// } else if (name && number) {
//   const person = new Person({
//     id: getRandomInt(9999),
//     name: name,
//     number: number,
//   });
//   person.save().then((result) => {
//     console.log(result);
//     console.log("person saved!");
//     mongoose.connection.close();
//   });
// } else {
//   console.log("name or number is missing");
//   process.exit(1);
// }
