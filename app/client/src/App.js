import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AddSet from './components/AddSet';
import AddExercise from './components/AddExercise';


function App() {
  const [one, setOne] = useState(true);
  const addSet = <AddSet />
  const addExercise = <AddExercise />

  return (
    <div className="App">
      <header className="App-header">
        <div className="btn-group mb-3" role="group" aria-label="Toggle between two components">
          <input type="radio" className="btn-check" name="btnradio" id="pending" checked={one} onChange={() => setOne(true)}></input>
          <label className="btn btn-outline-light" htmlFor="pending">Option one</label>

          <input type="radio" className="btn-check" name="btnradio" id="completed" checked={!one} onChange={() => setOne(false)}></input>
          <label className="btn btn-outline-light" htmlFor="completed">Option two</label>
        </div>

        {one ? addSet : addExercise}
      </header>
    </div>
  );
}

export default App;
