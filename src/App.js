import React, {Component} from 'react';
import * as Module from './modules/foo.js';

console.log(Module.foo);

export default class App extends Component {
  render() {
    return (
      // Add your component markup and other subcomponent references here.
      <h1>Hello, World!</h1>
    );
  }
}
