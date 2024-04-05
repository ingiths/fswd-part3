const Filter = ({ filter, onChangeHandler }) => {
  return (
    <>
      filter shown with{" "}
      <input value={filter} onChange={onChangeHandler}></input>
    </>
  );
};

export default Filter;