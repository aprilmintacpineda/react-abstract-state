"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _redefineStaticsJs = _interopRequireDefault(require("redefine-statics-js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _default = function _default(WrappedComponent, state, actions) {
  function WrapperComponent(props) {
    var _this = this;

    this.props = props;
    this.state = state;

    this.callToAction = function (callback) {
      return function () {
        for (var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++) {
          rest[_key] = arguments[_key];
        }

        return callback.apply(void 0, [_extends({}, _this.state), function (state, callback) {
          _this.setState(state, callback);
        }].concat(rest));
      };
    };

    var _actions = {};
    Object.keys(actions).forEach(function (key) {
      _actions[key] = _this.callToAction(actions[key]);
    });

    this.render = function () {
      return _react["default"].createElement(WrappedComponent, _extends({}, _this.props, {
        singleStore: _extends({}, _this.state, {}, _actions)
      }));
    };

    return this;
  }

  WrapperComponent.prototype = _react["default"].Component.prototype;
  WrapperComponent.prototype.constructor = WrapperComponent;
  (0, _redefineStaticsJs["default"])(WrapperComponent, WrappedComponent);
  return WrapperComponent;
};

exports["default"] = _default;