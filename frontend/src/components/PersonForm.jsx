const PersonForm = (props) => {
  return (
    <form>
      name: <input value={props.name} onChange={props.onChangeName} />
      <br />
      number <input value={props.number} onChange={props.onChangeNumber} />
      <div>
        <button type="submit" onClick={props.onSubmit}>
          add
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
