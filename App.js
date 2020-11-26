import React, { Component } from 'react';
import { LogBox } from 'react-native';
import Router from './src/router';

export default class App extends Component {

  componentDidMount() {
    LogBox.ignoreAllLogs();
  }
  render() {
    return (
      <Router />
    )
  }
}