const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGO_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log(`connected to MongoDB ${result}`)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength:3,
  },
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)