import React from 'react';
import stateful from '../../lib';

import state from './state';

import removeTodo from './actions/removeTodo';
import addTodo from './actions/addTodo';
import inputChanged from './actions/inputChanged';

function Todos(props) {
  console.log(props.singleStore);

  return (
    <div>
      <input type="text" value={props.singleStore.input} onChange={props.singleStore.inputChanged} />
      <button onClick={props.singleStore.addTodo}>
        Add todo
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

export default stateful(
  Todos,
  state,
  {
    removeTodo,
    addTodo,
    inputChanged
  }
);
