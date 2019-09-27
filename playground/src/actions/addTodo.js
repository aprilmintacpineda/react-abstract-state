import uuid from 'uuid';

export default (states, setState, todo) => {
  setState({
    ...states,
    input: '',
    todos: states.todos.concat({
      id: uuid(),
      todo
    })
  });
};
