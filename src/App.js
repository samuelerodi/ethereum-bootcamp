import React, { Component } from 'react';

//COMPONENTS
// import Header from './components/Header';
import Navbar from './components/Navbar';
// import Footer from './components/Footer';
import './App.css';








class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        {this.props.children}
      </div>
    );
  }
}

export default App;
