import React from 'react';
import Stateful from './lib';

import removeTodo from './actions/removeTodo';
import addTodo from './actions/addTodo';
import inputChanged from './actions/inputChanged';

function App(props) {
  console.log(props.singleStore);

  return (
    <div>
      <input type="text" value={props.singleStore.input} onChange={props.singleStore.inputChanged} />
      <button onClick={() => {
        props.singleStore.addTodo(props.singleStore.input);
      }}>
        Click Me
      </button>
      <hr />
      {props.singleStore.todos.map(todo =>
        <div key={todo.id}>
          <p>{todo.todo}</p>
          <button onClick={props.singleStore.removeTodo(todo.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default Stateful(
  App,
  {
    todos: [],
    input: ''
  },
  {
    removeTodo,
    addTodo,
    inputChanged
  }
);
