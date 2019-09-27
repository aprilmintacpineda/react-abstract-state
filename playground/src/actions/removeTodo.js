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
