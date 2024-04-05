const Person = ({ person, deleteCallback }) => {
  return (
      <p>
        {person.name} {person.number}{" "}
        <button type="submit" onClick={deleteCallback}>Delete?</button>
      </p>
  );
};

export default Person;
