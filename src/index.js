/**
 * @file index.jsx
 * @author leon<lupengyu@baidu.com>
 */

var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./App.jsx');

exports.init = function () {
    ReactDOM.render(
        React.createElement(App),
        document.getElementById('app')
    );
};
