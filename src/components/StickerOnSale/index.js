import React from 'react';
import logo from '../../assets/logo.svg';
import './component.css';
/* eslint-disable react/prefer-stateless-function */
class Header extends React.Component {
  render() {
    return (
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
    );
  }
}

export default Header;
