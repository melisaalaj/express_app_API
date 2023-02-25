const express = require("express");
const app = express();
app.use(express.json());

const Person = require("./person");

const people = [
  new Person(1, "Alice", 25),
  new Person(2, "Bob", 30),
  new Person(3, "Charlie", 35),
];

// endpoint qe kthen te gjithe personat
app.get("/people", (req, res) => {
    console.log(res.json(people));
});

// endpoint qe kthen personin permes parametrit id
app.put('/people/:id', (req, res) => {
  const personId = req.params.id;
  const person = people.find(person => person.id == personId);
  
  if (!person) {
    res.status(404).send('Person not found.');
  } else {
    const { name, age } = req.body;
    
    person.name = name || person.name;
    person.age = age || person.age;
    
    res.json(person);
  }
});

app.post('/people', (req, res) => {
  const { id, name, age } = req.body;

  if(/\d/.test(name)) {
    return res.status(400).send('Emri duhet me permbajte vetem shkronja.');
  }
  
  if(age < 0) {
    return res.status(400).send('Mosha nuk duhet me qene negative.');
  }
  
  const person = new Person(id, name, age);
  
  people.push(person);
  
  res.json(person);
});


app.delete('/people/:id', (req, res) => {
  const personId = req.params.id;
  const personIndex = people.findIndex(person => person.id == personId);
  
  if (personIndex === -1) {
    res.status(404).send('Person not found.');
  } else {
    const deletedPerson = people.splice(personIndex, 1)[0];
    
    res.json(deletedPerson);
  }
});


app.listen(3000, () => {
  console.log("Server started on port 3000");
});