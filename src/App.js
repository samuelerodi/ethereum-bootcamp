import React, { Component } from 'react';
import { DrizzleProvider } from 'drizzle-react';
import drizzleOptions from './config/drizzleOptions';
import { LoadingContainer } from 'drizzle-react-components';
import store from './redux/store';

//COMPONENTS
// import Header from './components/Header';
import Navbar from './components/Navbar';
// import Footer from './components/Footer';
import './App.css';

class App extends Component {
  render() {
    return (
        <DrizzleProvider options={drizzleOptions}  store={store}>
          <LoadingContainer>
            <div className="App">
              <Navbar />
              {this.props.children}
            </div>
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}

export default App;
