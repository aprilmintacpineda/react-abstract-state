import React from 'react';
import redefineStatics from 'redefine-statics-js';

export default (WrappedComponent, state, actions) => {
  function WrapperComponent (props) {
    this.props = props;
    this.state = state;

    this.callToAction = callback => (...rest) => callback(
      { ...this.state },
      (state, callback) => {
        this.setState(state, callback);
      },
      ...rest
    );

    const _actions = {};

    Object.keys(actions).forEach(key => {
      _actions[key] = this.callToAction(actions[key]);
    });

    this.render = () => (
      <WrappedComponent
        {...this.props}
        { ...this.state }
        { ..._actions }
      />
    );

    return this;
  }

  WrapperComponent.prototype = React.Component.prototype;
  WrapperComponent.prototype.constructor = WrapperComponent;

  redefineStatics(WrapperComponent, WrappedComponent);

  return WrapperComponent;
};
