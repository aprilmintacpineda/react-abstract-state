import React from 'react';
import stateful from '../../lib';

import state from './state';

import removeTodo from './actions/removeTodo';
import addTodo from './actions/addTodo';
import inputChanged from './actions/inputChanged';

function Todos(props) {
  console.log(props);

  return (
    <div>
      <input type="text" value={props.input} onChange={props.inputChanged} />
      <button onClick={props.addTodo}>
        Add todo
      </button>
      <hr />
      {props.todos.map(todo =>
        <div key={todo.id}>
          <p>{todo.todo}</p>
          <button onClick={props.removeTodo(todo.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default stateful(
  Todos,
  state,
  {
    removeTodo,
    addTodo,
    inputChanged
  }
);
