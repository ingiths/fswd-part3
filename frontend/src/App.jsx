import { useState, useEffect } from "react";

import Filter from "./components/Filter";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";
import Message from "./components/Message";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then((personsReturned) => setPersons(personsReturned));
  }, []);

  const personsToShow =
    filter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  const addPerson = (event) => {
    event.preventDefault();

    const person = persons.find((person) => person.name === newName);

    if (
      person &&
      !window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      )
    ) {
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    if (person) {
      personService
        .updatePerson(person.id, newPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : returnedPerson))
          );
          setNewName("");
          setNewNumber("");
          setMessage({
            success: true,
            content: `Updated ${returnedPerson.name}`,
          });
          setTimeout(() => setMessage(null), 5000);
        })
        .catch((error) => {
          setMessage({
            success: false,
            content: `Information of ${newPerson.name} has already been removed from the server`,
          });
          setTimeout(() => setMessage(null), 5000);
        });
    } else {
      personService
        .createPerson(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
          setMessage({
            success: true,
            content: `Added ${newPerson.name}`,
          });

          setTimeout(() => setMessage(null), 5000);
        })
        .catch((error) => {
          setMessage({
            success: false,
            content: `Failed to created ${returnedPerson.name}`,
          });
          setTimeout(() => setMessage(null), 5000);
        });
    }
  };

  const deletePerson = (person) => {
    const confirmation = window.confirm(`Delete ${person.name}`);
    if (!confirmation) {
      return;
    }
    personService
      .deletePerson(person.id)
      .then((_) => setPersons(persons.filter((p) => p.id !== person.id)))
      .catch((error) => {
        alert(`Something went wrong when deleting '${person.name}': ${error}`);
      });
  };

  const handleFilter = (event) => setFilter(event.target.value);

  const handleNameChange = (event) => setNewName(event.target.value);

  const handleNumberChange = (event) => setNewNumber(event.target.value);

  return (
    <div>
      <h2>Phonebook</h2>

      <Message message={message}/>

      <Filter filter={filter} onChangeHandler={handleFilter} />

      <h3>add a new </h3>
      <PersonForm
        name={newName}
        onChangeName={handleNameChange}
        number={newNumber}
        onChangeNumber={handleNumberChange}
        onSubmit={addPerson}
      />

      <h2>Numbers</h2>
      {personsToShow.map((person) => {
        return (
          <Person
            key={person.name}
            person={person}
            deleteCallback={() => deletePerson(person)}
          />
        );
      })}
    </div>
  );
};

export default App;
