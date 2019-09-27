export default  (states, setState, ev) => {
  setState({
    ...states,
    input: ev.target.value
  });
};
