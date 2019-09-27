# react-abstract-state
A clean and simple approach to handling component level states.

Check out the `playground` for the sample app. You can also [see the sample project running](https://aprilmintacpineda.github.io/react-abstract-state).

# Install

`npm i -S react-abstract-state redefine-statics-js`
`yarn add react-abstract-state redefine-statics-js -S`

# Why?

#### The problem

You have one component that holds the state and the methods that handles state changes. This is okay, but as your state grows, the component tends to become longer and dirtier.

```jsx
import React from 'react';
import uuid from 'uuid';

export default class Todos extends React.Component {
  constructor () {
    this.state = {
      input: '',
      todos: []
    };
  }

  inputChanged = ev => {
    this.setState({
      ...this.state,
      input: ev.target.value
    });
  }

  addTodo = () => {
    this.setState({
      ...this.state,
      input: '',
      todos: this.state.todos.concat({
        id: uuid(),
        todo: this.state.input
      });
    });
  }

  removeTodo = targetTodoId => () => {
    this.setState({
      ...this.state,
      todos: this.state.todos.filter(todo => todo.id !== targetTodoId)
    });
  }

  render () {
    return (
      <div>
        <input type="text" value={this.state.input} onChange={this.inputChanged} />
        <button onClick={this.addTodo}>Add todo</button>
        <hr />
        {this.state.todos.map(todo =>
          <div key={todo.id}>
            <p>{todo.todo}</p>
            <button onClick={this.removeTodo(todo.id)}>Delete</button>
          </div>
        )}
      </div>
    );
  }
}
```

Or using hooks

```jsx
import React from 'react';

function Todos () {
  const [state, setState] = React.useState({
    input: '',
    todos: []
  });

  const addTodo = React.useCallback(targetTodoId => () => {
    setState({
      ...state,
      todos: state.todos.filter(todo => todo.id !== targetTodoId)
    });
  });

  const removeTodo = React.useCallback(() => {
    setState({
      ...state,
      input: '',
      todos: state.todos.concat({
        id: uuid(),
        todo: state.input
      });
    });
  });

  const inputChanged = React.useCallback(ev => {
    setState({
      ...state,
      input: ev.target.value
    });
  });

  return (
    <div>
      <input type="text" value={state.input} onChange={inputChanged} />
      <button onClick={addTodo}>Add todo</button>
      <hr />
      {state.todos.map(todo =>
        <div key={todo.id}>
          <p>{todo.todo}</p>
          <button onClick={removeTodo(todo.id)}>Delete</button>
        </div>
      )}
    </div>
  );
}
```

Either approach you use, it will become long and dirty.

#### The solution

A cleaner approach would be to to separate these things into `modules`. There are really 3 things in here, namely:

1. The state handlers which are functions that handles data changes and saving them to the state of the component.
2. The state itself, denoted by `this.state`.
3. The UI logic which is the `render` method of the component.

The file structure would be:

```
/ Todos
|-- index.js
|-- states.js
|-- actions
|   |-- addTodo.js
|   |-- removeTodo.js
|   |-- inputChanged.js
```

The `Todos` folder will serve as the component itself. The `Todos/index.js` is the main file. The `Todos/states.js` will be the file to export the state for this component. The `Todos/actions` folder will contain all the files that export all the action functions which will handle state changes.

**Todos/states.js**

```js
export default {
  input: '',
  todos: []
};
```

**Todos/index.js**

```jsx
import React from 'react';
import stateful from 'react-abstract-state';

// this component's state
import state from './state';

// the functions that handle state changes
import removeTodo from './actions/removeTodo';
import addTodo from './actions/addTodo';
import inputChanged from './actions/inputChanged';

function Todos(props) {
  console.log(props.singleStore);

  // now our component only needs to handle UI logic.
  // Everything else can be abstracted outside.
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

// this is the HOC that handles the abstraction for you,
// All the actions and states will be available on the component
// via props.singleStore
export default stateful(
  Todos, // the component
  state, // the states
  {
    removeTodo,
    addTodo,
    inputChanged
  } // the actions
);
```

**Todos/actions/addTodo.js**

```js
import uuid from 'uuid';

// actions will receive the current state as the first parameter
// and the setState callback as the second parameter.
// you use the setState the way you would use a regular this.setState
// inside a stateful component
export default (states, setState) => {
  setState({
    ...states,
    input: '',
    todos: states.todos.concat({
      id: uuid(),
      todo: states.input
    })
  });
};
```

**Todos/actions/inputChanged.js**

```js
export default  (states, setState, ev) => {
  setState({
    ...states,
    input: ev.target.value
  });
};
```

**Todos/actions/removeTodo.js**

```js
/*
 * this action function returns a function, therefore, on the component
 * level, we can call it like so:
 * const callback = props.removeTodo(targetTodoId)
 * which will return a function that we can call when
 * we want to perform the action
 */
export default (states, setState, targetTodoId) => () => {
  setState({
    ...states,
    todos: states.todos.filter(todo => todo.id !== targetTodoId)
  });
};
```

# Usage

```jsx
// .. other imports

import stateful from 'react-abstract-state';
import state from './state';
import actions from './actions';

function MyComponent (props) {
  return (
    <div>
      {/* your UI logic */}
    </div>
  );
}

// at the bottom
export default stateful(
  MyComponent,
  state,
  actions
);
```

`react-abstract-state` only has a default export. It is a function which acts as an [HOC](https://reactjs.org/docs/higher-order-components.html). It accepts 3 arguments.

1. The Component itself.
2. The state which is expected to be an `Object` containing all the data you need for your component.
3. The actions which is an `Object` containing callbacks that handles the state updates.

If you don't modularize these 3 things, you would end up with something like this:

```jsx
// .. other imports

import stateful from 'react-abstract-state';

function TodosComponent (props) {
  return (
    <div>
      {/* your UI logic */}
    </div>
  );
}

// at the bottom
export default stateful(
  TodosComponent,
  {
    input: '',
    todos: []
  },
  {
    addTodo (state, setState) {
      setState({
        ...state,
        input: '',
        todos: state.todos.concat({
          id: uuid(),
          todo: state.input
        })
      });
    }
  }
);
```

#### Async actions

Yes, it is possible to use `async/await` for your actions, you can do them like so:


export default stateful(
  TodosComponent,
  {
    input: '',
    todos: []
  },
  {
    async fetchTodo (state, setState) {
      const result = await fetch('/api/todos');
      const todos = await result.json(); // will yield an array of todos

      setState({
        ...state,
        todos
      });
    }
  }
);
