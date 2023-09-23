const mongoose = require("mongoose");
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://phonebookbackend:${password}@emregenc.v9hrw9e.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});
console.log(process.argv[1].type)
person.save().then((result) => {
  if (process.argv[2] === undefined) {
    Person.find({}).then((result) => {
      result.forEach((person) => {
        console.log(person);
      });
      mongoose.connection.close();
    });
  }
  else{
    console.log((`added ${person.name} number ${person.number} to phonebook!`));
  mongoose.connection.close();}
});

// Person.find({}).then((result) => {
//   result.forEach((person) => {
//     console.log(person);
//   });
//   mongoose.connection.close();
// });
