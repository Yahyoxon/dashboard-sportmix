import React, { useState } from "react";
function TodoForm(props) {
  const [characterName, setCharacterName] = useState("");
  const [characterValue, setCharacterValue] = useState("");
 

  const handleSubmitCharacter = (e) => {
    e.preventDefault();

    props.onSubmit({
      id: Math.floor(Math.random() * 10000),
      textName: characterName,
      textValue: characterValue
    });
    setCharacterName("");
    setCharacterValue("")
  };
  return (
    <>
      <form onSubmit={handleSubmitCharacter} className="todo-form">
        <input
          type="text"
          placeholder={props.name}
          value={characterName}
          name="textName"
          className="todo-input"
          onChange={(e)=>setCharacterName(e.target.value)}
        />
          <input
          type="text"
          placeholder={props.value}
          value={characterValue}
          name="textValue"
          className="todo-input"
          onChange={(e)=>setCharacterValue(e.target.value)}
        />
        <button onClick={handleSubmitCharacter} className="todo-button">
        {props.add}
        </button>
      </form>
    </>
  );
}

export default TodoForm;
