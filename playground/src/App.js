import React from 'react';
import { HashRouter, Route, Switch, Link } from 'react-router-dom';

import Todos from './routes/Todos';
import Contact from './routes/Contact';

export default () => (
  <HashRouter>
    <div>
      <Link to="/">Todos</Link> | <Link to="/contact">Contact</Link>
    </div>
    <br />
    <Route path="/" exact component={Todos} />
    <Route path="/contact" component={Contact} />
  </HashRouter>
);
