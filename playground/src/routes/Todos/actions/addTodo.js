import uuid from 'uuid';

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
