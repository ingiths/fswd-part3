const Message = ({ message }) => {
  if (message === null) {
    return null;
  }

  const { success, content } = message;

  const successStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  const errorStyle = {
    ...successStyle,
    color: "red",
  };

  const style = success ? successStyle : errorStyle;

  return (
    <div style={style}>
      <p>{content}</p>
    </div>
  );
};

export default Message;
