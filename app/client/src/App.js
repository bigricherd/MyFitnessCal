import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/Register';
import Login from './components/Login';
import Forms from './components/Forms';
import HomePage from './components/HomePage';
import Nav from './components/Nav';


function App() {


  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Nav />
          <Routes>
            <Route exact path='/' element={<HomePage />} />
            <Route exact path='/forms' element={<Forms />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/login' element={<Login />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
