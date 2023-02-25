const express = require("express");
const app = express();
app.use(express.json());

const Person = require("./person");

const people = [
  new Person(1, "Alice", 25),
  new Person(2, "Bob", 30),
  new Person(3, "Charlie", 35),
];

app.use(express.json());

function validatePerson(req, res, next) {
    const { name, age } = req.body;
    if (!name || !age) {
    return res.status(400).send('Name and age are required');
    }
    if (typeof name !== 'string' || typeof age !== 'number') {
    return res.status(400).send('Name must be a string and age must be a number');
    }
    next();
    }

app.get('/people', (req, res) => {
  res.json(people);
});

app.get('/people/:id', (req, res) => {
  const personId = req.params.id;
  const person = people.find(person => person.id == personId);
  
  if (!person) {
    res.status(404).send('Person not found.');
  } else {
    res.json(person);
  }
});

app.post('/people', validatePerson,(req, res) => {
  const { id, name, age } = req.body;

  if (!name) {
    res.status(400).send('Name is required.');
    return;
  }
  if (!/^[a-zA-Z]+$/.test(name)) {
    res.status(400).send('Name must contain only letters.');
    return;
  }

  if (!age) {
    res.status(400).send('Age is required.');
    return;
  }
  if (age < 0) {
    res.status(400).send('Age cannot be negative.');
    return;
  }

  const person = new Person(id, name, age);
  
  people.push(person);
  
  res.json(person);
});

app.put('/people/:id', (req, res) => {
  const personId = req.params.id;

  const person = people.find(person => person.id == personId);
  
  if (!person) {
    res.status(404).send('Person not found.');
  } else {
    const { name, age } = req.body;

    if (!name) {
      res.status(400).send('Name is required.');
      return;
    }
    if (!/^[a-zA-Z]+$/.test(name)) {
      res.status(400).send('Name must contain only letters.');
      return;
    }
    
    if (!age) {
      res.status(400).send('Age is required.');
      return;
    }
    if (age < 0) {
      res.status(400).send('Age cannot be negative.');
      return;
    }
      
    person.name = name || person.name;
    person.age = age || person.age;
    
    res.json(person);
  }
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