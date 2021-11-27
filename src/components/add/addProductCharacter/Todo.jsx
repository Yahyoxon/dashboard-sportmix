import { RiCloseCircleLine } from "react-icons/ri";

function Todo({ todos, removeTodo }) {
 
 
  return todos.map((todo, index) => (
    <div
      className="todo-row"
      key={index}
    >
      <div key={todo.id}>
        <div className="textName">{todo.textName}:</div> <div className="textValue">{todo.textValue}</div>
      </div>
      <div className="icons">
        <RiCloseCircleLine
          onClick={() => removeTodo(todo.id)}
          className="delete-icon"
        />
      </div>
    </div>
  ));
}

export default Todo;
